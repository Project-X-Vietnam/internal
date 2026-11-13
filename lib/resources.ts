/**
 * Knowledge-hub reads. Like lib/members.ts this is deliberately NOT a
 * "use server" module — every export from one of those becomes a client-callable
 * endpoint, and drafts would then be reachable by any signed-in account. Writes
 * live in lib/resource-actions.ts, where each one asserts admin itself.
 */
import { db } from "@/lib/db";
import { ResourceStatus } from "@/lib/generated/prisma/enums";

const CARD_FIELDS = {
  id: true,
  slug: true,
  title: true,
  summary: true,
  kind: true,
  url: true,
  byline: true,
  publishedAt: true,
  updatedAt: true,
} as const;

const PUBLISHED = { status: ResourceStatus.PUBLISHED } as const;
const BY_ORDER = [{ sortOrder: "asc" as const }, { title: "asc" as const }];

export type ResourceCard = Awaited<ReturnType<typeof listPublishedResources>>[number];

export async function listCollections() {
  return db.resourceCollection.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

/** Everything published, flat — the index groups it by collection itself. */
export async function listPublishedResources() {
  return db.resource.findMany({
    where: PUBLISHED,
    select: { ...CARD_FIELDS, collectionId: true },
    orderBy: BY_ORDER,
  });
}

export async function countPublishedResources() {
  return db.resource.count({ where: PUBLISHED });
}

/** A document as members see it. Drafts are 404, not 403 — they aren't theirs to know about. */
export async function getPublishedResource(slug: string) {
  return db.resource.findFirst({
    where: { slug, ...PUBLISHED },
    include: { collection: { select: { name: true, slug: true } } },
  });
}

export async function listResourcesForAdmin() {
  return db.resource.findMany({
    include: {
      collection: { select: { name: true } },
      updatedBy: { select: { name: true } },
    },
    orderBy: [{ status: "asc" }, ...BY_ORDER],
  });
}

export async function getResourceById(id: string) {
  return db.resource.findUnique({ where: { id } });
}
