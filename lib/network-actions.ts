"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { assertAdmin, getCurrentMember } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { resolveExpertiseIds } from "@/lib/expertise";
import { Prisma } from "@/lib/generated/prisma/client";
import { EngagementRole, MemberStatus, PersonKind } from "@/lib/generated/prisma/enums";
import { isEngagementRole } from "@/lib/network";

/**
 * Network mutations, exposed as server actions. Every export is a public
 * endpoint the browser can invoke, so each re-checks authorization — admin for
 * everything except a member editing their own role history.
 *
 * Stewardship decision (2026-09): admins own network data. The one self-service
 * surface is your own engagement list, because your own history is the slice
 * you know best — and even there, `note` never passes through: notes are
 * admin-only in both directions.
 */

function revalidateNetworkSurfaces(...memberIds: (string | undefined)[]) {
  revalidatePath("/directory");
  revalidatePath("/admin/network");
  for (const id of memberIds) {
    if (!id) continue;
    revalidatePath(`/directory/${id}`);
    revalidatePath(`/admin/network/${id}`);
  }
}

function optional(formData: FormData, key: string) {
  const value = (formData.get(key) as string | null)?.trim();
  return value ? value : null;
}

function isUniqueViolation(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

/** Same rule as profile writes: pending and approved accounts may describe themselves. */
const SELF_WRITERS: MemberStatus[] = [MemberStatus.PENDING, MemberStatus.APPROVED];

async function requireSelfWriter() {
  const member = await getCurrentMember();
  if (!member || !SELF_WRITERS.includes(member.status)) {
    throw new Error("You can't edit this history.");
  }
  return member;
}

// --- Engagement parsing, shared by the admin and self-service forms ---

function parseYear(formData: FormData, key: string, required: boolean) {
  const raw = optional(formData, key);
  if (!raw) {
    if (required) throw new Error("An engagement needs a year.");
    return null;
  }
  const year = Number.parseInt(raw, 10);
  if (!Number.isFinite(year) || year < 1990 || year > 2100) {
    throw new Error(`"${raw}" doesn't look like a year.`);
  }
  return year;
}

/**
 * One parser for both forms; `allowNote` is the only difference. Program
 * editions are upserted here on demand — an edition is a program-year that some
 * engagement names, not something anyone curates.
 */
async function parseEngagement(formData: FormData, options: { allowNote: boolean }) {
  const role = formData.get("role");
  if (!isEngagementRole(role)) throw new Error("Pick a role for this engagement.");

  const startYear = parseYear(formData, "startYear", true)!;
  let endYear = parseYear(formData, "endYear", false);
  if (endYear !== null && endYear < startYear) {
    throw new Error("An engagement can't end before it starts.");
  }

  // The affiliation is upserted by exact name — a datalist offers existing
  // organizations so the same partner doesn't accrete spelling variants.
  const organizationName = optional(formData, "organization");
  if (role === EngagementRole.PARTNER && !organizationName) {
    throw new Error("A partner engagement names the organization they represent.");
  }
  const organization = organizationName
    ? await db.organization.upsert({
        where: { name: organizationName },
        update: {},
        create: { name: organizationName },
      })
    : null;

  // A program engagement belongs to one annual edition, so it is bounded by it.
  const programId = optional(formData, "programId");
  let editionId: string | null = null;
  if (programId) {
    const edition = await db.programEdition.upsert({
      where: { programId_year: { programId, year: startYear } },
      update: {},
      create: { programId, year: startYear },
    });
    editionId = edition.id;
    endYear = startYear;
  }

  return {
    role,
    title: optional(formData, "title"),
    departmentId: optional(formData, "departmentId"),
    organizationId: organization?.id ?? null,
    editionId,
    startYear,
    endYear,
    ...(options.allowNote ? { note: optional(formData, "note") } : {}),
  };
}

// --- Own history ---

export async function addOwnEngagement(formData: FormData) {
  const member = await requireSelfWriter();
  const data = await parseEngagement(formData, { allowNote: false });

  await db.engagement.create({
    data: { ...data, memberId: member.id, createdById: member.id },
  });
  revalidatePath("/me");
  revalidateNetworkSurfaces(member.id);
}

export async function deleteOwnEngagement(engagementId: string) {
  const member = await requireSelfWriter();

  // deleteMany rather than delete: the where carries the ownership check, so a
  // guessed id belonging to someone else deletes nothing instead of throwing
  // after the fact.
  await db.engagement.deleteMany({ where: { id: engagementId, memberId: member.id } });
  revalidatePath("/me");
  revalidateNetworkSurfaces(member.id);
}

// --- People (admin) ---

export async function adminCreateContact(formData: FormData) {
  await assertAdmin();

  const name = optional(formData, "name");
  if (!name) throw new Error("A contact needs a name.");

  const email = optional(formData, "email")?.toLowerCase() ?? null;
  const tagIds = await resolveExpertiseIds(formData.get("expertise") as string | null);

  let id: string;
  try {
    const contact = await db.member.create({
      data: {
        name,
        email,
        kind: PersonKind.CONTACT,
        // Never APPROVED: approval is what lets a signed-in account through the
        // guards, and a contact must not become a door someone can walk in by
        // signing up with a matching email.
        status: MemberStatus.PENDING,
        title: optional(formData, "title"),
        location: optional(formData, "location"),
        note: optional(formData, "note"),
        expertise: { connect: tagIds.map((tagId) => ({ id: tagId })) },
      },
    });
    id = contact.id;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new Error(
        `Someone with the email ${email} already exists — add engagements to their record instead.`,
      );
    }
    throw error;
  }

  revalidateNetworkSurfaces(id);
  redirect(`/admin/network/${id}`);
}

