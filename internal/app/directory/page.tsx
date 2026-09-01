import type { Metadata } from "next";
import Link from "next/link";

import { Avatar } from "@/components/platform/avatar";
import { DirectoryGallery, type GalleryMember } from "@/components/platform/directory-gallery";
import { PortalLayout } from "@/components/platform/nav";
import { NetworkList } from "@/components/platform/network-list";
import { type NetworkSheetPerson } from "@/components/platform/network-sheet";
import { FOCUS, PageHeader, Panel, RuleList, Section } from "@/components/platform/page";
import { SelectField } from "@/components/platform/select-field";
import { directoryHref, ViewToggle, type DirectoryView } from "@/components/platform/view-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requireApprovedMember } from "@/lib/auth-guards";
import { MemberRole } from "@/lib/generated/prisma/enums";
import { LOOTBOX_ENABLED, parseLootbox } from "@/lib/lootbox";
import { portraitFor } from "@/lib/member-photos";
import {
  listApprovedMembers,
  listCohorts,
  listDepartments,
  listExpertiseTags,
} from "@/lib/members";
import {
  engagementContext,
  engagementHeadline,
  latestEngagementSummary,
  listNetworkPeople,
  listNetworkYears,
  listPrograms,
  ROLE_LABELS,
  yearSpan,
} from "@/lib/network";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Directory" };

type Scope = "team" | "network";

type Search = {
  q?: string;
  department?: string;
  cohort?: string;
  tag?: string;
  view?: string;
  scope?: string;
  role?: string;
  year?: string;
  program?: string;
};

/**
 * Team ⇄ Network, styled like the view toggle. Two different questions: Team is
 * "who is here now", Network is "who has ever touched PJX". Only the search
 * carries across — each scope's other filters mean nothing on the far side.
 */
