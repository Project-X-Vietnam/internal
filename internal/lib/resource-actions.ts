"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { assertAdmin } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { ResourceKind, ResourceStatus } from "@/lib/generated/prisma/enums";
import { slugify } from "@/lib/utils";

/**
 * Hub mutations. Every export here is a public endpoint the browser can invoke,
 * so each asserts admin on the server rather than trusting the page it was
 * rendered on.
 */

function revalidateResourceSurfaces(slug?: string | null) {
  revalidatePath("/");
  revalidatePath("/resources");
  revalidatePath("/admin/resources");
  if (slug) revalidatePath(`/resources/${slug}`);
}

function optional(formData: FormData, key: string) {
  const value = (formData.get(key) as string | null)?.trim();
  return value ? value : null;
}

/**
 * Slugs are public URLs and must be unique, but a clash is an ordinary thing to
 * hit — two playbooks called "Onboarding" — and it shouldn't throw an error
 * screen at someone mid-edit. Suffix instead.
 */
async function uniqueSlug(desired: string, exceptId?: string) {
  const base = slugify(desired) || "untitled";
  for (let n = 1; n <= 100; n++) {
    const candidate = n === 1 ? base : `${base}-${n}`;
    const clash = await db.resource.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!clash || clash.id === exceptId) return candidate;
  }
  throw new Error(`Too many resources are already called "${base}".`);
}

type Parsed = {
  slug: string;
  data: {
    title: string;
    summary: string | null;
    kind: ResourceKind;
    status: ResourceStatus;
    body: string | null;
    url: string | null;
    byline: string | null;
    collectionId: string | null;
    sortOrder: number;
  };
};

async function parse(formData: FormData, exceptId?: string): Promise<Parsed> {
  const title = optional(formData, "title");
  if (!title) throw new Error("A resource needs a title.");

  const kind =
    formData.get("kind") === ResourceKind.LINK ? ResourceKind.LINK : ResourceKind.DOC;
  const status =
    formData.get("status") === ResourceStatus.PUBLISHED
      ? ResourceStatus.PUBLISHED
      : ResourceStatus.DRAFT;

  const body = optional(formData, "body");
  const url = optional(formData, "url");

  // A published row with nothing behind it is a dead row in the index. Drafts
  // are allowed to be incomplete — that's what a draft is for.
  if (status === ResourceStatus.PUBLISHED) {
    if (kind === ResourceKind.DOC && !body) {
      throw new Error("A published document needs a body. Save it as a draft instead.");
    }
    if (kind === ResourceKind.LINK && !url) {
      throw new Error("A published link needs a destination. Save it as a draft instead.");
    }
  }

  if (url && !/^https?:\/\//i.test(url)) {
    throw new Error("Links must start with http:// or https://");
  }

  const sortOrder = Number.parseInt((formData.get("sortOrder") as string | null) ?? "", 10);

  return {
    slug: await uniqueSlug(optional(formData, "slug") ?? title, exceptId),
    data: {
      title,
      summary: optional(formData, "summary"),
      kind,
      status,
      // Keep whichever half of the row this kind doesn't use, so switching a
      // draft from DOC to LINK and back doesn't silently destroy the writing.
      body,
      url,
      byline: optional(formData, "byline"),
      collectionId: optional(formData, "collectionId"),
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    },
  };
}

export async function createResource(formData: FormData) {
  const admin = await assertAdmin();
  const { slug, data } = await parse(formData);

  await db.resource.create({
    data: {
      ...data,
      slug,
      updatedById: admin.id,
      publishedAt: data.status === ResourceStatus.PUBLISHED ? new Date() : null,
    },
  });

  revalidateResourceSurfaces(slug);
  redirect("/admin/resources");
}

export async function updateResource(id: string, formData: FormData) {
  const admin = await assertAdmin();

  const existing = await db.resource.findUnique({
    where: { id },
    select: { slug: true, publishedAt: true },
  });
  if (!existing) throw new Error("That resource no longer exists.");

  const { slug, data } = await parse(formData, id);

  await db.resource.update({
    where: { id },
    data: {
      ...data,
      slug,
      updatedById: admin.id,
      // First publish stamps the date; re-publishing later keeps the original,
      // so "published 12 Aug" doesn't jump every time a typo is fixed.
      publishedAt:
        data.status === ResourceStatus.PUBLISHED ? (existing.publishedAt ?? new Date()) : null,
    },
  });

  revalidateResourceSurfaces(slug);
  // The old URL is a real page until this runs; it needs clearing too.
  if (existing.slug !== slug) revalidatePath(`/resources/${existing.slug}`);
  redirect("/admin/resources");
}

export async function setResourceStatus(id: string, status: ResourceStatus) {
  const admin = await assertAdmin();

  const existing = await db.resource.findUnique({
    where: { id },
    select: { slug: true, kind: true, body: true, url: true, publishedAt: true },
  });
  if (!existing) throw new Error("That resource no longer exists.");

  if (status === ResourceStatus.PUBLISHED) {
    const hasContent =
      existing.kind === ResourceKind.DOC ? Boolean(existing.body) : Boolean(existing.url);
    if (!hasContent) throw new Error("There's nothing to publish yet — open it and add content.");
  }

  await db.resource.update({
    where: { id },
    data: {
      status,
      updatedById: admin.id,
      publishedAt:
        status === ResourceStatus.PUBLISHED ? (existing.publishedAt ?? new Date()) : null,
    },
  });

  revalidateResourceSurfaces(existing.slug);
}

export async function deleteResource(id: string) {
  await assertAdmin();
  const removed = await db.resource.delete({ where: { id }, select: { slug: true } });
  revalidateResourceSurfaces(removed.slug);
  redirect("/admin/resources");
}

// --- Collections ---

export async function createCollection(formData: FormData) {
  await assertAdmin();

  const name = optional(formData, "name");
  if (!name) throw new Error("A collection needs a name.");

  const slug = slugify(name);
  if (!slug) throw new Error("That name doesn't produce a usable slug.");

  const existing = await db.resourceCollection.findFirst({
    where: { OR: [{ name }, { slug }] },
    select: { id: true },
  });
  if (existing) throw new Error(`There's already a collection called "${name}".`);

  const last = await db.resourceCollection.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  await db.resourceCollection.create({
    data: { name, slug, sortOrder: (last?.sortOrder ?? 0) + 10 },
  });

  revalidateResourceSurfaces();
}

export async function deleteCollection(id: string) {
  await assertAdmin();

  // Deleting one would only orphan its contents (the FK is SET NULL), which
  // looks like data loss from the index. Empty it first.
  const held = await db.resource.count({ where: { collectionId: id } });
  if (held > 0) {
    throw new Error(
      `That collection still holds ${held} ${held === 1 ? "resource" : "resources"}. Move them out first.`,
    );
  }

  await db.resourceCollection.delete({ where: { id } });
  revalidateResourceSurfaces();
}
