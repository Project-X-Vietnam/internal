/**
 * Network reads. Deliberately NOT a "use server" module, for the same reason as
 * lib/members.ts — these must not become client-callable endpoints. Mutations
 * live in lib/network-actions.ts.
 *
 * Two shapes on purpose:
 *
 *   *Public* selects never include a `note` column. Notes are admin-only by
 *   decision, and the reliable way to keep a column off the wire is to never
 *   select it — not to select it and hope every caller remembers to strip it.
 *
 *   *ForAdmin* reads include notes, and may only be called from pages/actions
 *   that have already asserted admin.
 */
import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";
import { EngagementRole, MemberStatus, PersonKind } from "@/lib/generated/prisma/enums";

export const ROLE_LABELS: Record<EngagementRole, string> = {
  [EngagementRole.TEAM]: "Team",
  [EngagementRole.FELLOW]: "Fellow",
  [EngagementRole.SPEAKER]: "Speaker",
  [EngagementRole.MENTOR]: "Mentor",
  [EngagementRole.TRAINER]: "Trainer",
  [EngagementRole.ADVISOR]: "Advisor",
  [EngagementRole.PARTNER]: "Partner",
  [EngagementRole.OTHER]: "Other",
};

export function isEngagementRole(value: unknown): value is EngagementRole {
  return typeof value === "string" && value in ROLE_LABELS;
}

// --- Engagements ---

const ENGAGEMENT_PUBLIC_SELECT = {
  id: true,
  role: true,
  title: true,
  startYear: true,
  endYear: true,
  department: { select: { id: true, name: true } },
  organization: { select: { id: true, name: true, website: true } },
  edition: {
    select: {
      id: true,
      year: true,
      label: true,
      program: { select: { id: true, name: true, slug: true } },
    },
  },
} satisfies Prisma.EngagementSelect;

export type PublicEngagement = Prisma.EngagementGetPayload<{
  select: typeof ENGAGEMENT_PUBLIC_SELECT;
}>;

/** Newest first. Ties (same start year) put the ongoing one on top. */
const ENGAGEMENT_ORDER = [
  { startYear: "desc" },
  { endYear: { sort: "desc", nulls: "first" } },
  { createdAt: "desc" },
] satisfies Prisma.EngagementOrderByWithRelationInput[];

export async function listEngagementsFor(memberId: string): Promise<PublicEngagement[]> {
  return db.engagement.findMany({
    where: { memberId },
    select: ENGAGEMENT_PUBLIC_SELECT,
    orderBy: ENGAGEMENT_ORDER,
  });
}

// --- Connections ---

/**
 * Explicit edges only — written by an admin, never inferred. The row is stored
 * once per pair; this returns it from `memberId`'s side with the other person
 * surfaced, so pages never deal with a/b orientation.
 */
export async function listConnectionsFor(memberId: string) {
  const person = { select: { id: true, name: true, avatarUrl: true, kind: true } } as const;
  const rows = await db.connection.findMany({
    where: { OR: [{ aId: memberId }, { bId: memberId }] },
    select: { id: true, label: true, aId: true, a: person, b: person },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    other: row.aId === memberId ? row.b : row.a,
  }));
}

// --- The network directory ---

/**
 * Who the Network scope shows: every admin-created contact, plus every approved
 * account. Pending/rejected/suspended accounts stay out — signing in has never
 * put anyone in a directory here, and rejection means what it says.
 */
const NETWORK_VISIBLE = {
  OR: [
    { kind: PersonKind.CONTACT },
    { kind: PersonKind.ACCOUNT, status: MemberStatus.APPROVED },
  ],
} satisfies Prisma.MemberWhereInput;

export type NetworkFilters = {
  q?: string;
  role?: string;
  year?: string;
  program?: string;
};

