"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Globe, Linkedin, Mail, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";

import { Lootbox } from "@/components/platform/lootbox";
import { MemberPortrait } from "@/components/platform/member-portrait";
import { FOCUS } from "@/components/platform/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LootboxItem } from "@/lib/lootbox";
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
 *
 * It is a *second* way to read a profile, never the only one: `/directory/[id]`
 * still renders everything server-side, the tiles still link there, and this
 * intercepts the click only when JavaScript is around to do it. That is why the
 * footer always offers the full page — a sheet can't be linked to or sent to
 * someone, and this one holds enough that people will want to.
 *
 * The lootbox has no trigger and no toggle. It isn't a detail you drill into,
 * it is the other half of the composition, so it arrives with the sheet and
 * leaves with it. Below `lg` there is no room to stand two panels side by side,
 * and only there does it fold back into a section inside the sheet.
 */

const SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea';

/** One label/value pair in the details grid. Mirrors `Fact` on the profile page. */
function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rule-subtle py-3">
      <dt className="type-label">{label}</dt>
      <dd className="type-small mt-1">{children}</dd>
    </div>
  );
}

function ContactLink({
  href,
  icon: Icon,
  children,
  external,
}: {
  href: string;
  icon: typeof Mail;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-lg border border-border-strong bg-card px-2.5 text-sm text-muted-foreground transition-colors hover:border-foreground/25 hover:bg-accent hover:text-foreground",
        FOCUS,
      )}
    >
      <Icon aria-hidden strokeWidth={1.75} className="h-3.5 w-3.5" />
      {children}
    </a>
  );
}

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
  // The dialog is the whole overlay, not just the sheet: the lootbox case is a
  // sibling of the sheet, and `aria-modal` on the sheet alone would hide the
  // case from assistive technology entirely. The focus trap reads the same node.
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const open = Boolean(member);
  const memberId = member?.id;

  // Stepping to another member should start that profile at the top; without
  // this the second person you look at opens scrolled to wherever you left the
  // first one.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [memberId]);

  useEffect(() => {
    if (!open) return;

    // Lock the page behind the sheet. Restoring the previous value rather than
    // clearing it keeps this safe if anything else ever locks scrolling too.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      // Arrow keys walk the gallery — but not while someone is typing, and not
      // when they are a modified shortcut belonging to the browser.
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        if (event.metaKey || event.ctrlKey || event.altKey) return;
        const target = event.target as HTMLElement | null;
        if (target?.closest("input, textarea, select")) return;
        event.preventDefault();
        onStep(event.key === "ArrowRight" ? 1 : -1);
        return;
      }

      if (event.key !== "Tab") return;

      // Focus trap. Querying on each Tab rather than caching: the contents
      // change as you step between members, and the case's own link comes and
      // goes with the breakpoint.
      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(SELECTOR) ?? [],
      ).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !dialogRef.current?.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, onStep]);

  // Move focus into the dialog once it exists, so the trap has something to hold
  // and screen readers announce it rather than staying on the grid.
  const captureFocus = useCallback((node: HTMLDivElement | null) => {
    dialogRef.current = node;
    node?.focus();
  }, []);

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
    <AnimatePresence>
      {member && (
        <div
          ref={captureFocus}
          role="dialog"
          aria-modal="true"
          aria-labelledby="member-sheet-name"
          tabIndex={-1}
          className="fixed inset-0 z-[60] outline-none"
        >
          <motion.div
            aria-hidden
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            // A fixed navy rather than `foreground`: in dark mode the foreground
            // token is near-white, so a scrim built from it *lightens* the page
            // behind the sheet instead of pushing it back.
            className="absolute inset-0 bg-pxv-dark/35 backdrop-blur-[3px]"
          />

          {/* ONE panel, not two. The lootbox is the sheet's left third — same
              outline, same shadowless edge, no gap — so it reads as the sheet
              having opened wider to make room for it rather than as a second
              window that happens to be nearby.

              The panel has no width of its own: it is absolutely positioned
              against the right edge only, so it shrink-wraps whatever the two
              columns add up to at the current breakpoint. */}
          <motion.div
            initial={{ opacity: 0, x: reduce ? 0 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduce ? 0 : 32 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              // Inset and rounded on desktop for the same reason PortalLayout
              // insets the page sheet: it should read as an object laid over the
              // app, not a pane cropped by the viewport. Full-bleed on phones,
              // where 8px of ground on each side is just wasted width.
              "absolute inset-y-0 right-0 flex w-full overflow-hidden border-border-strong bg-card",
              "sm:inset-y-2 sm:right-2 sm:w-auto sm:rounded-media sm:border",
            )}
          >
            {/* First in the DOM because it is the leftmost column: tab order and
                reading order should follow the eye. Only from lg — below that
                the two columns don't fit, and the lootbox folds into the
                profile column as a section instead. */}
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

            {/* The profile column. Its width is the sheet width — the panel is
                that plus the case, which is why neither is set on the parent. */}
            <div className="flex w-full flex-col sm:w-[36rem] lg:w-[40rem] xl:w-[44rem]">
              {/* Sticky chrome: stepping through 19 people shouldn't mean
                scrolling back up to find the next arrow. */}
              <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-2.5 sm:px-6">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onStep(-1)}
                    disabled={!position || position.total < 2}
                    aria-label="Previous member"
                    className="h-8 w-8"
                  >
                    <ChevronLeft aria-hidden strokeWidth={1.75} className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onStep(1)}
                    disabled={!position || position.total < 2}
                    aria-label="Next member"
                    className="h-8 w-8"
                  >
                    <ChevronRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
                  </Button>
                  {position && (
                    <span className="type-meta ml-1.5 tabular-nums">
                      {position.index} / {position.total}
                    </span>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="Close"
                  className="h-8 w-8"
                >
                  <X aria-hidden strokeWidth={1.75} className="h-4 w-4" />
                </Button>
              </div>

              <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 sm:px-6">
                {/* Keyed on the member so stepping cross-fades the contents while
                  the panel itself stays put. */}
                <motion.div
                  key={member.id}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
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
                      {subtitle && (
                        <p className="type-body mt-1 text-muted-foreground">{subtitle}</p>
                      )}

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
                              className={cn(
                                "text-primary underline-offset-4 hover:underline",
                                FOCUS,
                              )}
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
                  <section className="rule mt-10 pt-4 lg:hidden">
                    <h3 className="type-label">Lootbox</h3>
                    <Lootbox
                      name={member.name}
                      items={member.lootbox}
                      isViewer={isViewer}
                      className="mt-3"
                    />
                  </section>

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
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
