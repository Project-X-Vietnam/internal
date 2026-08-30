import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { MemberRole, MemberStatus } from "@/lib/generated/prisma/enums";
import { coreComplete } from "@/lib/onboarding";

/**
 * The database half of the authorization split.
 *
 * middleware.ts answers "is there a valid session?" on the Edge without a database.
 * These answer "what may this person actually do?" against live rows, so an admin's
 * approval or suspension takes effect on the member's very next request instead of
 * whenever their token happens to refresh.
 */

const MEMBER_INCLUDE = {
  department: true,
  expertise: { orderBy: { label: "asc" } },
} as const;

export type CurrentMember = NonNullable<Awaited<ReturnType<typeof getCurrentMember>>>;

export async function getCurrentMember() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (!email) return null;

  return db.member.findUnique({
    where: { email },
    include: MEMBER_INCLUDE,
  });
}

/**
 * Approved members with a usable profile. Anyone else is sent to sign-in or to
 * the onboarding flow.
 *
 * The second redirect is what makes "core fields required" actually true. Most
 * people meet it on the way in, at /welcome, while their account is pending —
 * but two groups reach APPROVED without ever passing through: bootstrap admins,
 * who are auto-approved on first sign-in, and everyone approved before the flow
 * existed. They get walked through it once, here.
 */
export async function requireApprovedMember() {
  const member = await getCurrentMember();
  if (!member) redirect("/signin");
  if (member.status !== MemberStatus.APPROVED) redirect("/welcome");
  if (!coreComplete(member)) redirect("/welcome");
  return member;
}

/** Approved admins only. Non-admins get the directory, not a dead end. */
export async function requireAdmin() {
  const member = await requireApprovedMember();
  if (member.role !== MemberRole.ADMIN) redirect("/directory");
  return member;
}

/** For server actions, where redirecting on failure would mask a bug. */
export async function assertAdmin() {
  const member = await getCurrentMember();
  if (!member || member.status !== MemberStatus.APPROVED || member.role !== MemberRole.ADMIN) {
    throw new Error("Admin authorization required.");
  }
  return member;
}

export async function countPendingMembers() {
  return db.member.count({ where: { status: MemberStatus.PENDING } });
}
