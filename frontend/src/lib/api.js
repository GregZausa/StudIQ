const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export const createCheckout = async (plan, accessToken) => {
  const res = await fetch(`${BACKEND_URL}/api/payment/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ plan }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to create checkout");
  }

  return data.checkoutUrl;
};
