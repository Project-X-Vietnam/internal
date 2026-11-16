import Link from "next/link";

import { PortalLayout } from "@/components/platform/nav";
import { FOCUS, PageHeader, Panel, Row, RuleList, Section } from "@/components/platform/page";
import { requireApprovedMember } from "@/lib/auth-guards";
import { countApprovedMembers } from "@/lib/members";
import { joinGaps, profileGaps } from "@/lib/onboarding";
import { countPublishedResources } from "@/lib/resources";
import { cn } from "@/lib/utils";

/**
 * Platform home — the index of the three surfaces. Follows the PJX design system
 * (globals.css tokens), not THEIA's look.
 */
export default async function HomePage() {
  const member = await requireApprovedMember();
  const [memberCount, resourceCount] = await Promise.all([
    countApprovedMembers(),
    countPublishedResources(),
  ]);

  const first = member.name.split(/\s+/)[0];

  // The optional half of onboarding, nudged rather than enforced. Two gaps at
  // most: a list of four reads as a chore and gets ignored wholesale.
  const gaps = profileGaps(member).slice(0, 2);

  return (
    <PortalLayout member={member} active="/">
      <PageHeader
        eyebrow="Project X Vietnam"
        title={`Welcome back, ${first}`}
        description="The team's own space — who we are, what we know, and what we've built."
      />

      {gaps.length > 0 && (
        <Panel dashed className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <p className="type-small text-muted-foreground">
            Your profile is missing {joinGaps(gaps)}.{" "}
            <span className="text-foreground">People find you by what&rsquo;s written here.</span>
          </p>
          <Link
            href="/me"
            className={cn(
              "type-small shrink-0 text-primary underline-offset-4 hover:underline",
              FOCUS,
            )}
          >
            Finish your profile &rarr;
          </Link>
        </Panel>
      )}

      <Section label="Surfaces" meta="3">
        <RuleList>
          <Row
            href="/directory"
            title="Team directory"
            description="Departments, roles, cohorts and ownership — who to ask about what."
            meta={`${memberCount} ${memberCount === 1 ? "member" : "members"}`}
          />
          <Row
            href="/resources"
            title="Knowledge & resources"
            description="Brand assets, templates, playbooks and onboarding docs, in one place."
            meta={
              resourceCount === 0
                ? "Empty"
                : `${resourceCount} ${resourceCount === 1 ? "item" : "items"}`
            }
          />
          <Row
            href="/artifacts"
            title="Artifacts"
            description="One-off internal builds — bonding games, experiments, retired tools."
            meta="1 build"
          />
        </RuleList>
      </Section>
    </PortalLayout>
  );
}
