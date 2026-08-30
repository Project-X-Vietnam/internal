"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Archive, BookOpen, FileText, Home, ShieldCheck, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { Avatar } from "@/components/platform/avatar";
import { FOCUS, MENU_ITEM } from "@/components/platform/page";
import { cn } from "@/lib/utils";

const ICONS = {
  home: Home,
  users: Users,
  book: BookOpen,
  archive: Archive,
  admin: ShieldCheck,
  doc: FileText,
} as const;

export type NavItem = {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
  /** Admin rows sit below the main cluster, past a dot separator. */
  section?: "admin";
  badge?: number;
};

/**
 * The reveal is gated on a real hover-capable pointer. Without it a tap leaves
 * the label stuck open on touch, because `:hover` never clears there.
 */
const REVEAL = "group-pointer-hover:translate-x-0 group-pointer-hover:opacity-100";

/**
 * A rail row. Nothing is ever painted behind an icon — state is carried by
 * colour alone: grey at rest, ink on hover, brand blue on the current route.
 * The label is plain text that slides out beside the icon on hover.
 */
function RailLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = ICONS[item.icon];

  return (
    <li>
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        aria-label={item.badge ? `${item.label}, ${item.badge} awaiting approval` : item.label}
        className={cn("group relative grid h-10 w-10 place-items-center rounded-full", FOCUS)}
      >
        <Icon
          aria-hidden
          strokeWidth={1.75}
          className={cn(
            "h-[1.15rem] w-[1.15rem] transition-[color,transform] duration-200 ease-out",
            "group-pointer-hover:scale-110",
            active
              ? "text-primary"
              : "text-muted-foreground group-pointer-hover:text-foreground group-focus-visible:text-foreground",
          )}
        />

        {item.badge ? (
          <span
            aria-hidden
            className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-amber-500 px-1 text-[0.5625rem] font-medium leading-none tabular-nums text-white"
          >
            {item.badge}
          </span>
        ) : null}

        {/* No ground of its own — it blurs whatever it floats over instead, so
            the label reads as bare text rather than a chip. Blur only, with no
            brightness lift: dark mode here comes from `prefers-color-scheme`
            rather than a `.dark` class, so a `dark:` variant would never fire
            and any lift would wash out the dark theme unconditionally.

            The label takes the icon's colour so an active row reads as one
            object rather than a blue mark with black text beside it. */}
        <span
          aria-hidden
          className={cn(
            // h-10 matches the icon button it extends from, so the blurred
            // patch reads as that button carrying on rather than a separate
            // strip floating beside it. Square-ish where they meet, pill on the
            // far end — the round edge is what stops it looking cut off.
            "pointer-events-none absolute left-full top-1/2 z-50 flex h-10 -translate-x-1 -translate-y-1/2 items-center whitespace-nowrap rounded-l-md rounded-r-full pl-2.5 pr-4 text-sm font-medium opacity-0 backdrop-blur-md transition-[opacity,transform] duration-200 ease-out",
            active ? "text-primary" : "text-foreground",
            REVEAL,
            "group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
          )}
        >
          {item.label}
        </span>
      </Link>
    </li>
  );
}

/**
 * The platform's primary navigation: a narrow icon rail, pinned left at every
 * width. No borders and no collapsed/expanded modes — the rail is only ever
 * this wide, and the gap between it and the page column is what separates them.
 *
 * `signOut` arrives as a slot rather than a prop callback — it is a server
 * component wrapping a server action, and this file is a client boundary.
 */
export function Sidebar({
  member,
  items,
  active,
  signOut,
}: {
  member: { name: string; email: string; avatarUrl?: string | null };
  items: NavItem[];
  active?: string;
  signOut: ReactNode;
}) {
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // A menu that survives navigation would cover the page you just asked for.
  useEffect(() => setMenu(false), [pathname]);

  useEffect(() => {
    if (!menu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenu(false);
      avatarRef.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || avatarRef.current?.contains(target)) return;
      setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [menu]);

  const main = items.filter((item) => item.section !== "admin");
  const admin = items.filter((item) => item.section === "admin");

  return (
    <aside
      aria-label="Main"
      className="fixed inset-y-0 left-0 z-40 flex w-14 flex-col items-center py-4 lg:w-16"
    >
      <Link
        href="/"
        aria-label="PJX Internal, home"
        className={cn("group grid h-10 w-10 shrink-0 place-items-center rounded-full", FOCUS)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/favicon.svg"
          alt=""
          aria-hidden
          className="h-6 w-6 transition-transform duration-300 ease-out group-pointer-hover:-rotate-12 group-pointer-hover:scale-110"
        />
      </Link>

      {/* The cluster is centred in the rail rather than stacked from the top —
          it is a short list, and centring is what stops it reading as the usual
          top-left menu. */}
      <nav className="flex flex-1 items-center">
        <ul className="flex flex-col items-center gap-1.5">
          {main.map((item) => (
            <RailLink key={item.href} item={item} active={active === item.href} />
          ))}

          {admin.length > 0 && (
            <>
              {/* A dot, not a rule: the rail has no lines anywhere on it. */}
              <li aria-hidden className="my-1.5 h-1 w-1 rounded-full bg-border-strong" />
              {admin.map((item) => (
                <RailLink key={item.href} item={item} active={active === item.href} />
              ))}
            </>
          )}
        </ul>
      </nav>

      <div className="relative shrink-0">
        <button
          ref={avatarRef}
          type="button"
          onClick={() => setMenu((open) => !open)}
          aria-haspopup="menu"
          aria-expanded={menu}
          aria-label={`${member.name}, account menu`}
          className={cn("grid h-10 w-10 place-items-center rounded-full", FOCUS)}
        >
          <Avatar
            name={member.name}
            src={member.avatarUrl}
            size="sm"
            className={cn(
              "ring-2 ring-transparent transition-[box-shadow] duration-200",
              menu && "ring-primary",
            )}
          />
        </button>

        <AnimatePresence>
          {menu && (
            <motion.div
              ref={menuRef}
              role="menu"
              aria-label="Account"
              initial={{ opacity: 0, scale: 0.94, x: -6 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.96, x: -4 }}
              transition={{ duration: 0.14, ease: "easeOut" }}
              // Shadow rather than an outline: nothing on the rail draws a
              // border, so the menu has to float instead of being framed.
              className="absolute bottom-0 left-full z-50 ml-2 w-56 origin-bottom-left rounded-lg bg-popover p-1.5 shadow-[0_12px_36px_-10px_hsl(var(--foreground)/0.28)]"
            >
              <p className="truncate px-2 pb-0.5 pt-1 text-sm font-medium">{member.name}</p>
              <p className="type-meta truncate px-2 pb-1.5">{member.email}</p>

              <Link href="/me" role="menuitem" className={MENU_ITEM}>
                <User aria-hidden strokeWidth={1.75} className="h-4 w-4 shrink-0" />
                Your profile
              </Link>
              {signOut}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
