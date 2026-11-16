import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Layout primitives shared by every platform surface.
 *
 * Before these existed each page picked its own container width (max-w-2xl
 * through max-w-5xl) and its own vertical padding, so headings and nav links
 * never lined up between routes. Everything now sits on one 64rem column with
 * one gutter, and pages vary their *content* width, not their page width.
 *
 * The visual grammar is deliberately flat: hairline rules separate things,
 * radii stay near-square, and nothing casts a shadow.
 */

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring/70";

/**
 * One row of a floating menu (the rail's account popover). Lives here rather
 * than in the sidebar so the sign-out server component can import it without
 * crossing the client boundary.
 */
const MENU_ITEM = cn(
  "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
  FOCUS,
);

/**
 * The single page column. Every route uses this — no per-page max widths.
 *
 * Left-anchored rather than centred: beside a fixed sidebar, a centred column
 * drifts further from the nav the wider the display gets. The max-width still
 * caps line length, so rows never stretch to an unreadable measure.
 */
export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className={cn("w-full max-w-5xl px-6 pb-24 sm:px-8 lg:px-10", className)}>
      {children}
    </main>
  );
}

/**
 * Page title block. `eyebrow` is the small mono label above the title; `meta`
 * sits on the title's baseline at the far right (counts, dates, status).
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  back,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  back?: { href: string; label: string };
  children?: ReactNode;
}) {
  return (
    <header className="pt-12 sm:pt-16">
      {back && (
        <Link
          href={back.href}
          className={cn(
            "type-meta mb-8 inline-flex items-center gap-1.5 transition-colors hover:text-foreground",
            FOCUS,
          )}
        >
          <span aria-hidden>&larr;</span>
          {back.label}
        </Link>
      )}

      {eyebrow && <p className="type-label mb-3 text-primary">{eyebrow}</p>}

      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h1 className="type-display">{title}</h1>
        {meta && <span className="type-meta shrink-0">{meta}</span>}
      </div>

      {description && (
        <p className="type-body mt-3 max-w-xl text-muted-foreground">{description}</p>
      )}

      {children}
    </header>
  );
}

/**
 * A titled section. The rule across the top plus a mono label under it is the
 * portal's main divider — it replaces the boxed cards that used to group things.
 */
export function Section({
  label,
  meta,
  children,
  className,
}: {
  label?: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rule mt-14 pt-4", className)}>
      {(label || meta) && (
        <div className="mb-1 flex items-baseline justify-between gap-4">
          {label ? <h2 className="type-label">{label}</h2> : <span />}
          {meta && <span className="type-meta">{meta}</span>}
        </div>
      )}
      {children}
    </section>
  );
}

/** A list whose items are separated by hairlines rather than boxed as cards. */
export function RuleList({
  children,
  className,
  ...props
}: ComponentProps<"ul">) {
  return (
    <ul className={cn("rule-list", className)} {...props}>
      {children}
    </ul>
  );
}

/**
 * One row of a RuleList. Renders as a link when `href` is given, otherwise as a
 * static row (used for surfaces that exist but aren't built yet). An absolute
 * `href` is treated as leaving the platform: it opens in a new tab and its
 * affordance points out rather than forward.
 *
 * The hover state tints the whole row rather than moving it: the flat grammar
 * has no lift.
 */
export function Row({
  href,
  title,
  note,
  description,
  meta,
  children,
}: {
  href?: string;
  title: ReactNode;
  note?: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  const external = Boolean(href && /^https?:\/\//i.test(href));

  const body = (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className={cn("type-heading", href && "transition-colors group-hover:text-primary")}>
          {title}
          {note && <span className="ml-2 font-normal text-muted-foreground">{note}</span>}
        </h3>
        <span className="type-meta flex shrink-0 items-baseline gap-2">
          {meta}
          {href && (
            <span
              aria-hidden
              className="text-muted-foreground transition-colors group-hover:text-primary"
            >
              {external ? "\u2197" : "\u2192"}
            </span>
          )}
        </span>
      </div>
      {description && <p className="type-small mt-1.5 text-muted-foreground">{description}</p>}
      {children}
    </>
  );

  // The negative inline margin lets the hover tint bleed past the text column
  // while the text itself stays aligned with everything else on the page.
  const shape = "-mx-3 block px-3 py-6 sm:-mx-4 sm:px-4";

  const linkClass = cn("group transition-colors hover:bg-accent", shape, FOCUS);

  return (
    <li>
      {!href ? (
        <div className={shape}>{body}</div>
      ) : external ? (
        <a href={href} target="_blank" rel="noreferrer noopener" className={linkClass}>
          {body}
        </a>
      ) : (
        <Link href={href} className={linkClass}>
          {body}
        </Link>
      )}
    </li>
  );
}

/**
 * A bordered surface — used where content genuinely needs to be boxed off
 * (empty states, callouts) rather than merely grouped.
 */
export function Panel({
  children,
  className,
  dashed,
}: {
  children: ReactNode;
  className?: string;
  dashed?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-6",
        dashed ? "border-dashed border-border-strong" : "border-border-strong",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Centred single-column shell for the signed-out status screens. */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="portal flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}

/**
 * Two-column shell for sign-in: the form on the left, a media panel on the
 * right, each taking half the viewport.
 *
 * The split collapses to the form alone below `lg`. The panel is atmosphere,
 * not content — on a phone it would push the actual task below the fold, so it
 * is dropped rather than stacked, and its images are never fetched there.
 */
export function AuthSplitShell({
  children,
  aside,
  footer,
  wide,
}: {
  children: ReactNode;
  aside?: ReactNode;
  footer?: ReactNode;
  /** Widen the form column for surfaces with real forms rather than one button. */
  wide?: boolean;
}) {
  return (
    <div className="portal min-h-screen bg-background text-foreground lg:grid lg:grid-cols-2">
      <main className="flex min-h-screen flex-col px-6 py-8 sm:px-10 lg:min-h-0">
        {/* Logo, form and footer share one column so they sit on a single left
            edge, and that column is centred in the half rather than pinned to
            the gutter — otherwise the panel looks left-heavy at wide sizes. */}
        <div className={cn("mx-auto flex w-full flex-1 flex-col", wide ? "max-w-xl" : "max-w-sm")}>
          <Image
            src="/favicon.svg"
            alt="Project X Vietnam"
            width={28}
            height={28}
            className="h-7 w-7"
            priority
          />

          <div className={cn("flex flex-1 items-center", wide ? "py-10" : "py-14")}>
            <div className="w-full">{children}</div>
          </div>

          {footer ? (
            <div className="type-meta">{footer}</div>
          ) : (
            <div aria-hidden className="h-7" />
          )}
        </div>
      </main>

      {/* p-3 rather than flush: the inset is what lets the panel read as a
          rounded object instead of a cropped edge. */}
      {aside && (
        <div className="hidden p-3 lg:block">
          <div className="sticky top-3 h-[calc(100vh-1.5rem)]">{aside}</div>
        </div>
      )}
    </div>
  );
}

export { FOCUS, MENU_ITEM };
