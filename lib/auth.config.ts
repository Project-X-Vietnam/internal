import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Edge-safe half of the Auth.js config.
 *
 * `middleware.ts` runs on the Edge runtime and cannot import `lib/db.ts` (it pulls
 * in `pg`, which is Node-only). So the provider list and page routing live here,
 * and every database-touching callback lives in `lib/auth.ts` instead.
 *
 * Sign-in is open to any Google account on purpose — PJX volunteers use personal
 * Gmail, so membership is decided by the admin approval queue, not by domain.
 */
export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Google is the only provider, so linking by verified email is safe here.
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
} satisfies NextAuthConfig;
