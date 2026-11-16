"use client";

import { useCallback, useRef, useState } from "react";

import { Avatar } from "@/components/platform/avatar";
import { NetworkSheet, type NetworkSheetPerson } from "@/components/platform/network-sheet";
import { FOCUS, RuleList } from "@/components/platform/page";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * The network directory rows, with the quick-look sheet layered on top.
 *
 * Every row is a real `<a href="/directory/[id]">`, exactly like the gallery
 * tiles: the sheet intercepts plain left-clicks only, so the list keeps working
 * with JavaScript off, ⌘-click still opens a profile in a new tab, and the
 * browser still shows the destination on hover.
 */
export function NetworkList({
  people,
  viewerId,
  isAdmin,
}: {
  people: NetworkSheetPerson[];
  viewerId: string;
  isAdmin: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // The row that opened the sheet, so focus can go back where it came from.
  const openerRef = useRef<HTMLAnchorElement | null>(null);

  const close = useCallback(() => {
    setOpenIndex(null);
    openerRef.current?.focus();
  }, []);

  // Wraps at both ends, same as the gallery: walking off the last person is far
  // more likely to mean "keep going" than "stop".
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null || people.length === 0
          ? current
          : (current + delta + people.length) % people.length,
      ),
    [people.length],
  );

  return (
    <>
      <RuleList className="mt-1">
        {people.map((person, index) => (
          <li key={person.id}>
            <a
              href={`/directory/${person.id}`}
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
              className={cn(
                "group -mx-3 flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-4 transition-colors hover:bg-accent sm:-mx-4 sm:px-4",
                FOCUS,
              )}
            >
              <Avatar name={person.name} src={person.avatarUrl} />
              <div className="order-2 min-w-0 flex-1">
                <p className="type-small truncate font-medium transition-colors group-hover:text-primary">
                  {person.name}
                </p>
                <p className="type-small truncate text-muted-foreground">{person.summary}</p>
              </div>
              {person.roles.length > 0 && (
                <ul className="order-4 flex w-full flex-wrap gap-1 sm:order-3 sm:w-auto sm:shrink-0">
                  {person.roles.map((role) => (
                    <li key={role}>
                      <Badge variant="outline">{role}</Badge>
                    </li>
                  ))}
                </ul>
              )}
              <span
                aria-hidden
                className="type-meta order-3 shrink-0 transition-colors group-hover:text-primary sm:order-4"
              >
                &rarr;
              </span>
            </a>
          </li>
        ))}
      </RuleList>

      <NetworkSheet
        person={openIndex === null ? null : (people[openIndex] ?? null)}
        isViewer={openIndex !== null && people[openIndex]?.id === viewerId}
        isAdmin={isAdmin}
        position={openIndex === null ? null : { index: openIndex + 1, total: people.length }}
        onClose={close}
        onStep={step}
      />
    </>
  );
}
