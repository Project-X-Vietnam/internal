import type { Metadata } from "next";

import { PortalLayout } from "@/components/platform/nav";
import { PageHeader } from "@/components/platform/page";
import { ResourceForm } from "@/components/platform/resource-form";
import { requireAdmin } from "@/lib/auth-guards";
import { createResource } from "@/lib/resource-actions";
import { listCollections } from "@/lib/resources";

export const metadata: Metadata = { title: "New resource" };

export default async function NewResourcePage() {
  const admin = await requireAdmin();
  const collections = await listCollections();

  return (
    <PortalLayout member={admin} active="/admin/resources">
      <PageHeader
        back={{ href: "/admin/resources", label: "Resources" }}
        eyebrow="Admin"
        title="New resource"
        description="Save it as a draft while it's still taking shape — only admins see drafts."
      />
      <ResourceForm
        action={createResource}
        collections={collections}
        submitLabel="Create resource"
      />
    </PortalLayout>
  );
}
