"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Verifies the caller is an authenticated Supabase user.
 * Call this at the top of every admin-only server action.
 * Throws if not authenticated — Next.js will surface this as a 500,
 * which is the correct behaviour for unauthenticated server action calls.
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

  return user;
}
