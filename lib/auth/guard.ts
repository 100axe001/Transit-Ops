import { redirect } from "next/navigation";
import { getSession, type SessionPayload } from "@/lib/auth";
import { hasPermission, type Permission } from "@/lib/permissions";

/**
 * Thrown by `requirePermission` when the current user may not perform an action.
 * Server actions catch this and surface `message` back to the client.
 */
export class AuthorizationError extends Error {
  constructor(message = "You do not have permission to perform this action.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

/**
 * Server-side authorization gate for **server actions** (mutations).
 * Deny-by-default: throws if the caller is not authenticated or lacks the
 * required permission. The user's role comes from the verified JWT session,
 * never from client input.
 */
export async function requirePermission(
  permission: Permission
): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new AuthorizationError("You must be signed in to do that.");
  }
  if (!hasPermission(session.role, permission)) {
    throw new AuthorizationError();
  }
  return session;
}

/**
 * Server-side authorization gate for **pages** (read access). Redirects
 * unauthenticated users to /login and unauthorized roles to /dashboard,
 * so a role can't reach a page just by typing its URL.
 */
export async function requirePageAccess(
  permission: Permission
): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!hasPermission(session.role, permission)) redirect("/dashboard");
  return session;
}
