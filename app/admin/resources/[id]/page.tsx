import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PortalLayout } from "@/components/platform/nav";
import { PageHeader, Section } from "@/components/platform/page";
import { ResourceForm } from "@/components/platform/resource-form";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth-guards";
import { ResourceStatus } from "@/lib/generated/prisma/enums";
import { deleteResource, updateResource } from "@/lib/resource-actions";
import { getResourceById, listCollections } from "@/lib/resources";
import { formatDate } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const resource = await getResourceById(id);
  return { title: resource ? `Edit — ${resource.title}` : "Resource" };
}

export default async function EditResourcePage({ params }: Params) {
  const admin = await requireAdmin();
  const { id } = await params;

  const [resource, collections] = await Promise.all([getResourceById(id), listCollections()]);
  if (!resource) notFound();

  const published = resource.status === ResourceStatus.PUBLISHED;

  return (
    <PortalLayout member={admin} active="/admin/resources">
      <PageHeader
        back={{ href: "/admin/resources", label: "Resources" }}
        eyebrow="Admin"
        title={resource.title}
        meta={`edited ${formatDate(resource.updatedAt)}`}
        description={published ? undefined : "Not published — members can't see this yet."}
      >
        {published && (
          <Button asChild variant="ghost" size="sm" className="-ml-3 mt-4">
            <Link href={`/resources/${resource.slug}`}>View it as a member does</Link>
          </Button>
        )}
      </PageHeader>

      <ResourceForm
        action={updateResource.bind(null, resource.id)}
        resource={resource}
        collections={collections}
        submitLabel="Save changes"
      />

      {/* Outside the edit form — a form can't nest, and destructive actions
          shouldn't share a submit surface with the safe one anyway. */}
      <Section label="Danger zone">
        <form
          className="mt-3 flex flex-wrap items-center gap-4"
          action={async () => {
            "use server";
            await deleteResource(resource.id);
          }}
        >
          <Button type="submit" variant="outline">
            Delete resource
          </Button>
          <p className="type-small text-muted-foreground">
            Permanent. Unpublish instead if you only want it out of the index.
          </p>
        </form>
      </Section>
    </PortalLayout>
  );
}
