import type { Metadata } from "next";
import Link from "next/link";

import { Avatar } from "@/components/platform/avatar";
import { DirectoryGallery, type GalleryMember } from "@/components/platform/directory-gallery";
import { PortalLayout } from "@/components/platform/nav";
import { FOCUS, PageHeader, Panel, RuleList, Section } from "@/components/platform/page";
import { SelectField } from "@/components/platform/select-field";
import { directoryHref, ViewToggle, type DirectoryView } from "@/components/platform/view-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requireApprovedMember } from "@/lib/auth-guards";
import { parseLootbox } from "@/lib/lootbox";
import { portraitFor } from "@/lib/member-photos";
import {
  listApprovedMembers,
  listCohorts,
  listDepartments,
  listExpertiseTags,
} from "@/lib/members";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Directory" };

type Search = { q?: string; department?: string; cohort?: string; tag?: string; view?: string };

export default async function DirectoryPage({ searchParams }: { searchParams: Promise<Search> }) {
  const member = await requireApprovedMember();
  const filters = await searchParams;
  const view: DirectoryView = filters.view === "list" ? "list" : "gallery";

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
    email: entry.email,
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
    lootbox: parseLootbox(entry.lootbox),
  }));

  return (
    <PortalLayout member={member} active="/directory">
      <PageHeader
        eyebrow="Team"
        title="Directory"
        description="Who's on the team and what to ask them about."
      />

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
