"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Verifies the caller is an authenticated admin user.
 * Checks app_metadata.role === "admin" — set this in the Supabase dashboard
 * on every admin account (Authentication → Users → Edit user → app_metadata).
 * Throws if not authenticated or not an admin.
 */
export async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  const isAdmin = user.app_metadata?.role === "admin";
  if (!isAdmin) {
    throw new Error("Forbidden");
  }

  return user;
}