function ScopeToggle({ scope, q }: { scope: Scope; q?: string }) {
  const href = (target: Scope) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (target === "network") params.set("scope", "network");
    const query = params.toString();
    return query ? `/directory?${query}` : "/directory";
  };

  return (
    <div
      className="mt-6 inline-flex h-9 items-center gap-0.5 rounded-lg border border-border-strong bg-card p-0.5 font-sans"
      role="group"
      aria-label="Directory scope"
    >
      {(
        [
          { value: "team", label: "Team" },
          { value: "network", label: "Network" },
        ] as const
      ).map((option) => {
        const active = scope === option.value;
        return (
          <Link
            key={option.value}
            href={href(option.value)}
            aria-current={active ? "true" : undefined}
            className={cn(
              "inline-flex h-8 items-center rounded-md px-3 text-sm transition-colors",
              active
                ? "bg-accent font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground",
              FOCUS,
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}

export default async function DirectoryPage({ searchParams }: { searchParams: Promise<Search> }) {
  const member = await requireApprovedMember();
  const filters = await searchParams;
  const scope: Scope = filters.scope === "network" ? "network" : "team";
  const view: DirectoryView = filters.view === "list" ? "list" : "gallery";

  const header = (
    <PageHeader
      eyebrow={scope === "team" ? "Team" : "Network"}
      title="Directory"
      description={
        scope === "team"
          ? "Who's on the team and what to ask them about."
          : "Everyone who has touched Project X Vietnam — fellows, speakers, mentors, trainers, advisors, partners — across years and programs."
      }
    >
      <ScopeToggle scope={scope} q={filters.q} />
    </PageHeader>
  );

  if (scope === "network") {
    const [people, years, programs] = await Promise.all([
      listNetworkPeople(filters),
      listNetworkYears(),
      listPrograms(),
    ]);
    const filtered = Boolean(filters.q || filters.role || filters.year || filters.program);

    // Same idea as `gallery` below: only what the rows and the sheet render,
    // pre-formatted, because the display helpers live in lib/network.ts, which
    // imports the db and must not be pulled into the client bundle.
    const sheetPeople: NetworkSheetPerson[] = people.map((person) => ({
      id: person.id,
      name: person.name,
      email: person.email,
      title: person.title,
      location: person.location,
      bio: person.bio,
      portrait: portraitFor(person),
      avatarUrl: person.avatarUrl,
      summary:
        latestEngagementSummary(person.engagements) ?? person.title ?? "No engagements yet",
      roles: [...new Set(person.engagements.map((entry) => entry.role))].map(
        (role) => ROLE_LABELS[role],
      ),
      expertise: person.expertise.map((tag) => ({ id: tag.id, label: tag.label })),
      engagements: person.engagements.map((entry) => ({
        id: entry.id,
        years: yearSpan(entry.startYear, entry.endYear),
        headline: engagementHeadline(entry),
        context: engagementContext(entry),
      })),
    }));

    return (
      <PortalLayout member={member} active="/directory">
        {header}

        <Section label="Filter">
          <form className="mt-3 flex flex-wrap items-center gap-2" role="search">
            <input type="hidden" name="scope" value="network" />

            <Input
              type="search"
              name="q"
              defaultValue={filters.q ?? ""}
              placeholder="Search name, organization, expertise…"
              aria-label="Search the network"
              className="h-9 w-full sm:w-56"
            />

            <SelectField
              name="role"
              defaultValue={filters.role ?? ""}
              aria-label="Filter by role"
              className="w-auto min-w-32"
              options={[
                { value: "", label: "Any role" },
                ...Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label })),
              ]}
            />

            <SelectField
              name="year"
              defaultValue={filters.year ?? ""}
              aria-label="Filter by year"
              className="w-auto min-w-28"
              options={[
                { value: "", label: "Any year" },
                ...years.map((year) => ({ value: String(year), label: String(year) })),
              ]}
            />

            <SelectField
              name="program"
              defaultValue={filters.program ?? ""}
              aria-label="Filter by program"
              className="w-auto min-w-32"
              options={[
                { value: "", label: "Any program" },
                ...programs.map((program) => ({ value: program.slug, label: program.name })),
              ]}
            />

            <Button type="submit" variant="outline">
              Apply
            </Button>
            {filtered && (
              <Button asChild variant="ghost">
                <Link href="/directory?scope=network">Clear</Link>
              </Button>
            )}
          </form>
        </Section>

        <Section
          label="People"
          meta={`${people.length} ${people.length === 1 ? "person" : "people"}`}
        >
          <p className="sr-only" aria-live="polite">
            {people.length} {people.length === 1 ? "person" : "people"}
          </p>

          {people.length === 0 ? (
            <Panel dashed className="mt-3 text-center">
              <p className="type-small text-muted-foreground">
                {filtered ? (
                  "No one matches those filters."
                ) : member.role === MemberRole.ADMIN ? (
                  <>
                    The network is empty so far —{" "}
                    <Link
                      href="/admin/network/new"
                      className={cn("text-primary underline-offset-4 hover:underline", FOCUS)}
                    >
                      add the first contact
                    </Link>
                    .
                  </>
                ) : (
                  "The network is empty so far. Admins add speakers, mentors and partners as PJX works with them."
                )}
              </p>
            </Panel>
          ) : (
            <NetworkList
              people={sheetPeople}
              viewerId={member.id}
              isAdmin={member.role === MemberRole.ADMIN}
            />
          )}
        </Section>
      </PortalLayout>
    );
  }

  const [members, departments, cohorts, tags] = await Promise.all([
    listApprovedMembers(filters),
    listDepartments(),
    listCohorts(),
    listExpertiseTags(),
  ]);

  const filtered = Boolean(filters.q || filters.department || filters.cohort || filters.tag);

  // Only what the tiles and the sheet render — this crosses to the client, so
  // the row's other columns (status, role, approval trail) stay on the server.
  const gallery: GalleryMember[] = members.map((entry) => ({
    id: entry.id,
    name: entry.name,
    // Always present on an approved account; the column is nullable only for
    // network contacts, which the Team scope never lists.
    email: entry.email ?? "",
    title: entry.title,
    department: entry.department?.name ?? null,
    cohort: entry.cohort,
    location: entry.location,
    timezone: entry.timezone,
    bio: entry.bio,
    portrait: portraitFor(entry),
    avatarUrl: entry.avatarUrl,
    expertise: entry.expertise.map((tag) => ({ id: tag.id, label: tag.label, slug: tag.slug })),
    links: (entry.links ?? {}) as GalleryMember["links"],
    // Nothing renders it while the feature is off, so it shouldn't cross to
    // the browser either.
    lootbox: LOOTBOX_ENABLED ? parseLootbox(entry.lootbox) : [],
  }));

  return (
    <PortalLayout member={member} active="/directory">
      {header}

      {/* Plain GET form: filtering is a URL, so it survives refresh, back and sharing. */}
      <Section label="Filter">
        {/* The toggle sits outside the form and the outer row does NOT wrap, so
            the filters wrap *within their own group* and the toggle stays pinned
            to the right of the first line. When both were flex-wrap siblings the
            toggle dropped to a line of its own and read as orphaned. */}
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-x-6">
          <form className="flex min-w-0 flex-1 flex-wrap items-center gap-2" role="search">
            {/* Carries the current view through Apply — filtering shouldn't drop
              you back into the gallery you just left. */}
            {view === "list" && <input type="hidden" name="view" value="list" />}

            <Input
              type="search"
              name="q"
              defaultValue={filters.q ?? ""}
              placeholder="Search name, title, expertise…"
              aria-label="Search the directory"
              className="h-9 w-full sm:w-56"
            />

            <SelectField
              name="department"
              defaultValue={filters.department ?? ""}
              aria-label="Filter by department"
              className="w-auto min-w-32"
              options={[
                { value: "", label: "All departments" },
                ...departments.map((department) => ({
                  value: department.slug,
                  label: department.name,
                })),
              ]}
            />

            <SelectField
              name="cohort"
              defaultValue={filters.cohort ?? ""}
              aria-label="Filter by cohort"
              className="w-auto min-w-32"
              options={[
                { value: "", label: "All cohorts" },
                ...cohorts.map((cohort) => ({ value: cohort, label: cohort })),
              ]}
            />

            <SelectField
              name="tag"
              defaultValue={filters.tag ?? ""}
              aria-label="Filter by expertise"
              className="w-auto min-w-32"
              options={[
                { value: "", label: "Any expertise" },
                ...tags.map((tag) => ({ value: tag.slug, label: tag.label })),
              ]}
            />

            {/* Default size, not sm: the buttons share the 36px height of the
              inputs so the whole filter strip sits on one line. */}
            <Button type="submit" variant="outline">
              Apply
            </Button>
            {filtered && (
              <Button asChild variant="ghost">
                <Link href={directoryHref({ view: filters.view }, view)}>Clear</Link>
              </Button>
            )}
          </form>

          {/* It changes how the results look, not which results they are, so it
              sits apart from the filters rather than among them. */}
          <div className="shrink-0">
            <ViewToggle filters={filters} view={view} />
          </div>
        </div>
      </Section>

      <Section
        label="Members"
        meta={`${members.length} ${members.length === 1 ? "member" : "members"}`}
      >
        <p className="sr-only" aria-live="polite">
          {members.length} {members.length === 1 ? "member" : "members"}
        </p>

        {members.length === 0 ? (
          <Panel dashed className="mt-3 text-center">
            <p className="type-small text-muted-foreground">
              {filtered
                ? "No one matches those filters."
                : "No approved members yet. Once people sign in and an admin approves them, they'll appear here."}
            </p>
          </Panel>
        ) : view === "gallery" ? (
          <DirectoryGallery members={gallery} viewerId={member.id} />
        ) : (
          <RuleList className="mt-1">
            {members.map((entry) => (
              <li key={entry.id}>
                <Link
                  href={`/directory/${entry.id}`}
                  className={cn(
                    "group -mx-3 flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-4 transition-colors hover:bg-accent sm:-mx-4 sm:px-4",
                    FOCUS,
                  )}
                >
                  <Avatar name={entry.name} src={entry.avatarUrl} />
                  <div className="order-2 min-w-0 flex-1">
                    <p className="type-small truncate font-medium transition-colors group-hover:text-primary">
                      {entry.name}
                    </p>
                    <p className="type-small truncate text-muted-foreground">
                      {[entry.title, entry.department?.name].filter(Boolean).join(" · ") ||
                        "No title yet"}
                    </p>
                  </div>
                  {/* On narrow screens the tags drop to their own line — sharing
                      one with the name is what truncated people's names to
                      "Mai Tr…". */}
                  {entry.expertise.length > 0 && (
                    <ul className="order-4 flex w-full flex-wrap gap-1 sm:order-3 sm:w-auto sm:shrink-0">
                      {entry.expertise.slice(0, 3).map((tag) => (
                        <li key={tag.id}>
                          <Badge variant="outline">{tag.label}</Badge>
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
                </Link>
              </li>
            ))}
          </RuleList>
        )}
      </Section>
    </PortalLayout>
  );
}
