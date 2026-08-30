"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { assertAdmin, getCurrentMember } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import { MemberRole, MemberStatus } from "@/lib/generated/prisma/enums";
import { lootboxFromForm } from "@/lib/lootbox";
import { coreComplete, firstIncompleteStep, isStep, nextStep } from "@/lib/onboarding";
import { slugify } from "@/lib/utils";

/**
 * Mutations, exposed as server actions. Every export here is a public endpoint the
 * browser can invoke, so each one re-checks authorization on the server — never
 * assume the caller came from a page that already ran a guard.
 */

function revalidateMemberSurfaces() {
  revalidatePath("/admin/members");
  revalidatePath("/directory");
}

async function setStatus(memberId: string, status: MemberStatus) {
  const admin = await assertAdmin();

  if (memberId === admin.id && status !== MemberStatus.APPROVED) {
    throw new Error("You can't remove your own access.");
  }

  await db.member.update({
    where: { id: memberId },
    data: {
      status,
      approvedAt: status === MemberStatus.APPROVED ? new Date() : null,
      approvedById: status === MemberStatus.APPROVED ? admin.id : null,
    },
  });

  revalidateMemberSurfaces();
}

export async function approveMember(memberId: string) {
  await setStatus(memberId, MemberStatus.APPROVED);
}

export async function rejectMember(memberId: string) {
  await setStatus(memberId, MemberStatus.REJECTED);
}

export async function suspendMember(memberId: string) {
  await setStatus(memberId, MemberStatus.SUSPENDED);
}

export async function setMemberRole(memberId: string, role: MemberRole) {
  const admin = await assertAdmin();

  if (memberId === admin.id && role !== MemberRole.ADMIN) {
    throw new Error("You can't remove your own admin rights.");
  }

  // Don't allow the last admin to disappear — that locks everyone out of approvals.
  if (role !== MemberRole.ADMIN) {
    const admins = await db.member.count({
      where: { role: MemberRole.ADMIN, status: MemberStatus.APPROVED },
    });
    if (admins <= 1) throw new Error("At least one admin must remain.");
  }

  await db.member.update({ where: { id: memberId }, data: { role } });
  revalidateMemberSurfaces();
}

// --- Own profile ---

function optional(formData: FormData, key: string) {
  const value = (formData.get(key) as string | null)?.trim();
  return value ? value : null;
}

/**
 * Who may write their own profile.
 *
 * Pending members are allowed, which is the whole premise of onboarding at
 * /welcome: the row already exists the moment they sign in, and letting them
 * fill it in while an admin reviews them is what stops the directory being empty
 * on day one. Approval controls what you can *see*, not whether you may describe
 * yourself.
 *
 * Rejected and suspended accounts are not — those are decisions, and a decision
 * you can still write through isn't one.
 */
const PROFILE_WRITERS: MemberStatus[] = [MemberStatus.PENDING, MemberStatus.APPROVED];

async function requireProfileWriter() {
  const member = await getCurrentMember();
  if (!member || !PROFILE_WRITERS.includes(member.status)) {
    throw new Error("You can't edit this profile.");
  }
  return member;
}

/**
 * Free-text tags, deduped by slug. Created on demand so the vocabulary grows
 * from actual use rather than from a list an admin has to maintain.
 */