export async function listNetworkPeople(filters: NetworkFilters = {}) {
  const { q, role, year: rawYear, program } = filters;
  const year = /^\d{4}$/.test(rawYear ?? "") ? Number(rawYear) : undefined;

  // Role, year and program apply to one and the same engagement — asking for
  // "speakers in 2025" must not match someone who spoke in 2024 and mentored in
  // 2025. "Active in year" means the span covers it, ongoing spans included.
  const engagementFilter: Prisma.EngagementWhereInput = {
    ...(isEngagementRole(role) ? { role } : {}),
    ...(year !== undefined
      ? { startYear: { lte: year }, OR: [{ endYear: null }, { endYear: { gte: year } }] }
      : {}),
    ...(program ? { edition: { program: { slug: program } } } : {}),
  };
  const hasEngagementFilter = Object.keys(engagementFilter).length > 0;

  return db.member.findMany({
    where: {
      ...NETWORK_VISIBLE,
      ...(hasEngagementFilter ? { engagements: { some: engagementFilter } } : {}),
      ...(q
        ? {
            AND: [
              {
                OR: [
                  { name: { contains: q, mode: "insensitive" as const } },
                  { title: { contains: q, mode: "insensitive" as const } },
                  { bio: { contains: q, mode: "insensitive" as const } },
                  { location: { contains: q, mode: "insensitive" as const } },
                  { expertise: { some: { label: { contains: q, mode: "insensitive" as const } } } },
                  {
                    engagements: {
                      some: {
                        OR: [
                          { title: { contains: q, mode: "insensitive" as const } },
                          { organization: { name: { contains: q, mode: "insensitive" as const } } },
                        ],
                      },
                    },
                  },
                ],
              },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      kind: true,
      title: true,
      location: true,
      bio: true,
      expertise: { select: { id: true, label: true, slug: true }, orderBy: { label: "asc" } },
      engagements: { select: ENGAGEMENT_PUBLIC_SELECT, orderBy: ENGAGEMENT_ORDER },
    },
    orderBy: { name: "asc" },
  });
}

export type NetworkPerson = Awaited<ReturnType<typeof listNetworkPeople>>[number];

/** Distinct years engagements actually cover — the filter shouldn't offer empty options. */
export async function listNetworkYears() {
  const rows = await db.engagement.findMany({
    select: { startYear: true },
    distinct: ["startYear"],
    orderBy: { startYear: "desc" },
  });
  return rows.map((row) => row.startYear);
}

export async function listPrograms() {
  return db.program.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
}

export async function listOrganizations() {
  return db.organization.findMany({
    select: { id: true, name: true, website: true, _count: { select: { engagements: true } } },
    orderBy: { name: "asc" },
  });
}

// --- One person, for the profile page ---

/**
 * A profile is visible to members if the person is network-visible; the page
 * decides what to render from `kind`. Returns null for pending/rejected/
 * suspended accounts, exactly as the old member-only page did.
 */
export async function getNetworkPerson(id: string) {
  const member = await db.member.findFirst({
    where: { id, ...NETWORK_VISIBLE },
    include: { department: true, expertise: { orderBy: { label: "asc" } } },
  });
  if (!member) return null;

  const [engagements, connections] = await Promise.all([
    listEngagementsFor(id),
    listConnectionsFor(id),
  ]);
  return { member, engagements, connections };
}

// --- Admin reads (notes included — assert admin before calling) ---

export async function listNetworkForAdmin() {
  return db.member.findMany({
    where: NETWORK_VISIBLE,
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      kind: true,
      title: true,
      engagements: { select: { id: true, role: true }, orderBy: ENGAGEMENT_ORDER },
    },
    orderBy: [{ kind: "desc" }, { name: "asc" }], // contacts first — they only live here
  });
}

export async function getPersonForAdmin(id: string) {
  return db.member.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      kind: true,
      status: true,
      title: true,
      location: true,
      note: true,
      expertise: { orderBy: { label: "asc" } },
      engagements: {
        select: { ...ENGAGEMENT_PUBLIC_SELECT, note: true, createdBy: { select: { name: true } } },
        orderBy: ENGAGEMENT_ORDER,
      },
      connectionsA: {
        select: { id: true, label: true, note: true, b: { select: { id: true, name: true } } },
      },
      connectionsB: {
        select: { id: true, label: true, note: true, a: { select: { id: true, name: true } } },
      },
    },
  });
}

export async function listOrganizationsForAdmin() {
  return db.organization.findMany({
    include: { _count: { select: { engagements: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getOrganizationForAdmin(id: string) {
  return db.organization.findUnique({
    where: { id },
    include: {
      engagements: {
        select: {
          ...ENGAGEMENT_PUBLIC_SELECT,
          note: true,
          member: { select: { id: true, name: true, avatarUrl: true, kind: true } },
        },
        orderBy: ENGAGEMENT_ORDER,
      },
    },
  });
}

/** Admin-only notes for one person's profile page, fetched only when the viewer is an admin. */
export async function getNotesForAdmin(memberId: string) {
  const member = await db.member.findUnique({
    where: { id: memberId },
    select: {
      note: true,
      engagements: {
        select: { id: true, note: true },
        where: { note: { not: null } },
      },
      connectionsA: { select: { id: true, note: true }, where: { note: { not: null } } },
      connectionsB: { select: { id: true, note: true }, where: { note: { not: null } } },
    },
  });
  if (!member) return null;
  return {
    person: member.note,
    engagements: new Map(member.engagements.map((row) => [row.id, row.note])),
    connections: new Map(
      [...member.connectionsA, ...member.connectionsB].map((row) => [row.id, row.note]),
    ),
  };
}

// --- Display helpers (pure) ---

/** "2024", "2024–2026", or "2025 – present" for an ongoing engagement. */
export function yearSpan(startYear: number, endYear: number | null) {
  if (endYear === null) return `${startYear} – present`;
  if (endYear === startYear) return String(startYear);
  return `${startYear}–${endYear}`;
}

/** The line an engagement leads with: its title when it has one, else the role. */
export function engagementHeadline(engagement: PublicEngagement) {
  return engagement.title?.trim() || ROLE_LABELS[engagement.role];
}

/** "SFP Recruitment 2025" — an edition's display name. */
export function editionLabel(edition: NonNullable<PublicEngagement["edition"]>) {
  return edition.label?.trim() || `${edition.program.name} ${edition.year}`;
}

/**
 * The context after the headline: role (when the headline is a title), program
 * edition, organization, department — whichever exist, dot-separated.
 */
export function engagementContext(engagement: PublicEngagement) {
  const parts: string[] = [];
  if (engagement.title?.trim()) parts.push(ROLE_LABELS[engagement.role]);
  if (engagement.edition) parts.push(editionLabel(engagement.edition));
  if (engagement.organization) parts.push(engagement.organization.name);
  if (engagement.department) parts.push(engagement.department.name);
  return parts.join(" · ");
}

/**
 * The one-line summary a directory row shows: the most recent engagement.
 * "Speaker · Summer Fellowship Program 2025 · VNG"
 */
export function latestEngagementSummary(engagements: PublicEngagement[]) {
  const latest = engagements[0];
  if (!latest) return null;
  const context = engagementContext(latest);
  const headline = engagementHeadline(latest);
  return context ? `${headline} · ${context}` : headline;
}
