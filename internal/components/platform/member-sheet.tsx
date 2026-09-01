"use client";

import { ArrowUpRight, Globe, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

import { Lootbox } from "@/components/platform/lootbox";
import { MemberPortrait } from "@/components/platform/member-portrait";
import { FOCUS } from "@/components/platform/page";
import { ContactLink, Fact, SheetShell } from "@/components/platform/sheet-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LOOTBOX_ENABLED, type LootboxItem } from "@/lib/lootbox";
import { cn } from "@/lib/utils";

export type SheetMember = {
  id: string;
  name: string;
  email: string;
  title: string | null;
  department: string | null;
  cohort: string | null;
  location: string | null;
  timezone: string | null;
  bio: string | null;
  portrait: string | null;
  avatarUrl: string | null;
  expertise: { id: string; label: string; slug: string }[];
  links: {
    linkedin?: string | null;
    lark?: string | null;
    portfolio?: string | null;
  };
  lootbox: LootboxItem[];
};

/**
 * The quick-look panel behind a gallery tile: two panels that open as one — the
 * profile sheet on the right, the lootbox case standing beside it on the left.
 * The overlay itself (scrim, trap, keyboard, stepping chrome) lives in
 * SheetShell, shared with the network scope's NetworkSheet.
 *
 * The lootbox has no trigger and no toggle. It isn't a detail you drill into,
 * it is the other half of the composition, so it arrives with the sheet and
 * leaves with it. Below `lg` there is no room to stand two panels side by side,
 * and only there does it fold back into a section inside the sheet.
 *
 * It is currently switched off — see LOOTBOX_ENABLED in lib/lootbox.ts — so the
 * sheet renders as a single column. The layout is written so that turning it
 * back on needs no other change here.
 */
export function MemberSheet({
  member,
  isViewer,
  position,
  onClose,
  onStep,
}: {
  member: SheetMember | null;
  isViewer: boolean;
  /** 1-based place in the filtered gallery, for the "3 / 19" counter. */
  position: { index: number; total: number } | null;
  onClose: () => void;
  onStep: (delta: number) => void;
}) {
  const linkEntries = member
    ? ([
        member.links.linkedin && {
          key: "linkedin",
          href: member.links.linkedin.startsWith("http")
            ? member.links.linkedin
            : `https://${member.links.linkedin}`,
          icon: Linkedin,
          label: "LinkedIn",
        },
        member.links.portfolio && {
          key: "portfolio",
          href: member.links.portfolio.startsWith("http")
            ? member.links.portfolio
            : `https://${member.links.portfolio}`,
          icon: Globe,
          label: "Portfolio",
        },
      ].filter(Boolean) as {
        key: string;
        href: string;
        icon: typeof Mail;
        label: string;
      }[])
    : [];

  const subtitle = member ? [member.title, member.department].filter(Boolean).join(" · ") : "";
  const hasDetails = Boolean(
    member && (member.cohort || member.location || member.timezone || member.links.lark),
  );

  return (
    <SheetShell
      open={Boolean(member)}
      contentKey={member?.id ?? null}
      labelledBy="member-sheet-name"
      position={position}
      onClose={onClose}
      onStep={onStep}
      columnClassName="sm:w-[36rem] lg:w-[40rem] xl:w-[44rem]"
      aside={
        // Only from lg — below that the two columns don't fit, and the lootbox
        // folds into the profile column as a section instead.
        //
        // Switched off, the column isn't rendered at all rather than hidden —
        // the panel sets no width of its own, so it shrink-wraps back to the
        // profile column with nothing to unwind.
        member && LOOTBOX_ENABLED ? (
          <aside
            aria-label={`${member.name}'s lootbox`}
            className="relative hidden shrink-0 bg-pxv-dark lg:block lg:w-80 xl:w-[22rem]"
          >
            <Lootbox
              name={member.name}
              items={member.lootbox}
              isViewer={isViewer}
              className="h-full rounded-none ring-0"
            />
          </aside>
        ) : undefined
      }
    >
      {member && (
        <>
          <div className="flex flex-col gap-5 pt-6 sm:flex-row sm:gap-6">
            <div className="relative aspect-[4/5] w-36 shrink-0 overflow-hidden rounded-media bg-muted sm:w-44">
              <MemberPortrait
                name={member.name}
                portrait={member.portrait}
                avatarUrl={member.avatarUrl}
                sizes="176px"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h2 id="member-sheet-name" className="type-title break-words">
                {member.name}
              </h2>
              {subtitle && <p className="type-body mt-1 text-muted-foreground">{subtitle}</p>}

              <div className="mt-4 flex flex-wrap gap-1.5">
                <ContactLink href={`mailto:${member.email}`} icon={Mail}>
                  Email
                </ContactLink>
                {linkEntries.map((entry) => (
                  <ContactLink key={entry.key} href={entry.href} icon={entry.icon} external>
                    {entry.label}
                  </ContactLink>
                ))}
              </div>

              {member.expertise.length > 0 && (
                <div className="mt-5">
                  <p className="type-label">Ask me about</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {member.expertise.map((tag) => (
                      <li key={tag.id}>
                        <Link
                          href={`/directory?tag=${encodeURIComponent(tag.slug)}`}
                          onClick={onClose}
                          className={cn("inline-flex", FOCUS)}
                        >
                          <Badge>{tag.label}</Badge>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <section className="rule mt-10 pt-4">
            <h3 className="type-label">Personal info</h3>

            {member.bio ? (
              <p className="type-body mt-3 whitespace-pre-line">{member.bio}</p>
            ) : (
              <p className="type-small mt-3 text-muted-foreground">
                {isViewer ? (
                  <>
                    You haven&rsquo;t written a bio yet —{" "}
                    <Link
                      href="/me"
                      className={cn("text-primary underline-offset-4 hover:underline", FOCUS)}
                    >
                      add one
                    </Link>
                    .
                  </>
                ) : (
                  "No bio yet."
                )}
              </p>
            )}

            {hasDetails && (
              <dl className="mt-4 grid gap-x-8 sm:grid-cols-2">
                {member.cohort && <Fact label="Cohort">{member.cohort}</Fact>}
                {member.location && <Fact label="Location">{member.location}</Fact>}
                {member.timezone && <Fact label="Timezone">{member.timezone}</Fact>}
                {member.links.lark && (
                  // Lark is a handle, not a URL — linkifying it would
                  // produce a dead link.
                  <Fact label="Lark">{member.links.lark}</Fact>
                )}
              </dl>
            )}
          </section>

          {/* Only below lg, where the case can't stand beside the sheet. */}
          {LOOTBOX_ENABLED && (
            <section className="rule mt-10 pt-4 lg:hidden">
              <h3 className="type-label">Lootbox</h3>
              <Lootbox
                name={member.name}
                items={member.lootbox}
                isViewer={isViewer}
                className="mt-3"
              />
            </section>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/directory/${member.id}`}>
                Open full profile
                <ArrowUpRight aria-hidden strokeWidth={1.75} className="h-3.5 w-3.5" />
              </Link>
            </Button>
            {isViewer && (
              <Button asChild variant="ghost" size="sm">
                <Link href="/me">Edit profile</Link>
              </Button>
            )}
          </div>
        </>
      )}
    </SheetShell>
  );
}
