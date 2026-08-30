"use client";

import { useCallback, useRef, useState } from "react";

import { MemberPortrait } from "@/components/platform/member-portrait";
import { MemberSheet, type SheetMember } from "@/components/platform/member-sheet";
import { FOCUS } from "@/components/platform/page";
import { cn } from "@/lib/utils";

export type GalleryMember = SheetMember;

/**
 * The directory as faces rather than rows.
 *
 * Every tile is a real `<a href="/directory/[id]">`. The sheet is layered on top
 * by intercepting plain left-clicks, so the gallery keeps working with
 * JavaScript off, ⌘-click still opens a profile in a new tab, and the browser
 * still shows the destination on hover. The quick look is an enhancement; the
 * link is the feature.
 */
export function DirectoryGallery({
  members,
  viewerId,
}: {
  members: GalleryMember[];
  viewerId: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // The tile that opened the sheet, so focus can go back where it came from.
  const openerRef = useRef<HTMLAnchorElement | null>(null);

  const close = useCallback(() => {
    setOpenIndex(null);
    openerRef.current?.focus();
  }, []);

  // Wraps at both ends: at 19 members, walking off the last one is far more
  // likely to mean "keep going" than "stop".
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null || members.length === 0
          ? current
          : (current + delta + members.length) % members.length,
      ),
    [members.length],
  );

  return (
    <>
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
        {members.map((member, index) => (
          // A CSS animation rather than a motion component on purpose. An
          // entrance driven by JavaScript means the tiles start at opacity 0 and
          // stay there if the bundle fails, if the tab is in the background when
          // it loads, or if anything throws first — and these tiles are the page.
          // CSS gets the same stagger from an inline delay and cannot fail open.
          <li
            key={member.id}
            className="animate-tile-in motion-reduce:animate-none"
            // Capped: past the first dozen a stagger stops reading as sequence
            // and starts reading as lag.
            style={{ animationDelay: `${Math.min(index, 11) * 40}ms` }}
          >
            <a
              href={`/directory/${member.id}`}
              onClick={(event) => {
                // Leave every modified click to the browser: new tab, new
                // window, download, and middle-click all still mean what they
                // normally mean.
                if (
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey ||
                  event.button !== 0
                ) {
                  return;
                }
                event.preventDefault();
                openerRef.current = event.currentTarget;
                setOpenIndex(index);
              }}
              aria-haspopup="dialog"
              className={cn("group block rounded-media", FOCUS)}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-media bg-muted">
                <MemberPortrait
                  name={member.name}
                  portrait={member.portrait}
                  avatarUrl={member.avatarUrl}
                  priority={index < 4}
                  className="transition-transform duration-500 ease-out group-pointer-hover:scale-[1.04]"
                />

                {/* A wash from the bottom on hover. With no badge on the tile
                    this is the affordance on the image itself — the frame reacts
                    to the pointer, which is what says it can be opened. */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-pxv-dark/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-pointer-hover:opacity-100"
                />
              </div>

              <div className="mt-3">
                <p className="type-small truncate font-medium transition-colors group-pointer-hover:text-primary">
                  {member.name}
                </p>
                <p className="type-small truncate text-muted-foreground">
                  {member.title ?? "No title yet"}
                </p>
                {member.department && (
                  <p className="type-label mt-1 truncate text-primary">{member.department}</p>
                )}
              </div>
            </a>
          </li>
        ))}
      </ul>

      <MemberSheet
        member={openIndex === null ? null : (members[openIndex] ?? null)}
        isViewer={openIndex !== null && members[openIndex]?.id === viewerId}
        position={
          openIndex === null ? null : { index: openIndex + 1, total: members.length }
        }
        onClose={close}
        onStep={step}
      />
    </>
  );
}