export async function adminUpdatePerson(memberId: string, formData: FormData) {
  await assertAdmin();

  const person = await db.member.findUnique({
    where: { id: memberId },
    select: { kind: true },
  });
  if (!person) throw new Error("That person no longer exists.");

  // Accounts own their identity — name and photo come from Google, the rest
  // from /me. The admin-editable part of an account is the note alone.
  if (person.kind === PersonKind.ACCOUNT) {
    await db.member.update({
      where: { id: memberId },
      data: { note: optional(formData, "note") },
    });
    revalidateNetworkSurfaces(memberId);
    return;
  }

  const name = optional(formData, "name");
  if (!name) throw new Error("A contact needs a name.");
  const tagIds = await resolveExpertiseIds(formData.get("expertise") as string | null);

  try {
    await db.member.update({
      where: { id: memberId },
      data: {
        name,
        email: optional(formData, "email")?.toLowerCase() ?? null,
        title: optional(formData, "title"),
        location: optional(formData, "location"),
        note: optional(formData, "note"),
        expertise: { set: tagIds.map((tagId) => ({ id: tagId })) },
      },
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new Error("Another record already uses that email.");
    }
    throw error;
  }

  revalidateNetworkSurfaces(memberId);
}

export async function adminDeleteContact(memberId: string) {
  await assertAdmin();

  const person = await db.member.findUnique({
    where: { id: memberId },
    select: { kind: true },
  });
  if (!person) return;
  // Accounts are never deleted from here — access decisions (suspend, reject)
  // live in /admin/members, and deleting one would erase approvals it granted.
  if (person.kind !== PersonKind.CONTACT) {
    throw new Error("Only contacts can be deleted. Accounts are managed in Members.");
  }

  await db.member.delete({ where: { id: memberId } });
  revalidateNetworkSurfaces(memberId);
  redirect("/admin/network");
}

// --- Engagements (admin) ---

export async function adminAddEngagement(memberId: string, formData: FormData) {
  const admin = await assertAdmin();
  const data = await parseEngagement(formData, { allowNote: true });

  const exists = await db.member.findUnique({ where: { id: memberId }, select: { id: true } });
  if (!exists) throw new Error("That person no longer exists.");

  await db.engagement.create({
    data: { ...data, memberId, createdById: admin.id },
  });
  revalidateNetworkSurfaces(memberId);
}

export async function adminDeleteEngagement(engagementId: string) {
  await assertAdmin();
  const removed = await db.engagement.delete({
    where: { id: engagementId },
    select: { memberId: true },
  });
  revalidateNetworkSurfaces(removed.memberId);
}

// --- Organizations (admin) ---

export async function adminCreateOrganization(formData: FormData) {
  await assertAdmin();

  const name = optional(formData, "name");
  if (!name) throw new Error("An organization needs a name.");

  try {
    await db.organization.create({
      data: {
        name,
        website: optional(formData, "website"),
        note: optional(formData, "note"),
      },
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new Error(`There's already an organization called "${name}".`);
    }
    throw error;
  }
  revalidatePath("/admin/network");
}

export async function adminUpdateOrganization(organizationId: string, formData: FormData) {
  await assertAdmin();

  const name = optional(formData, "name");
  if (!name) throw new Error("An organization needs a name.");

  try {
    await db.organization.update({
      where: { id: organizationId },
      data: {
        name,
        website: optional(formData, "website"),
        note: optional(formData, "note"),
      },
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new Error(`There's already an organization called "${name}".`);
    }
    throw error;
  }
  revalidatePath("/admin/network");
  revalidatePath(`/admin/network/orgs/${organizationId}`);
}

export async function adminDeleteOrganization(organizationId: string) {
  await assertAdmin();

  // Deleting one would only strip the affiliation off its engagements (the FK
  // is SET NULL), which reads as history quietly losing a fact. Detach first.
  const held = await db.engagement.count({ where: { organizationId } });
  if (held > 0) {
    throw new Error(
      `That organization is named on ${held} ${held === 1 ? "engagement" : "engagements"}. Remove those first.`,
    );
  }

  await db.organization.delete({ where: { id: organizationId } });
  revalidatePath("/admin/network");
  redirect("/admin/network");
}

// --- Connections (admin) ---

export async function adminAddConnection(formData: FormData) {
  const admin = await assertAdmin();

  const personId = optional(formData, "personId");
  const otherId = optional(formData, "otherId");
  const label = optional(formData, "label");
  if (!personId || !otherId) throw new Error("A connection needs two people.");
  if (personId === otherId) throw new Error("A connection joins two different people.");
  if (!label) throw new Error("Say how they're connected — that's the whole record.");

  // Stored once per pair, in a fixed order, so the same edge can't hide twice.
  const [aId, bId] = [personId, otherId].sort();

  try {
    await db.connection.create({
      data: { aId, bId, label, note: optional(formData, "note"), createdById: admin.id },
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new Error("Those two are already connected with that label.");
    }
    throw error;
  }

  revalidateNetworkSurfaces(personId, otherId);
}

export async function adminDeleteConnection(connectionId: string) {
  await assertAdmin();
  const removed = await db.connection.delete({
    where: { id: connectionId },
    select: { aId: true, bId: true },
  });
  revalidateNetworkSurfaces(removed.aId, removed.bId);
}
