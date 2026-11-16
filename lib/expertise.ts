import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

/**
 * Free-text tags, deduped by slug. Created on demand so the vocabulary grows
 * from actual use rather than from a list an admin has to maintain.
 *
 * Not a "use server" module: it is shared by member-actions and network-actions,
 * and exporting it from either would make a tag-writing endpoint out of a
 * helper. The actions that call it do their own authorization first.
 */
export async function resolveExpertiseIds(raw: string | null) {
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
