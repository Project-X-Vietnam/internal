import { LOOTBOX_MAX, type LootboxItem } from "@/lib/lootbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * The six lootbox rows on `/me`.
 *
 * Plain inputs inside the profile's existing form — no add/remove buttons, no
 * client state, no drag handles. Six slots always exist; filling one in is what
 * creates an item and clearing one is what removes it. That is a worse fit for
 * an unbounded list and a much better one for a list that is capped at six by
 * design, and it keeps the whole editor working without JavaScript.
 */

/**
 * Only the first two rows carry examples. Six filled-in placeholders read as a
 * form that is already half-answered, and nobody edits those.
 */
const EXAMPLES = [
  { icon: "🎧", label: "Lo-fi, 2am, deadline" },
  { icon: "🐈", label: "Mochi, unpaid intern" },
] as const;

// Underscores, not commas: Tailwind writes an arbitrary value out verbatim, and
// `grid-template-columns: 6.5rem,1fr` is not valid CSS.
const ROW = "grid grid-cols-[6.5rem_1fr] gap-2 sm:grid-cols-[11rem_1fr] sm:gap-3";

export function LootboxFields({ items }: { items: LootboxItem[] }) {
  return (
    <div className="mt-4 max-w-2xl space-y-2">
      {/* Column headings rather than a label per input: twelve visible labels on
          six rows of two fields is noise. Each input still carries its own
          aria-label, so nothing is lost to a screen reader. */}
      <div className={cn(ROW, "px-0.5")}>
        <span className="type-label">Emoji or image URL</span>
        <span className="type-label">Caption</span>
      </div>

      {Array.from({ length: LOOTBOX_MAX }, (_, index) => {
        const item = items[index];
        const example = EXAMPLES[index];
        return (
          <div key={index} className={ROW}>
            <Input
              name={`lootbox-${index}-icon`}
              // One field for both because they can't be confused: anything
              // starting http(s):// is an image, everything else is an emoji.
              defaultValue={item?.emoji ?? item?.image ?? ""}
              placeholder={example?.icon}
              aria-label={`Lootbox item ${index + 1} — emoji or image URL`}
            />
            <Input
              name={`lootbox-${index}-label`}
              defaultValue={item?.label ?? ""}
              placeholder={example?.label}
              aria-label={`Lootbox item ${index + 1} — caption`}
            />
          </div>
        );
      })}
    </div>
  );
}
