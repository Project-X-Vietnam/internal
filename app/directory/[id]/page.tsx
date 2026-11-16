import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Avatar } from "@/components/platform/avatar";
import { Lootbox } from "@/components/platform/lootbox";
import { MemberPortrait } from "@/components/platform/member-portrait";
import { PortalLayout } from "@/components/platform/nav";
import { FOCUS, PageHeader, Section } from "@/components/platform/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireApprovedMember } from "@/lib/auth-guards";
import { MemberRole, PersonKind } from "@/lib/generated/prisma/enums";
import { LOOTBOX_ENABLED, parseLootbox } from "@/lib/lootbox";
import { portraitFor } from "@/lib/member-photos";
import { getMemberById } from "@/lib/members";
import {
  engagementContext,
  engagementHeadline,
  getNetworkPerson,
  getNotesForAdmin,
  yearSpan,
} from "@/lib/network";
import { cn } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const member = await getMemberById(id);
  return { title: member?.name ?? "Member" };
}

type Links = { linkedin?: string | null; lark?: string | null; portfolio?: string | null };

const LINK_LABELS: Record<keyof Links, string> = {
  linkedin: "LinkedIn",
  lark: "Lark",
  portfolio: "Portfolio",
};

/** One label/value pair in the ruled facts grid. */
function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rule-subtle py-3">
      <dt className="type-label">{label}</dt>
      <dd className="type-small mt-1">{children}</dd>
    </div>
  );
}

/** The "admin only" marker in front of a note — notes never render for members. */
function AdminNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="type-small mt-1.5 flex flex-wrap items-baseline gap-x-2 text-muted-foreground">
      <Badge variant="warning">admin only</Badge>
      <span className="min-w-0">{children}</span>
    </p>
  );
}

