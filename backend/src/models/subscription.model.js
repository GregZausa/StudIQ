import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export const upsertPending = async ({ userId, plan, linkId }) =>
  supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      status: "pending",
      plan,
      paymongo_link_id: linkId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

export const activateSubscription = async ({
  userId,
  plan,
  paymentId,
  periodEnd,
}) =>
  supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      status: "active",
      plan,
      paymongo_payment_id: paymentId,
      current_period_start: new Date().toISOString(),
      current_period_end: periodEnd,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

export const markFailed = async (userId) =>
  supabase
    .from("subscriptions")
    .update({ status: "failed", updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("status", "pending");
