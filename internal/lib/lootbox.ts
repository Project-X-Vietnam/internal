/**
 * The lootbox — the handful of objects a member keeps on their profile.
 *
 * Not structured data and not meant to become any: it is the one part of the
 * directory that says something about a person rather than their role. Six
 * slots, an emoji or a cutout image each, one short caption. That cap is the
 * feature — a lootbox that scrolls is an inventory, and an inventory is dull.
 *
 * Stored as JSON on `Member.lootbox` rather than as its own table for the same
 * reason: nothing ever queries across lootboxes.
 */

export type LootboxItem = {
  label: string;
  /** One or two emoji. Mutually exclusive with `image` — emoji wins. */
  emoji?: string;
  /** Absolute http(s) URL of a cutout image, ideally a transparent PNG. */
  image?: string;
};

/**
 * Master switch. Flip to `true` to bring the lootbox back everywhere — the
 * gallery sheet, the profile page, the /me editor, the onboarding step and the
 * home-page nudge all read this one constant.
 *
 * Hidden rather than deleted, and nothing is dropped from the database: existing
 * lootboxes sit untouched in `Member.lootbox` and reappear intact when this is
 * turned back on. Writes are suppressed while it is off (see lib/member-actions),
 * so a profile save can't quietly wipe them.
 */
export const LOOTBOX_ENABLED = false;

export const LOOTBOX_MAX = 6;
const LABEL_MAX = 48;

/** Emoji fall back to this when a row has a caption but no icon of its own. */
export const LOOTBOX_FALLBACK_EMOJI = "✦";

function isImageUrl(value: string) {
  // http(s) only: `javascript:` and `data:` have no business in an <img src>
  // that any member can set on a page every other member loads.
  return /^https?:\/\/\S+$/i.test(value);
}

/**
 * Coerce whatever is in the JSON column into renderable items.
 *
 * Defensive on purpose — the column is `Json?`, so a hand-edited row or an older
 * shape must degrade to "no lootbox" rather than throw inside a page render.
 */
export function parseLootbox(value: unknown): LootboxItem[] {
  if (!Array.isArray(value)) return [];

  const items: LootboxItem[] = [];

  for (const raw of value) {
    if (!raw || typeof raw !== "object") continue;
    const row = raw as Record<string, unknown>;

    const label = typeof row.label === "string" ? row.label.trim().slice(0, LABEL_MAX) : "";
    const emoji = typeof row.emoji === "string" ? row.emoji.trim() : "";
    const image = typeof row.image === "string" ? row.image.trim() : "";

    // A row with neither a caption nor an icon is an empty form field, not an item.
    if (!label && !emoji && !image) continue;

    items.push({
      label,
      ...(emoji ? { emoji } : {}),
      ...(!emoji && isImageUrl(image) ? { image } : {}),
    });

    if (items.length >= LOOTBOX_MAX) break;
  }

  return items;
}

/**
 * Read the lootbox rows out of the `/me` form.
 *
 * The form posts one `lootbox-<n>-icon` / `lootbox-<n>-label` pair per slot. The
 * icon field is a single input that takes either an emoji or an image URL —
 * asking someone to pick a type before typing is a worse trade than sniffing it
 * here, and the two are trivially distinguishable.
 */
export function lootboxFromForm(formData: FormData): LootboxItem[] {
  const items: LootboxItem[] = [];

  for (let index = 0; index < LOOTBOX_MAX; index += 1) {
    const icon = ((formData.get(`lootbox-${index}-icon`) as string | null) ?? "").trim();
    const label = ((formData.get(`lootbox-${index}-label`) as string | null) ?? "")
      .trim()
      .slice(0, LABEL_MAX);

    if (!icon && !label) continue;

    const image = isImageUrl(icon);
    items.push({
      label,
      ...(image ? { image: icon } : {}),
      // A caption with no icon still deserves to show up, so it gets the
      // fallback glyph rather than being silently dropped.
      ...(!image ? { emoji: icon.slice(0, 8) || LOOTBOX_FALLBACK_EMOJI } : {}),
    });
  }

  return items;
}
