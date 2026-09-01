import type { Metadata } from "next";
import Link from "next/link";

import { Avatar } from "@/components/platform/avatar";
import { PortalLayout } from "@/components/platform/nav";
import { FOCUS, PageHeader, Panel, RuleList, Section } from "@/components/platform/page";
import { OrganizationFields } from "@/components/platform/network-forms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth-guards";
import { PersonKind } from "@/lib/generated/prisma/enums";
import { adminCreateOrganization } from "@/lib/network-actions";
import { listNetworkForAdmin, listOrganizationsForAdmin, ROLE_LABELS } from "@/lib/network";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Network" };

export default async function AdminNetworkPage() {
  const admin = await requireAdmin();
  const [people, organizations] = await Promise.all([
    listNetworkForAdmin(),
    listOrganizationsForAdmin(),
  ]);

  const contacts = people.filter((person) => person.kind === PersonKind.CONTACT);
  const accounts = people.filter((person) => person.kind === PersonKind.ACCOUNT);

  const personRow = (person: (typeof people)[number]) => {
    const roles = [...new Set(person.engagements.map((entry) => entry.role))];
    return (
      <li key={person.id}>
        <Link
          href={`/admin/network/${person.id}`}
          className={cn(
            "group -mx-3 flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-4 transition-colors hover:bg-accent sm:-mx-4 sm:px-4",
            FOCUS,
          )}
        >
          <Avatar name={person.name} src={person.avatarUrl} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="type-small truncate font-medium transition-colors group-hover:text-primary">
              {person.name}
            </p>
            <p className="type-small truncate text-muted-foreground">
              {[person.title, person.email].filter(Boolean).join(" · ") || "No details yet"}
            </p>
          </div>
          {roles.length > 0 && (
            <ul className="flex shrink-0 flex-wrap gap-1">
              {roles.map((role) => (
                <li key={role}>
                  <Badge variant="outline">{ROLE_LABELS[role]}</Badge>
                </li>
              ))}
            </ul>
          )}
          <span
            aria-hidden
            className="type-meta shrink-0 transition-colors group-hover:text-primary"
          >
            &rarr;
          </span>
        </Link>
      </li>
    );
  };

  return (
    <PortalLayout member={admin} active="/admin/network">
      <PageHeader
        eyebrow="Admin"
        title="Network"
        description="Everyone who has touched PJX, and how. Engagements and notes written here are what the next cohort finds when this one hands over."
      >
        <div className="mt-6">
          <Button asChild size="sm">
            <Link href="/admin/network/new">Add contact</Link>
          </Button>
        </div>
      </PageHeader>

      <Section label="Contacts" meta={contacts.length > 0 ? String(contacts.length) : "none"}>
        {contacts.length === 0 ? (
          <Panel dashed className="mt-3 text-center">
            <p className="type-small text-muted-foreground">
              No external people yet. Speakers, mentors, trainers, advisors and partner
              representatives all start here.
            </p>
          </Panel>
        ) : (
          <RuleList className="mt-1">{contacts.map(personRow)}</RuleList>
        )}
      </Section>

      <Section label="Members" meta={String(accounts.length)}>
        <p className="type-small mt-3 max-w-2xl text-muted-foreground">
          Members manage their own history in their profile; open one here to add engagements or
          an admin note. Access itself is decided in{" "}
          <Link
            href="/admin/members"
            className={cn("text-primary underline-offset-4 hover:underline", FOCUS)}
          >
            Members
          </Link>
          .
        </p>
        {accounts.length > 0 && <RuleList className="mt-1">{accounts.map(personRow)}</RuleList>}
      </Section>

      <Section
        label="Organizations"
        meta={organizations.length > 0 ? String(organizations.length) : "none"}
      >
        {organizations.length > 0 && (
          <RuleList className="mt-1">
            {organizations.map((organization) => (
              <li key={organization.id}>
                <Link
                  href={`/admin/network/orgs/${organization.id}`}
                  className={cn(
                    "group -mx-3 flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-4 transition-colors hover:bg-accent sm:-mx-4 sm:px-4",
                    FOCUS,
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="type-small truncate font-medium transition-colors group-hover:text-primary">
                      {organization.name}
                    </p>
                    {organization.website && (
                      <p className="type-small truncate text-muted-foreground">
                        {organization.website}
                      </p>
                    )}
                  </div>
                  <span className="type-meta shrink-0">
                    {organization._count.engagements}{" "}
                    {organization._count.engagements === 1 ? "engagement" : "engagements"}
                  </span>
                  <span
                    aria-hidden
                    className="type-meta shrink-0 transition-colors group-hover:text-primary"
                  >
                    &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </RuleList>
        )}

        <Panel className="mt-5 max-w-2xl">
          <p className="type-label">Add an organization</p>
          <p className="type-small mt-2 text-muted-foreground">
            Usually not needed by hand — naming one on an engagement creates it. This is for
            filling in a website or a note ahead of time.
          </p>
          <form action={adminCreateOrganization} className="mt-4">
            <OrganizationFields idPrefix="new-organization" />
            <div className="mt-4">
              <Button type="submit" variant="outline">
                Add organization
              </Button>
            </div>
          </form>
        </Panel>
      </Section>
    </PortalLayout>
  );
}
