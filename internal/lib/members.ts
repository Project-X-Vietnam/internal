/**
 * Directory reads. Deliberately NOT a "use server" module: everything exported
 * from one of those becomes a client-callable endpoint, and these would then be
 * reachable by any signed-in account regardless of approval state. Mutations live
 * in lib/member-actions.ts, where each one asserts its own authorization.
 */
import { db } from "@/lib/db";
import { MemberStatus, PersonKind } from "@/lib/generated/prisma/enums";

// --- Reads ---

export async function listDepartments() {
  return db.department.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
}

export async function listExpertiseTags() {
  return db.expertiseTag.findMany({ orderBy: { label: "asc" } });
}

export type DirectoryFilters = {
  q?: string;
  department?: string;
  cohort?: string;
  tag?: string;
};

export async function listApprovedMembers(filters: DirectoryFilters = {}) {
  const { q, department, cohort, tag } = filters;

  return db.member.findMany({
    where: {
      // kind is belt-and-braces here — contacts are never APPROVED — but the
      // Team scope's definition is "approved accounts", so say so.
      kind: PersonKind.ACCOUNT,
      status: MemberStatus.APPROVED,
      ...(department ? { department: { slug: department } } : {}),
      ...(cohort ? { cohort } : {}),
      ...(tag ? { expertise: { some: { slug: tag } } } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { title: { contains: q, mode: "insensitive" as const } },
              { bio: { contains: q, mode: "insensitive" as const } },
              { location: { contains: q, mode: "insensitive" as const } },
              { expertise: { some: { label: { contains: q, mode: "insensitive" as const } } } },
            ],
          }
        : {}),
    },
    include: { department: true, expertise: { orderBy: { label: "asc" } } },
    orderBy: [{ name: "asc" }],
  });
}

/** Distinct cohorts actually in use — the filter list shouldn't offer empty options. */
export async function listCohorts() {
  const rows = await db.member.findMany({
    where: { status: MemberStatus.APPROVED, cohort: { not: null } },
    select: { cohort: true },
    distinct: ["cohort"],
    orderBy: { cohort: "asc" },
  });
  return rows.map((row) => row.cohort).filter((cohort): cohort is string => Boolean(cohort));
}

export async function countApprovedMembers() {
  return db.member.count({ where: { status: MemberStatus.APPROVED } });
}

export async function getMemberById(id: string) {
  return db.member.findUnique({
    where: { id },
    include: { department: true, expertise: { orderBy: { label: "asc" } } },
  });
}

export async function listMembersForAdmin() {
  // Accounts only: this page is about access. Contacts live in /admin/network.
  return db.member.findMany({
    where: { kind: PersonKind.ACCOUNT },
    include: { department: true, approvedBy: { select: { name: true } } },
    orderBy: [{ status: "asc" }, { requestedAt: "desc" }],
  });
}
