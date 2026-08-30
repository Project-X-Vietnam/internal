import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { db } from "@/lib/db";
import { MemberRole, MemberStatus } from "@/lib/generated/prisma/enums";

/** Emails auto-approved as ADMIN on first sign-in — otherwise nobody can approve the first admin. */
function bootstrapAdminEmails(): string[] {
  return (process.env.BOOTSTRAP_ADMIN_EMAILS ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Create or refresh the Member row behind a Google identity.
 *
 * Matches on googleSub first (stable even if someone changes their Google email),
 * then falls back to email for rows created before a sub was recorded.
 */
async function upsertMemberFromGoogle(input: {
  email: string;
  name: string;
  avatarUrl: string | null;
  googleSub: string | null;
}) {
  const { email, name, avatarUrl, googleSub } = input;
  const isBootstrapAdmin = bootstrapAdminEmails().includes(email);

  const existing =
    (googleSub ? await db.member.findUnique({ where: { googleSub } }) : null) ??
    (await db.member.findUnique({ where: { email } }));

  if (!existing) {
    await db.member.create({
      data: {
        email,
        name,
        avatarUrl,
        googleSub,
        status: isBootstrapAdmin ? MemberStatus.APPROVED : MemberStatus.PENDING,
        role: isBootstrapAdmin ? MemberRole.ADMIN : MemberRole.MEMBER,
        approvedAt: isBootstrapAdmin ? new Date() : null,
        lastSeenAt: new Date(),
      },
    });
    return;
  }

  // Never downgrade an existing decision here — approval and rejection are the
  // admin queue's job. Bootstrap admins are the one exception, so that a locked-out
  // owner can always recover access by adding themselves to the env var.
  const promote =
    isBootstrapAdmin && existing.status !== MemberStatus.APPROVED
      ? {
          status: MemberStatus.APPROVED,
          role: MemberRole.ADMIN,
          approvedAt: new Date(),
        }
      : {};

  await db.member.update({
    where: { id: existing.id },
    data: {
      name,
      avatarUrl,
      email,
      googleSub: googleSub ?? existing.googleSub,
      lastSeenAt: new Date(),
      ...promote,
    },
  });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async signIn({ user, profile }) {
      const email = user.email?.toLowerCase();
      if (!email) return false;

      await upsertMemberFromGoogle({
        email,
        name: user.name?.trim() || profile?.name?.trim() || email,
        avatarUrl: user.image ?? null,
        googleSub: typeof profile?.sub === "string" ? profile.sub : null,
      });

      // Always grant the session. Whether they may actually *see* anything is
      // decided per-request by lib/auth-guards.ts, which sends unapproved members
      // to /pending rather than an opaque OAuth error page.
      return true;
    },

    async session({ session, token }) {
      if (session.user && token.email) session.user.email = token.email;
      return session;
    },
  },
});
