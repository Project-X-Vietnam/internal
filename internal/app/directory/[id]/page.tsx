import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Lootbox } from "@/components/platform/lootbox";
import { MemberPortrait } from "@/components/platform/member-portrait";
import { PortalLayout } from "@/components/platform/nav";
import { FOCUS, PageHeader, Section } from "@/components/platform/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireApprovedMember } from "@/lib/auth-guards";
import { MemberStatus } from "@/lib/generated/prisma/enums";
import { parseLootbox } from "@/lib/lootbox";
import { portraitFor } from "@/lib/member-photos";
import { getMemberById } from "@/lib/members";
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

export default async function MemberProfilePage({ params }: Params) {
  const viewer = await requireApprovedMember();
  const { id } = await params;

  const member = await getMemberById(id);
  // Pending, rejected and suspended people are not part of the directory.
  if (!member || member.status !== MemberStatus.APPROVED) notFound();

  const links = (member.links ?? {}) as Links;
  const linkEntries = (Object.keys(LINK_LABELS) as (keyof Links)[])
    .map((key) => [key, links[key]] as const)
    .filter((entry): entry is readonly [keyof Links, string] => Boolean(entry[1]));

  const lootbox = parseLootbox(member.lootbox);
  const isViewer = viewer.id === member.id;

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
            {subtitle && <p className="type-body text-muted-foreground">{subtitle}</p>}
            <p className="type-small mt-1">
              <a
                href={`mailto:${member.email}`}
                className={cn("text-primary underline-offset-4 hover:underline", FOCUS)}
              >
                {member.email}
              </a>
            </p>
          </div>
          {isViewer && (
            <Button asChild variant="outline" size="sm">
              <Link href="/me">Edit profile</Link>
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

      {/* An empty lootbox is shown only to its owner: a prompt to fill it in is
          useful to them and dead weight on the other twenty-nine profiles. */}
      {(lootbox.length > 0 || isViewer) && (
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
