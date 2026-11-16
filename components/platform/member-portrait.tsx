import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The contents of a portrait frame. The caller owns the frame — aspect ratio,
 * radius and clipping — so the same component fills a gallery tile, a sheet
 * header and a profile page without carrying three sets of size props.
 *
 * Three tiers, in descending order of how good they look:
 *
 *   1. a committed 4:5 portrait (see lib/member-photos.ts)
 *   2. the member's Google avatar, which is ~96px square and would look broken
 *      stretched to 4:5 — so it is set into a brand wash at its natural size
 *   3. their initials, on the same wash
 *
 * Tiers 2 and 3 share a deliberate look: a member with no portrait should read
 * as a designed state, not a missing image.
 */

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** The wash behind both fallbacks — brand-tinted, so it never reads as grey. */
const WASH =
  "bg-[linear-gradient(155deg,hsl(var(--primary)/0.13),hsl(var(--secondary)/0.10)_55%,hsl(var(--primary)/0.06))]";

export function MemberPortrait({
  name,
  portrait,
  avatarUrl,
  sizes,
  priority,
  className,
}: {
  name: string;
  portrait?: string | null;
  avatarUrl?: string | null;
  /** Passed straight to next/image; only meaningful for tier 1. */
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (portrait) {
    return (
      <Image
        src={portrait}
        alt=""
        aria-hidden
        fill
        sizes={sizes ?? "(min-width: 1024px) 240px, (min-width: 640px) 30vw, 45vw"}
        priority={priority}
        // object-top, not object-center: these are half-body shots, and centring
        // them crops the face off at 4:5.
        className={cn("object-cover object-top", className)}
      />
    );
  }

  return (
    <div className={cn("flex h-full w-full items-center justify-center", WASH, className)}>
      {avatarUrl ? (
        // Plain <img> for the same reason components/platform/avatar.tsx uses one:
        // Google's CDN would have to be whitelisted with the optimizer, and it
        // serves a placeholder to any request carrying a referer.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt=""
          aria-hidden
          referrerPolicy="no-referrer"
          className="aspect-square w-[42%] max-w-24 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="text-3xl font-medium tracking-[-0.04em] text-primary/35 sm:text-4xl"
        >
          {initials(name)}
        </span>
      )}
    </div>
  );
}
