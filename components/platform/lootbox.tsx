import Link from "next/link";

import { FOCUS } from "@/components/platform/page";
import { LOOTBOX_FALLBACK_EMOJI, type LootboxItem } from "@/lib/lootbox";
import { cn } from "@/lib/utils";

/**
 * A member's lootbox: their objects, floating in a dark box.
 *
 * The portal is flat, ruled and quiet everywhere else, and that is correct for a
 * directory of colleagues. This one panel is allowed to break the grammar —
 * dark ground, drifting objects, a hand-lettered feel — because it is the only
 * part of a profile that is about the person rather than their role, and the
 * break is what marks it as such. Keeping it *small* is what keeps it a
 * flourish instead of a theme.
 *
 * No client JavaScript: the drift is a CSS keyframe and the hover states are
 * CSS. It renders identically inside the client-side sheet and on the server-
 * rendered profile page.
 */

/**
 * Hand-placed scatter, in percentages of the panel.
 *
 * Not random, and the spacing is load-bearing. An object is at worst ~22% of the
 * panel wide and ~17% of it tall once its caption is counted — that worst case
 * is the phone, where the panel is ~358px across — so every pair of slots
 * clears the other on one axis or the other, and the extremes stay inside 20–82%
 * so a two-line caption can't run off the edge. They are also ordered: the first
 * slots read as balanced on their own, so a one-item lootbox doesn't look like a
 * mistake.
 */
const SLOTS = [
  { left: 60, top: 45, rotate: -5, scale: 1 },
  { left: 24, top: 72, rotate: 6, scale: 0.92 },
  { left: 82, top: 66, rotate: -8, scale: 0.8 },
  { left: 78, top: 16, rotate: 7, scale: 0.86 },
  { left: 52, top: 86, rotate: -4, scale: 0.74 },
  { left: 20, top: 38, rotate: 9, scale: 0.9 },
] as const;

/**
 * First token, not last. Members sign in with Google display names in both
 * orders — "Liam Minh Le" (given name first) and "Nguyen Vu Gia Hung" (family
 * name first) — so no rule gets the given name in every case. The first token
 * is what most people set as their preferred name, and it is the one that reads
 * as a name rather than a mistake when it guesses wrong.
 */
function firstName(name: string) {
  return name.trim().split(/\s+/).filter(Boolean)[0] ?? name;
}

export function Lootbox({
  name,
  items,
  isViewer,
  className,
}: {
  name: string;
  items: LootboxItem[];
  /** Shows the "fill it in" prompt when the lootbox is the viewer's own. */
  isViewer?: boolean;
  className?: string;
}) {
  const empty = items.length === 0;

  return (
    <div
      className={cn(
        // The inset hairline matters in dark mode, where `--card` behind this is
        // itself near-black and the panel would otherwise have no edge at all.
        "relative isolate overflow-hidden rounded-media bg-pxv-dark ring-1 ring-inset ring-white/10",
        // An empty lootbox gets a fraction of the height. The section still
        // exists — the profile keeps its shape, and it stays obvious that there
        // is something here to fill in — but "nothing yet" doesn't get to take
        // up as much room as six objects.
        empty ? "min-h-[11rem]" : "min-h-[24rem] sm:min-h-[20rem]",
        className,
      )}
    >
      {/* Two soft lights rather than a flat fill — a single dark rectangle reads
          as a hole in the page, and the objects need something to sit against. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_60%_at_78%_18%,hsl(var(--primary)/0.30),transparent_70%),radial-gradient(60%_55%_at_12%_92%,hsl(var(--secondary)/0.18),transparent_70%)]"
      />

      <div className="absolute left-5 top-5 z-10 max-w-[45%]">
        <p className="text-sm leading-tight text-white/50">{firstName(name)}&rsquo;s</p>
        <p className="text-[1.375rem] font-medium leading-tight tracking-[-0.03em] text-white">
          Lootbox
        </p>
      </div>

      {empty ? (
        // pt-16 keeps the message clear of the title block on a narrow panel.
        <div className="absolute inset-0 flex items-center justify-center p-6 pt-16 text-center">
          <p className="type-small max-w-xs text-white/45">
            {isViewer ? (
              <>
                Nothing in here yet.{" "}
                <Link
                  href="/me"
                  className={cn(
                    "text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white",
                    FOCUS,
                  )}
                >
                  Put six things in it
                </Link>
                .
              </>
            ) : (
              <>{firstName(name)} hasn&rsquo;t packed a lootbox yet.</>
            )}
          </p>
        </div>
      ) : (
        <ul className="absolute inset-0">
          {items.slice(0, SLOTS.length).map((item, index) => {
            const slot = SLOTS[index];
            return (
              <li
                key={`${item.label}-${index}`}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${slot.left}%`, top: `${slot.top}%` }}
              >
                {/* Three nested wrappers, one transform each: an inline
                    `transform` would otherwise clobber Tailwind's scale
                    utility, and the drift keyframe would clobber both. Outer
                    drifts, middle holds the resting pose, inner lifts on hover. */}
                <div
                  className="animate-float motion-reduce:animate-none"
                  style={{ animationDelay: `${index * -1.4}s`, animationDuration: "9s" }}
                >
                  <div style={{ transform: `rotate(${slot.rotate}deg) scale(${slot.scale})` }}>
                    <div className="group flex w-20 flex-col items-center gap-1.5 transition-transform duration-300 ease-out pointer-hover:scale-110 sm:w-28">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt=""
                          aria-hidden
                          loading="lazy"
                          className="h-12 w-12 object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.5)] sm:h-20 sm:w-20"
                        />
                      ) : (
                        <span
                          aria-hidden
                          className="text-[2rem] leading-none drop-shadow-[0_12px_20px_rgba(0,0,0,0.5)] sm:text-[3.25rem]"
                        >
                          {item.emoji || LOOTBOX_FALLBACK_EMOJI}
                        </span>
                      )}

                      {/* The caption is always in the DOM and always visible,
                          just dim — a hover-only label is invisible to touch and
                          to anyone reading with a keyboard. It brightens on
                          hover, so pointing at an object still does something. */}
                      {item.label && (
                        <span className="type-meta line-clamp-2 text-center text-[0.625rem] leading-tight text-white/65 transition-colors duration-300 group-pointer-hover:text-white sm:text-[0.6875rem]">
                          {item.label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
