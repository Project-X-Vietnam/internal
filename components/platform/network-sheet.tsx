"use client";

import { ArrowUpRight, Mail } from "lucide-react";
import Link from "next/link";

import { MemberPortrait } from "@/components/platform/member-portrait";
import { ContactLink, Fact, SheetShell } from "@/components/platform/sheet-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * What the network quick-look renders. Everything display-shaped is formatted
 * on the server — role labels, year spans, engagement lines — because the
 * helpers live in lib/network.ts, which imports the db and must never be pulled
 * into a client bundle.
 */
export type NetworkSheetPerson = {
  id: string;
  name: string;
  /** Nullable: contacts are admin-created and don't always come with one. */
  email: string | null;
  title: string | null;
  location: string | null;
  bio: string | null;
  portrait: string | null;
  avatarUrl: string | null;
  /** The row's one-liner — also the sheet's subtitle when there's no title. */
  summary: string;
  /** Deduped, display-ready role labels across all engagements. */
  roles: string[];
  expertise: { id: string; label: string }[];
  engagements: { id: string; years: string; headline: string; context: string }[];
};

/**
 * The quick-look behind a network row — the Network scope's counterpart to the
 * Team scope's MemberSheet, on the same SheetShell. A network person's story is
 * their engagement history, so that is the body of this sheet; connections and
 * admin notes stay on the full profile page, which the footer always offers.
 */
export function NetworkSheet({
  person,
  isViewer,
  isAdmin,
  position,
  onClose,
  onStep,
}: {
  person: NetworkSheetPerson | null;
  isViewer: boolean;
  isAdmin: boolean;
  /** 1-based place in the filtered list, for the "3 / 87" counter. */
  position: { index: number; total: number } | null;
  onClose: () => void;
  onStep: (delta: number) => void;
}) {
  return (
    <SheetShell
      open={Boolean(person)}
      contentKey={person?.id ?? null}
      labelledBy="network-sheet-name"
      position={position}
      onClose={onClose}
      onStep={onStep}
      columnClassName="sm:w-[36rem] lg:w-[40rem]"
    >
      {person && (
        <>
          <div className="flex flex-col gap-5 pt-6 sm:flex-row sm:gap-6">
            <div className="relative aspect-[4/5] w-36 shrink-0 overflow-hidden rounded-media bg-muted sm:w-44">
              <MemberPortrait
                name={person.name}
                portrait={person.portrait}
                avatarUrl={person.avatarUrl}
                sizes="176px"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h2 id="network-sheet-name" className="type-title break-words">
                {person.name}
              </h2>
              <p className="type-body mt-1 text-muted-foreground">
                {person.title ?? person.summary}
              </p>

              {person.roles.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {person.roles.map((role) => (
                    <li key={role}>
                      <Badge variant="outline">{role}</Badge>
                    </li>
                  ))}
                </ul>
              )}

              {person.email && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <ContactLink href={`mailto:${person.email}`} icon={Mail}>
                    Email
                  </ContactLink>
                </div>
              )}

              {person.expertise.length > 0 && (
                <div className="mt-5">
                  <p className="type-label">Ask me about</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {person.expertise.map((tag) => (
                      <li key={tag.id}>
                        <Badge>{tag.label}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {(person.bio || person.location) && (
            <section className="rule mt-10 pt-4">
              <h3 className="type-label">About</h3>
              {person.bio && (
                <p className="type-body mt-3 whitespace-pre-line">{person.bio}</p>
              )}
              {person.location && (
                <dl className="mt-4 grid gap-x-8 sm:grid-cols-2">
                  <Fact label="Location">{person.location}</Fact>
                </dl>
              )}
            </section>
          )}

          {person.engagements.length > 0 && (
            <section className="rule mt-10 pt-4">
              <h3 className="type-label">History</h3>
              <ol className="mt-1">
                {person.engagements.map((engagement) => (
                  <li
                    key={engagement.id}
                    className="rule-subtle flex flex-col gap-x-6 py-3 sm:flex-row"
                  >
                    <span className="type-meta w-32 shrink-0 pt-0.5 tabular-nums">
                      {engagement.years}
                    </span>
                    <div className="min-w-0">
                      <p className="type-small font-medium">{engagement.headline}</p>
                      {engagement.context && (
                        <p className="type-small mt-0.5 text-muted-foreground">
                          {engagement.context}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/directory/${person.id}`}>
                Open full profile
                <ArrowUpRight aria-hidden strokeWidth={1.75} className="h-3.5 w-3.5" />
              </Link>
            </Button>
            {isViewer && (
              <Button asChild variant="ghost" size="sm">
                <Link href="/me">Edit profile</Link>
              </Button>
            )}
            {isAdmin && !isViewer && (
              <Button asChild variant="ghost" size="sm">
                <Link href={`/admin/network/${person.id}`}>Manage in network</Link>
              </Button>
            )}
          </div>
        </>
      )}
    </SheetShell>
  );
}
