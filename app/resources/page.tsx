import type { Metadata } from "next";
import Link from "next/link";

import { PortalLayout } from "@/components/platform/nav";
import { PageHeader, Panel, Row, RuleList, Section } from "@/components/platform/page";
import { Button } from "@/components/ui/button";
import { requireApprovedMember } from "@/lib/auth-guards";
import { MemberRole, ResourceKind } from "@/lib/generated/prisma/enums";
import { listCollections, listPublishedResources, type ResourceCard } from "@/lib/resources";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Knowledge & resources",
  description: "Brand assets, templates, playbooks and onboarding docs for the PJX team.",
};

/** A LINK row says where it's going; a DOC row says who wrote it. */
function note(resource: ResourceCard) {
  if (resource.kind === ResourceKind.DOC) return resource.byline ?? undefined;
  if (!resource.url) return undefined;
  try {
    return new URL(resource.url).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

function ResourceRows({ items }: { items: ResourceCard[] }) {
  return (
    <RuleList>
      {items.map((resource) => (
        <Row
          key={resource.id}
          href={
            resource.kind === ResourceKind.LINK && resource.url
              ? resource.url
              : `/resources/${resource.slug}`
          }
          title={resource.title}
          note={note(resource)}
          description={resource.summary ?? undefined}
          meta={resource.publishedAt ? formatDate(resource.publishedAt) : undefined}
        />
      ))}
    </RuleList>
  );
}

export default async function ResourcesPage() {
  const member = await requireApprovedMember();
  const [collections, resources] = await Promise.all([
    listCollections(),
    listPublishedResources(),
  ]);

  const grouped = collections
    .map((collection) => ({
      collection,
      items: resources.filter((resource) => resource.collectionId === collection.id),
    }))
    // An empty collection is scaffolding, not content — it shouldn't take up a
    // rule and a label until something lives in it.
    .filter((group) => group.items.length > 0);

  const filed = new Set(grouped.flatMap((group) => group.items.map((item) => item.id)));
  const unfiled = resources.filter((resource) => !filed.has(resource.id));

  return (
    <PortalLayout member={member} active="/resources">
      <PageHeader
        eyebrow="Knowledge"
        title="Resources"
        description="Brand assets, templates, playbooks and onboarding docs — the material that used to be scattered across markdown files and Lark."
        meta={`${resources.length} ${resources.length === 1 ? "item" : "items"}`}
      />

      {resources.length === 0 ? (
        <Section label="Nothing here yet">
          <Panel dashed className="mt-3 text-center">
            <p className="type-small text-muted-foreground">
              The hub is empty.
              {member.role === MemberRole.ADMIN
                ? " Add the first resource to get it started."
                : " An admin has to publish something before it shows up here."}
            </p>
            {member.role === MemberRole.ADMIN && (
              <Button asChild size="sm" className="mt-4">
                <Link href="/admin/resources/new">Add a resource</Link>
              </Button>
            )}
          </Panel>
        </Section>
      ) : (
        <>
          {grouped.map(({ collection, items }) => (
            <Section key={collection.id} label={collection.name} meta={String(items.length)}>
              {collection.description && (
                <p className="type-small mb-2 mt-1 max-w-xl text-muted-foreground">
                  {collection.description}
                </p>
              )}
              <ResourceRows items={items} />
            </Section>
          ))}

          {unfiled.length > 0 && (
            <Section label="Everything else" meta={String(unfiled.length)}>
              <ResourceRows items={unfiled} />
            </Section>
          )}
        </>
      )}
    </PortalLayout>
  );
}
