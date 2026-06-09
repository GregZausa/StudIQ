import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

/**
 * Verifies the Supabase JWT from the Authorization header.
 * Attaches `req.user` (Supabase auth user) and `req.userRow` (your users table row).
 */
export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const token = authHeader.replace("Bearer ", "");

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser(token);

  if (authErr || !user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const { data: userRow, error: userErr } = await supabase
    .from("users")
    .select("user_id, name")
    .eq("auth_id", user.id)
    .single();

  if (userErr || !userRow) {
    return res.status(404).json({ error: "User not found" });
  }

  req.user = user;
  req.userRow = userRow;
  next();
};