async function resolveExpertiseIds(raw: string | null) {
  const labels = (raw ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .slice(0, 12);

  const tagIds: string[] = [];
  for (const label of labels) {
    const slug = slugify(label);
    if (!slug || tagIds.length >= 12) continue;
    const tag = await db.expertiseTag.upsert({
      where: { slug },
      update: {},
      create: { slug, label },
    });
    if (!tagIds.includes(tag.id)) tagIds.push(tag.id);
  }
  return tagIds;
}

function revalidateProfile(memberId: string) {
  revalidatePath("/me");
  revalidatePath("/directory");
  revalidatePath(`/directory/${memberId}`);
}

export async function updateOwnProfile(formData: FormData) {
  const member = await requireProfileWriter();

  const departmentId = optional(formData, "departmentId");
  const tagIds = await resolveExpertiseIds(formData.get("expertise") as string | null);

  const links = {
    linkedin: optional(formData, "linkedin"),
    lark: optional(formData, "lark"),
    portfolio: optional(formData, "portfolio"),
  };
  const hasLinks = Object.values(links).some(Boolean);

  // Written on every save, including when it comes back empty — that is how
  // someone clears an item out again.
  const lootbox = lootboxFromForm(formData);

  await db.member.update({
    where: { id: member.id },
    data: {
      title: optional(formData, "title"),
      cohort: optional(formData, "cohort"),
      departmentId,
      bio: optional(formData, "bio"),
      location: optional(formData, "location"),
      timezone: optional(formData, "timezone"),
      links: hasLinks ? links : undefined,
      lootbox,
      expertise: { set: tagIds.map((id) => ({ id })) },
    },
  });

  revalidateProfile(member.id);
}

// --- Onboarding ---

/**
 * Save one step of the /welcome flow and move to the next.
 *
 * One action for all four steps rather than four actions, because the steps
 * differ only in which fields they touch and each is a plain form post. It
 * validates *only* the step it was handed — someone on step 3 must not be told
 * their step 1 is wrong — and reports failure by redirecting back with the
 * missing field names in the URL, so the flow needs no client state and works
 * with JavaScript off.
 */
export async function saveOnboardingStep(formData: FormData) {
  const member = await requireProfileWriter();

  const raw = formData.get("step");
  if (!isStep(raw)) throw new Error("Unknown onboarding step.");
  const step = raw;

  const missing: string[] = [];
  let data: Prisma.MemberUpdateInput = {};

  if (step === "role") {
    const title = optional(formData, "title");
    const departmentId = optional(formData, "departmentId");
    if (!title) missing.push("title");
    if (!departmentId) missing.push("departmentId");

    data = {
      title,
      cohort: optional(formData, "cohort"),
      department: departmentId ? { connect: { id: departmentId } } : { disconnect: true },
    };
  }

  if (step === "about") {
    const tagIds = await resolveExpertiseIds(formData.get("expertise") as string | null);
    if (tagIds.length === 0) missing.push("expertise");

    data = {
      bio: optional(formData, "bio"),
      expertise: { set: tagIds.map((id) => ({ id })) },
    };
  }

  if (step === "lootbox") {
    data = { lootbox: lootboxFromForm(formData) };
  }

  if (step === "reach") {
    const links = {
      linkedin: optional(formData, "linkedin"),
      lark: optional(formData, "lark"),
      portfolio: optional(formData, "portfolio"),
    };
    data = {
      location: optional(formData, "location"),
      timezone: optional(formData, "timezone"),
      links: Object.values(links).some(Boolean) ? links : Prisma.DbNull,
    };
  }

  // Nothing is written when a required field is absent: a half-saved step would
  // leave the profile in a state the flow never showed them.
  if (missing.length > 0) {
    redirect(`/welcome?step=${step}&missing=${missing.join(",")}`);
  }

  const last = nextStep(step) === null;
  await db.member.update({
    where: { id: member.id },
    // Stamped on the final step only — reaching the end is what "onboarded"
    // means, not answering the first question.
    data: last ? { ...data, onboardedAt: new Date() } : data,
  });

  revalidateProfile(member.id);
  redirect(last ? "/welcome?step=done" : `/welcome?step=${nextStep(step)}`);
}

/**
 * Leave the optional steps unanswered and finish anyway.
 *
 * Still stamps `onboardedAt`: they were offered the steps and declined, which is
 * a different state from never having been asked, and the home-page nudge reads
 * the difference.
 */
export async function skipOnboarding() {
  const member = await requireProfileWriter();

  // A server action is a public endpoint, so this can be called from a step that
  // never renders the skip button. Skipping the *optional* steps is the offer;
  // skipping the required ones is not, so an incomplete profile is sent back to
  // whichever answer is missing rather than being marked done.
  if (!coreComplete(member)) redirect(`/welcome?step=${firstIncompleteStep(member)}`);

  await db.member.update({ where: { id: member.id }, data: { onboardedAt: new Date() } });
  revalidateProfile(member.id);
  redirect("/welcome?step=done");
}
