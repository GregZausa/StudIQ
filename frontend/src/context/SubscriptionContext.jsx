import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "../config/supabase";
import { useUser } from "./UserContext";

const SubscriptionContext = createContext(null);

export const SubscriptionProvider = ({ children }) => {
  const { userId } = useUser();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error(error);
      setSubscription({
        status: "free",
        plan: "free",
      });
    } else if (!data) {
      setSubscription({
        status: "free",
        plan: "free",
      });
    } else {
      if (
        data.status === "active" &&
        data.current_period_end &&
        new Date(data.current_period_end) < new Date()
      ) {
        setSubscription({
          ...data,
          status: "expired",
        });
      } else {
        setSubscription(data);
      }
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const isPremium = subscription?.status === "active";
  const plan = subscription?.plan || "free";
  const periodEnd = subscription?.current_period_end;
  const isCancelled = subscription?.status === "cancelled";

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isPremium,
        plan,
        periodEnd,
        isCancelled,
        loading,
        refresh: fetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
