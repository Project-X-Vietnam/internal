import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

/**
 * One door: every page requires a signed-in member, THEIA included.
 *
 * The listed prefixes skip the JWT check because each one has to be able to
 * render *something* to a visitor without a session — a sign-in form, or the
 * onboarding flow, which then does its own `getCurrentMember` check and sends
 * anyone anonymous back to /signin.
 *
 * This is only the coarse check — it verifies the JWT and nothing else, because
 * middleware runs on the Edge and cannot reach the database. Approval status and
 * admin rights are enforced per-request in lib/auth-guards.ts.
 *
 * To reopen THEIA to non-members (e.g. to run the game at an onboarding event),
 * add "/artifacts/theia" and the prop routes to PUBLIC_PREFIXES below.
 */
const PUBLIC_PREFIXES = ["/signin", "/pending", "/welcome"];

export default auth((req) => {
  const { pathname, search } = req.nextUrl;

  if (PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return NextResponse.next();
  }

  if (req.auth) return NextResponse.next();

  const signInUrl = new URL("/signin", req.nextUrl.origin);
  // Send them back where they were headed once they're through.
  if (pathname !== "/") signInUrl.searchParams.set("from", `${pathname}${search}`);
  return NextResponse.redirect(signInUrl);
});

export const config = {
  matcher: [
    /*
     * Everything except:
     *   api/auth/*  — the OAuth handshake itself
     *   _next/*     — build output
     *   anything with a file extension — fonts, favicon, /data/m1-seed.sql,
     *                 sql-wasm.wasm. THEIA's M1 playground fetches these, and a
     *                 mid-game session expiry redirecting a .wasm request to HTML
     *                 fails in a way that is very hard to debug.
     */
    "/((?!api/auth|_next/|.*\\.).*)",
  ],
};
