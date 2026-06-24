import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { supabase } from "../config/supabase";
import { getUserByAuthId, createUserRow } from "../config/user";

const UserContext = createContext(null);

// ─── Anonymous localStorage helpers ──────────────────────────────────────────
const ANON_KEY = "studiq_anon_data";

export const getAnonData = () => {
  try {
    return JSON.parse(localStorage.getItem(ANON_KEY) || "{}");
  } catch {
    return {};
  }
};

export const setAnonData = (data) => {
  try {
    localStorage.setItem(ANON_KEY, JSON.stringify(data));
  } catch {}
};

export const updateAnonData = (key, value) => {
  const current = getAnonData();
  setAnonData({ ...current, [key]: value });
};

export const getAnonList = (key) => {
  return getAnonData()[key] || [];
};

export const setAnonList = (key, list) => {
  updateAnonData(key, list);
};

// ─── UserProvider ─────────────────────────────────────────────────────────────
export const UserProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserRow = useCallback(async (authId) => {
    try {
      let row = await getUserByAuthId(authId);
      if (!row) row = await createUserRow(authId);
      setUser(row || null);
    } catch (err) {
      console.error("loadUserRow error:", err);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!mounted) return;

        setSession(session);

        if (session?.user) {
          loadUserRow(session.user.id); // fire and forget — don't block loading
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("initialize error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      setSession(session);
      if (session?.user) {
        loadUserRow(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadUserRow]);

  const refreshUser = useCallback(async () => {
    if (!session?.user) return;
    try {
      const row = await getUserByAuthId(session.user.id);
      if (row) setUser(row);
    } catch (err) {
      console.error("refreshUser error:", err);
    }
  }, [session]);

  const userId = user?.user_id ?? null;
  const name = user?.name ?? "";
  const isLoggedIn = !!session;
  const isAnon = !isLoggedIn; // not logged in = anonymous
  const needsOnboarding = isLoggedIn && (!name || name === "Anonymous");

  return (
    <UserContext.Provider
      value={{
        session,
        user,
        userId,
        name,
        loading,
        isLoggedIn,
        isAnon,
        needsOnboarding,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
