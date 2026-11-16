import type { Metadata } from "next";

import { PortalLayout } from "@/components/platform/nav";
import { PageHeader, Section } from "@/components/platform/page";
import { ContactFields } from "@/components/platform/network-forms";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth-guards";
import { adminCreateContact } from "@/lib/network-actions";

export const metadata: Metadata = { title: "Add contact" };

export default async function NewContactPage() {
  const admin = await requireAdmin();

  return (
    <PortalLayout member={admin} active="/admin/network">
      <PageHeader
        back={{ href: "/admin/network", label: "Network" }}
        eyebrow="Admin"
        title="Add a contact"
        description="A name is enough to save — fill the rest in as you learn it. Engagements are added on their record afterwards."
      />

      <Section>
        <form action={adminCreateContact} className="mt-3">
          <ContactFields idPrefix="new-contact" />
          <div className="mt-6 flex items-center gap-3">
            <Button type="submit">Create contact</Button>
          </div>
        </form>
      </Section>
    </PortalLayout>
  );
}
