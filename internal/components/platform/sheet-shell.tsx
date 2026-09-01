"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

import { FOCUS } from "@/components/platform/page";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The overlay shared by the directory quick-look sheets — MemberSheet for the
 * Team scope, NetworkSheet for the Network scope. The shell owns everything a
 * dialog has to get right once: the scrim, the slide-in panel, scroll locking,
 * the focus trap, Escape to close, arrow keys to step, and the sticky
 * prev/next chrome. The sheets own only their contents.
 *
 * A sheet is a *second* way to read a profile, never the only one: the tiles
 * and rows behind it are real links to `/directory/[id]`, and the sheet
 * intercepts the click only when JavaScript is around to do it. That is why
 * every sheet's footer offers the full page — a sheet can't be linked to or
 * sent to someone, and these hold enough that people will want to.
 */

const SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea';

/** One label/value pair in a sheet's details grid. Mirrors `Fact` on the profile page. */
export function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rule-subtle py-3">
      <dt className="type-label">{label}</dt>
      <dd className="type-small mt-1">{children}</dd>
    </div>
  );
}

export function ContactLink({
  href,
  icon: Icon,
  children,
  external,
}: {
  href: string;
  icon: React.ComponentType<{ "aria-hidden"?: boolean; strokeWidth?: number; className?: string }>;
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

export function SheetShell({
  open,
  contentKey,
  labelledBy,
  position,
  onClose,
  onStep,
  aside,
  columnClassName,
  children,
}: {
  open: boolean;
  /** Identity of what's shown — stepping to a new one resets scroll and cross-fades. */
  contentKey: string | null;
  /** id of the heading inside `children` that names the dialog. */
  labelledBy: string;
  /** 1-based place in the filtered list, for the "3 / 19" counter. */
  position: { index: number; total: number } | null;
  onClose: () => void;
  onStep: (delta: number) => void;
  /** Optional column standing left of the sheet, inside the same panel (the lootbox case). */
  aside?: React.ReactNode;
  /** Width of the content column — the panel shrink-wraps it plus the aside. */
  columnClassName?: string;
  children: React.ReactNode;
}) {
  // The dialog is the whole overlay, not just the sheet: an aside (the lootbox
  // case) is a sibling of the sheet, and `aria-modal` on the sheet alone would
  // hide it from assistive technology entirely. The focus trap reads the same node.
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Stepping to another person should start that profile at the top; without
  // this the second one you look at opens scrolled to wherever you left the
  // first.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [contentKey]);

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

      // Arrow keys walk the list — but not while someone is typing, and not
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
      // change as you step between people, and pieces come and go with the
      // breakpoint.
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
  // and screen readers announce it rather than staying on the list behind.
  const captureFocus = useCallback((node: HTMLDivElement | null) => {
    dialogRef.current = node;
    node?.focus();
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <div
          ref={captureFocus}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
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

          {/* ONE panel, aside included — same outline, same shadowless edge, no
              gap — so an aside reads as the sheet having opened wider to make
              room for it rather than as a second window that happens to be
              nearby.

              The panel has no width of its own: it is absolutely positioned
              against the right edge only, so it shrink-wraps whatever the
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
                reading order should follow the eye. */}
            {aside}

            {/* The content column. Its width is the sheet width — the panel is
                that plus the aside, which is why neither is set on the parent. */}
            <div className={cn("flex w-full flex-col", columnClassName)}>
              {/* Sticky chrome: stepping through 19 people shouldn't mean
                scrolling back up to find the next arrow. */}
              <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-2.5 sm:px-6">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onStep(-1)}
                    disabled={!position || position.total < 2}
                    aria-label="Previous person"
                    className="h-8 w-8"
                  >
                    <ChevronLeft aria-hidden strokeWidth={1.75} className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onStep(1)}
                    disabled={!position || position.total < 2}
                    aria-label="Next person"
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
                {/* Keyed on the person so stepping cross-fades the contents while
                  the panel itself stays put. */}
                <motion.div
                  key={contentKey ?? "empty"}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  {children}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
