import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Markdown } from "@/components/platform/markdown";
import { PortalLayout } from "@/components/platform/nav";
import { PageHeader, Panel, Section } from "@/components/platform/page";
import { Button } from "@/components/ui/button";
import { requireApprovedMember } from "@/lib/auth-guards";
import { ResourceKind } from "@/lib/generated/prisma/enums";
import { getPublishedResource } from "@/lib/resources";
import { formatDate } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getPublishedResource(slug);
  return {
    title: resource?.title ?? "Resource",
    description: resource?.summary ?? undefined,
  };
}

export default async function ResourcePage({ params }: Params) {
  const member = await requireApprovedMember();
  const { slug } = await params;

  const resource = await getPublishedResource(slug);
  // Drafts 404 rather than 403 — an unpublished doc isn't something members
  // should be told exists.
  if (!resource) notFound();

  const stamp = resource.publishedAt ?? resource.updatedAt;

  return (
    <PortalLayout member={member} active="/resources" wide>
      <PageHeader
        back={{ href: "/resources", label: "Resources" }}
        eyebrow={resource.collection?.name ?? "Knowledge"}
        title={resource.title}
        description={resource.summary ?? undefined}
        meta={formatDate(stamp)}
      >
        {resource.byline && (
          <p className="type-small mt-4 text-muted-foreground">{resource.byline}</p>
        )}
      </PageHeader>

      {resource.kind === ResourceKind.LINK ? (
        <Section label="Where this lives">
          <Panel className="mt-3">
            <p className="type-small text-muted-foreground">
              This one isn&rsquo;t held here — it lives in another tool and stays there, so
              there&rsquo;s only ever one copy to keep current.
            </p>
            {resource.url && (
              <Button asChild className="mt-4">
                <a href={resource.url} target="_blank" rel="noreferrer noopener">
                  Open it &#8599;
                </a>
              </Button>
            )}
          </Panel>
        </Section>
      ) : (
        // `wide` on the layout above is what lets this fill the content
        // section; the document sets no width of its own.
        <article className="rule mt-12 pb-4 pt-10">
          <Markdown source={resource.body ?? ""} />
        </article>
      )}
    </PortalLayout>
  );
}
