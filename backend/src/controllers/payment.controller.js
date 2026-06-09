import { createPaymentLink } from "../services/paymongo.service.js";
import {
  upsertPending,
  activateSubscription,
  markFailed,
} from "../models/subscription.model.js";
import crypto from "crypto";

const PLANS = {
  monthly: { amount: 9900, description: "StudIQ Premium — Monthly (₱99/mo)" },
  yearly: {
    amount: 99900,
    description: "StudIQ Premium — Yearly (₱999/yr, save ₱189)",
  },
};

const getPeriodEnd = (plan) => {
  const now = new Date();
  if (plan === "yearly") {
    return new Date(now.setFullYear(now.getFullYear() + 1)).toISOString();
  }
  return new Date(now.setMonth(now.getMonth() + 1)).toISOString();
};

const verifySignature = (rawBody, signatureHeader) => {
  if (!signatureHeader || !process.env.PAYMONGO_WEBHOOK_SECRET) return false;

  const parts = {};
  signatureHeader.split(",").forEach((part) => {
    const [key, val] = part.split("=");
    parts[key] = val;
  });

  const timestamp = parts["t"];
  const signature = parts["li"] || parts["te"];

  if (!timestamp || !signature) return false;

  const toSign = `${timestamp}.${rawBody}`;
  const expected = crypto
    .createHmac("sha256", process.env.PAYMONGO_WEBHOOK_SECRET)
    .update(toSign)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expected, "hex"),
    );
  } catch {
    return false;
  }
};

export const checkout = async (req, res) => {
  const { plan } = req.body;

  if (!PLANS[plan]) {
    return res.status(400).json({ error: "Invalid plan" });
  }

  const { user, userRow } = req;
  const planConfig = PLANS[plan];

  try {
    const { linkId, checkoutUrl } = await createPaymentLink({
      amount: planConfig.amount,
      description: planConfig.description,
      remarks: `${plan}|${userRow.user_id}|${user.id}`,
    });

    const { error: dbErr } = await upsertPending({
      userId: userRow.user_id,
      plan,
      linkId,
    });

    if (dbErr) {
      console.error("Supabase upsert error:", dbErr);
      return res.status(500).json({ error: "Failed to record subscription" });
    }

    return res.status(200).json({ checkoutUrl });
  } catch (err) {
    console.error("Checkout error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const webhook = async (req, res) => {
  const rawBody = req.body.toString("utf8");
  const sigHeader = req.headers["paymongo-signature"];

  if (!verifySignature(rawBody, sigHeader)) {
    console.error("Invalid PayMongo webhook signature");
    return res.status(401).json({ error: "Invalid signature" });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const eventType = event?.data?.attributes?.type;
  const resource = event?.data?.attributes?.data;

  console.log("PayMongo webhook event:", eventType);

  try {
    if (
      eventType === "payment.paid" ||
      eventType === "link.payment.paid" ||
      eventType === "checkout_session.payment.paid"
    ) {
      const remarks =
        event?.data?.attributes?.data?.attributes?.metadata?.remarks ||
        resource?.attributes?.metadata?.remarks ||
        resource?.attributes?.description ||
        "";

      const [plan, userId] = remarks.split("|");

      if (!userId || !plan) {
        console.error("Missing userId or plan in remarks:", remarks);
        return res.status(200).json({ received: true });
      }

      const { error } = await activateSubscription({
        userId,
        plan,
        paymentId: resource?.id,
        periodEnd: getPeriodEnd(plan),
      });

      if (error) {
        console.error("Supabase upsert error:", error);
        return res.status(500).json({ error: "DB update failed" });
      }

      console.log(`✅ Subscription activated — user: ${userId}, plan: ${plan}`);
    }

    if (eventType === "payment.failed") {
      const remarks = resource?.attributes?.remarks || "";
      const [, userId] = remarks.split("|");

      if (userId) {
        await markFailed(userId);
        console.log(`❌ Payment failed — user: ${userId}`);
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
