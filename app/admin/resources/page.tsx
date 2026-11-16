import type { Metadata } from "next";
import Link from "next/link";

import { PortalLayout } from "@/components/platform/nav";
import { FOCUS, PageHeader, Panel, RuleList, Section } from "@/components/platform/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requireAdmin } from "@/lib/auth-guards";
import { ResourceKind, ResourceStatus } from "@/lib/generated/prisma/enums";
import {
  createCollection,
  deleteCollection,
  setResourceStatus,
} from "@/lib/resource-actions";
import { listCollections, listResourcesForAdmin } from "@/lib/resources";
import { cn, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Resources" };

const ROW = "-mx-3 flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-4 sm:-mx-4 sm:px-4";

type AdminResource = Awaited<ReturnType<typeof listResourcesForAdmin>>[number];

function ResourceRow({ resource }: { resource: AdminResource }) {
  const published = resource.status === ResourceStatus.PUBLISHED;

  return (
    <li className={ROW}>
      <div className="min-w-0 flex-1">
        <Link
          href={`/admin/resources/${resource.id}`}
          className={cn(
            "type-small block truncate font-medium transition-colors hover:text-primary",
            FOCUS,
          )}
        >
          {resource.title}
        </Link>
        <p className="type-meta mt-0.5 truncate">
          /{resource.slug}
          {resource.collection && <> · {resource.collection.name}</>}
          {resource.updatedBy && <> · edited by {resource.updatedBy.name}</>}
          <> · {formatDate(resource.updatedAt)}</>
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <Badge variant="outline">{resource.kind === ResourceKind.DOC ? "doc" : "link"}</Badge>
        <Badge variant={published ? "success" : "warning"}>
          {published ? "published" : "draft"}
        </Badge>
      </div>

      <div className="flex shrink-0 justify-end gap-1 sm:w-40">
        <form
          action={async () => {
            "use server";
            await setResourceStatus(
              resource.id,
              published ? ResourceStatus.DRAFT : ResourceStatus.PUBLISHED,
            );
          }}
        >
          <Button type="submit" size="sm" variant="ghost">
            {published ? "Unpublish" : "Publish"}
          </Button>
        </form>
        <Button asChild size="sm" variant="ghost">
          <Link href={`/admin/resources/${resource.id}`}>Edit</Link>
        </Button>
      </div>
    </li>
  );
}

export default async function AdminResourcesPage() {
  const admin = await requireAdmin();
  const [resources, collections] = await Promise.all([
    listResourcesForAdmin(),
    listCollections(),
  ]);

  const drafts = resources.filter((entry) => entry.status === ResourceStatus.DRAFT);
  const published = resources.filter((entry) => entry.status === ResourceStatus.PUBLISHED);
  const counts = new Map<string, number>();
  for (const resource of resources) {
    if (resource.collectionId) {
      counts.set(resource.collectionId, (counts.get(resource.collectionId) ?? 0) + 1);
    }
  }

  return (
    <PortalLayout member={admin} active="/admin/resources">
      <PageHeader
        eyebrow="Admin"
        title="Resources"
        description="What the knowledge hub holds. Documents are written here; anything already living in Lark, Drive or Figma should be a link rather than a copy."
      >
        <Button asChild className="mt-6">
          <Link href="/admin/resources/new">New resource</Link>
        </Button>
      </PageHeader>

      <Section label="Drafts" meta={drafts.length > 0 ? String(drafts.length) : "none"}>
        {drafts.length === 0 ? (
          <Panel dashed className="mt-3 text-center">
            <p className="type-small text-muted-foreground">Nothing in progress.</p>
          </Panel>
        ) : (
          <RuleList className="mt-1">
            {drafts.map((resource) => (
              <ResourceRow key={resource.id} resource={resource} />
            ))}
          </RuleList>
        )}
      </Section>

      <Section label="Published" meta={String(published.length)}>
        {published.length === 0 ? (
          <Panel dashed className="mt-3 text-center">
            <p className="type-small text-muted-foreground">
              Nothing is live yet — the hub reads as empty to members.
            </p>
          </Panel>
        ) : (
          <RuleList className="mt-1">
            {published.map((resource) => (
              <ResourceRow key={resource.id} resource={resource} />
            ))}
          </RuleList>
        )}
      </Section>

      <Section label="Collections" meta={String(collections.length)}>
        <RuleList className="mt-1">
          {collections.map((collection) => {
            const held = counts.get(collection.id) ?? 0;
            return (
              <li key={collection.id} className={ROW}>
                <div className="min-w-0 flex-1">
                  <p className="type-small truncate font-medium">{collection.name}</p>
                  <p className="type-meta mt-0.5 truncate">/{collection.slug}</p>
                </div>
                <span className="type-meta shrink-0">
                  {held} {held === 1 ? "item" : "items"}
                </span>
                {/* Only offered when it would actually succeed — the action
                    refuses a non-empty collection server-side regardless. */}
                <div className="flex shrink-0 justify-end sm:w-24">
                  {held === 0 && (
                    <form
                      action={async () => {
                        "use server";
                        await deleteCollection(collection.id);
                      }}
                    >
                      <Button type="submit" size="sm" variant="ghost">
                        Delete
                      </Button>
                    </form>
                  )}
                </div>
              </li>
            );
          })}
        </RuleList>

        <form action={createCollection} className="mt-6 flex max-w-md flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="collection-name">
            New collection name
          </label>
          <Input
            id="collection-name"
            name="name"
            required
            placeholder="Brand & assets"
            className="flex-1"
          />
          <Button type="submit" variant="outline">
            Add collection
          </Button>
        </form>
      </Section>
    </PortalLayout>
  );
}
