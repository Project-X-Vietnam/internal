import type { ReactNode } from "react";

import { LogOut } from "lucide-react";

import { MENU_ITEM, PageShell } from "@/components/platform/page";
import { Sidebar, type NavItem } from "@/components/platform/sidebar";
import { signOut } from "@/lib/auth";
import type { CurrentMember } from "@/lib/auth-guards";
import { countPendingMembers } from "@/lib/auth-guards";
import { MemberRole } from "@/lib/generated/prisma/enums";

const LINKS: NavItem[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/directory", label: "Directory", icon: "users" },
  { href: "/resources", label: "Resources", icon: "book" },
  { href: "/artifacts", label: "Artifacts", icon: "archive" },
];

/**
 * Sign-out lives in a server component so the action can stay inline; the
 * sidebar is a client boundary and takes this as a slot.
 */
function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/signin" });
      }}
    >
      <button type="submit" role="menuitem" className={MENU_ITEM}>
        <LogOut aria-hidden strokeWidth={1.75} className="h-4 w-4 shrink-0" />
        Sign out
      </button>
    </form>
  );
}

/**
 * The standard signed-in frame: the narrow icon rail and the shared page column
 * beside it, both inside `.portal` so they pick up the flat radius scale.
 */
export async function PortalLayout({
  member,
  active,
  wide,
  children,
}: {
  member: CurrentMember;
  active?: string;
  /** Drop the 64rem column cap so the surface fills the width beside the rail. */
  wide?: boolean;
  children: ReactNode;
}) {
  const isAdmin = member.role === MemberRole.ADMIN;
  const pending = isAdmin ? await countPendingMembers() : 0;

  const items: NavItem[] = isAdmin
    ? [
        ...LINKS,
        // Prefixed with "Admin" because in an icon rail the label *is* the only
        // text — without the heading the old column had, a bare "Resources"
        // here would be indistinguishable from the member-facing one.
        {
          href: "/admin/members",
          label: "Admin \u00b7 Members",
          icon: "admin",
          section: "admin",
          badge: pending || undefined,
        },
        {
          href: "/admin/resources",
          label: "Admin \u00b7 Resources",
          icon: "doc",
          section: "admin",
        },
      ]
    : LINKS;

  return (
    <div className="portal min-h-screen bg-background text-foreground">
      <Sidebar
        member={{ name: member.name, email: member.email, avatarUrl: member.avatarUrl }}
        items={items}
        active={active}
        signOut={<SignOutButton />}
      />

      {/* The rail is fixed, so the content column is inset by its width rather
          than sitting in a flex row — that keeps the column's own scrolling
          independent of the nav. The rail is the same width at every size, so
          there is no breakpoint to switch the inset at. */}
      <div className="pl-14 lg:pl-16">
        {/* The content section — one sheet, drawn once here, that every signed-in
            page renders into. It belongs to the shell rather than to any page:
            the rail and this frame are the app, everything inside is content.

            Inset on three sides so it reads as an object rather than a pane
            cropped by the viewport — the same move AuthSplitShell makes with
            its media panel. No inset on the left: the rail is wider than the
            40px icons it holds, so it already carries an 8px gutter (12px from
            `lg`), and padding here would double it. The rail deliberately draws
            no border, so this hairline is the only line in the chrome, and it
            is the lighter `border` token — at full-page scale the stronger one
            reads as a table.

            `min-h` keeps the sheet full-height on short pages, so a near-empty
            surface still looks like a page rather than a floating strip. */}
        <div className="py-2 pr-2 sm:py-3 sm:pr-3">
          <div className="min-h-[calc(100vh-1rem)] rounded-media border border-border bg-card sm:min-h-[calc(100vh-1.5rem)]">
            <PageShell className={wide ? "max-w-none" : undefined}>{children}</PageShell>
          </div>
        </div>
      </div>
    </div>
  );
}
