import type { Metadata } from "next";

import { PortalLayout } from "@/components/platform/nav";
import { PageHeader, Row, RuleList, Section } from "@/components/platform/page";
import { requireApprovedMember } from "@/lib/auth-guards";

export const metadata: Metadata = {
  title: "Artifacts",
  description: "One-off internal builds by the Project X Vietnam team.",
};

const ARTIFACTS = [
  {
    href: "/artifacts/theia",
    name: "THEIA",
    tagline: "AI treasure hunt",
    year: "2026",
    description:
      "A five-milestone investigation game built as a bonding session for Fellows. Teams join by code and work through browser-based puzzles against a set of fake third-party services.",
  },
];

export default async function ArtifactsPage() {
  const member = await requireApprovedMember();

  return (
    <PortalLayout member={member} active="/artifacts">
      <PageHeader
        eyebrow="Archive"
        title="Artifacts"
        description="One-off internal builds. Kept alive and browsable rather than deleted — these are past work, not live team resources."
      />

      <Section label="Builds" meta={String(ARTIFACTS.length)}>
        <RuleList>
          {ARTIFACTS.map((artifact) => (
            <Row
              key={artifact.href}
              href={artifact.href}
              title={artifact.name}
              note={artifact.tagline}
              description={artifact.description}
              meta={artifact.year}
            />
          ))}
        </RuleList>
      </Section>
    </PortalLayout>
  );
}
