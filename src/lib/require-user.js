import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

/**
 * Resolve the current Better Auth session on the server and protect a page.
 * Keep the destination in the callback so login can return the reader here.
 */
export async function requireUser(callbackPath) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackPath)}`);
  }

  return session;
}
