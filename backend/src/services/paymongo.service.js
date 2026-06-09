const PAYMONGO_BASE_URL = "https://api.paymongo.com/v1";

const getAuthHeader = () =>
  `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64")}`;

export const createPaymentLink = async ({ amount, description, remarks }) => {
  const res = await fetch(`${PAYMONGO_BASE_URL}/checkout_sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify({
      data: {
        attributes: {
          billing: { name: "StudIQ User" },
          line_items: [
            {
              currency: "PHP",
              amount,
              description,
              name: description,
              quantity: 1,
            },
          ],
          payment_method_types: ["card", "gcash", "qrph"],
          success_url: `${process.env.FRONTEND_URL}/dashboard/billing?payment=success`,
          cancel_url: `${process.env.FRONTEND_URL}/pricing`,
          description,
          metadata: { remarks },
        },
      },
    }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(JSON.stringify(data));

  return {
    linkId: data.data.id,
    checkoutUrl: data.data.attributes.checkout_url,
  };
};