export default async function MemberProfilePage({ params }: Params) {
  const viewer = await requireApprovedMember();
  const { id } = await params;

  // Approved accounts and network contacts; pending, rejected and suspended
  // accounts are not part of any directory.
  const person = await getNetworkPerson(id);
  if (!person) notFound();
  const { member, engagements, connections } = person;

  const isAdmin = viewer.role === MemberRole.ADMIN;
  // Fetched only for admins — the public read physically can't select notes.
  const notes = isAdmin ? await getNotesForAdmin(member.id) : null;

  const links = (member.links ?? {}) as Links;
  const linkEntries = (Object.keys(LINK_LABELS) as (keyof Links)[])
    .map((key) => [key, links[key]] as const)
    .filter((entry): entry is readonly [keyof Links, string] => Boolean(entry[1]));

  const lootbox = parseLootbox(member.lootbox);
  const isViewer = viewer.id === member.id;
  const isContact = member.kind === PersonKind.CONTACT;

  const subtitle = [member.title, member.department?.name].filter(Boolean).join(" · ");
  // A section is only worth a rule and a label if it has something under it.
  const hasDetails = Boolean(
    member.cohort || member.location || member.timezone || linkEntries.length,
  );

  return (
    <PortalLayout member={viewer} active="/directory">
      <PageHeader back={{ href: "/directory", label: "Directory" }} title={member.name}>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-4">
          {/* Same 4:5 frame as the gallery tile, so arriving here from a tile
              feels like the same person got bigger rather than swapped. */}
          <div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-media bg-muted sm:w-28">
            <MemberPortrait
              name={member.name}
              portrait={portraitFor(member)}
              avatarUrl={member.avatarUrl}
              sizes="112px"
              priority
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {subtitle && <p className="type-body text-muted-foreground">{subtitle}</p>}
              {/* Says why this profile has no Lark handle to ping: they're part
                  of the network, not the current team. */}
              {isContact && <Badge variant="outline">Network contact</Badge>}
            </div>
            {member.email && (
              <p className="type-small mt-1">
                <a
                  href={`mailto:${member.email}`}
                  className={cn("text-primary underline-offset-4 hover:underline", FOCUS)}
                >
                  {member.email}
                </a>
              </p>
            )}
          </div>
          {isViewer && (
            <Button asChild variant="outline" size="sm">
              <Link href="/me">Edit profile</Link>
            </Button>
          )}
          {isAdmin && !isViewer && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/network/${member.id}`}>Manage in network</Link>
            </Button>
          )}
        </div>
      </PageHeader>

      {member.bio && (
        <Section label="About">
          <p className="type-body mt-3 max-w-2xl whitespace-pre-line">{member.bio}</p>
        </Section>
      )}

      {member.expertise.length > 0 && (
        <Section label="Ask me about">
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {member.expertise.map((tag) => (
              <li key={tag.id}>
                <Link
                  href={`/directory?tag=${encodeURIComponent(tag.slug)}`}
                  className={cn("inline-flex", FOCUS)}
                >
                  <Badge>{tag.label}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {(engagements.length > 0 || isViewer) && (
        <Section label="History" meta={engagements.length > 0 ? String(engagements.length) : undefined}>
          {engagements.length === 0 ? (
            <p className="type-small mt-3 text-muted-foreground">
              Your role history is empty —{" "}
              <Link href="/me" className={cn("text-primary underline-offset-4 hover:underline", FOCUS)}>
                add where you&rsquo;ve been
              </Link>
              .
            </p>
          ) : (
            <ol className="mt-1">
              {engagements.map((engagement) => (
                <li
                  key={engagement.id}
                  className="rule-subtle flex flex-col gap-x-6 py-3 sm:flex-row"
                >
                  <span className="type-meta w-32 shrink-0 pt-0.5 tabular-nums">
                    {yearSpan(engagement.startYear, engagement.endYear)}
                  </span>
                  <div className="min-w-0">
                    <p className="type-small font-medium">{engagementHeadline(engagement)}</p>
                    {engagementContext(engagement) && (
                      <p className="type-small mt-0.5 text-muted-foreground">
                        {engagementContext(engagement)}
                      </p>
                    )}
                    {notes?.engagements.get(engagement.id) && (
                      <AdminNote>{notes.engagements.get(engagement.id)}</AdminNote>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Section>
      )}

      {connections.length > 0 && (
        <Section label="Connections" meta={String(connections.length)}>
          {/* Every row here was written by an admin on purpose. Sharing a
              program year is deliberately NOT a connection. */}
          <ul className="mt-1">
            {connections.map((connection) => (
              <li
                key={connection.id}
                className="rule-subtle flex flex-wrap items-center gap-x-4 gap-y-2 py-3"
              >
                <Avatar name={connection.other.name} src={connection.other.avatarUrl} size="sm" />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/directory/${connection.other.id}`}
                    className={cn(
                      "type-small font-medium underline-offset-4 hover:text-primary hover:underline",
                      FOCUS,
                    )}
                  >
                    {connection.other.name}
                  </Link>
                  <p className="type-small mt-0.5 text-muted-foreground">{connection.label}</p>
                  {notes?.connections.get(connection.id) && (
                    <AdminNote>{notes.connections.get(connection.id)}</AdminNote>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {hasDetails && (
        <Section label="Details">
          <dl className="mt-1 grid gap-x-8 sm:grid-cols-2">
            {member.cohort && <Fact label="Cohort">{member.cohort}</Fact>}
            {member.location && <Fact label="Location">{member.location}</Fact>}
            {member.timezone && <Fact label="Timezone">{member.timezone}</Fact>}
            {linkEntries.length > 0 && (
              <Fact label="Links">
                <span className="flex flex-wrap gap-x-3">
                  {linkEntries.map(([key, value]) =>
                    // Lark is a handle, not a URL — linkifying it would produce a dead link.
                    key === "lark" ? (
                      <span key={key} className="text-muted-foreground">
                        Lark: <span className="text-foreground">{value}</span>
                      </span>
                    ) : (
                      <a
                        key={key}
                        href={value.startsWith("http") ? value : `https://${value}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={cn("text-primary underline-offset-4 hover:underline", FOCUS)}
                      >
                        {LINK_LABELS[key]}
                      </a>
                    ),
                  )}
                </span>
              </Fact>
            )}
          </dl>
        </Section>
      )}

      {notes?.person && (
        <Section label="Admin notes">
          <AdminNote>{notes.person}</AdminNote>
        </Section>
      )}

      {/* An empty lootbox is shown only to its owner: a prompt to fill it in is
          useful to them and dead weight on the other twenty-nine profiles. */}
      {LOOTBOX_ENABLED && (lootbox.length > 0 || isViewer) && (
        <Section label="Lootbox">
          <Lootbox
            name={member.name}
            items={lootbox}
            isViewer={isViewer}
            className="mt-3 max-w-2xl"
          />
        </Section>
      )}
    </PortalLayout>
  );
}
