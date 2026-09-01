import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Avatar } from "@/components/platform/avatar";
import { PortalLayout } from "@/components/platform/nav";
import { FOCUS, PageHeader, Section } from "@/components/platform/page";
import { OrganizationFields } from "@/components/platform/network-forms";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth-guards";
import { adminDeleteOrganization, adminUpdateOrganization } from "@/lib/network-actions";
import {
  engagementContext,
  engagementHeadline,
  getOrganizationForAdmin,
  yearSpan,
} from "@/lib/network";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Organization" };

type Params = { params: Promise<{ id: string }> };

export default async function AdminOrganizationPage({ params }: Params) {
  const admin = await requireAdmin();
  const { id } = await params;

  const organization = await getOrganizationForAdmin(id);
  if (!organization) notFound();

  return (
    <PortalLayout member={admin} active="/admin/network">
      <PageHeader
        back={{ href: "/admin/network", label: "Network" }}
        eyebrow="Admin"
        title={organization.name}
      />

      <Section label="Details">
        <form
          action={async (formData: FormData) => {
            "use server";
            await adminUpdateOrganization(organization.id, formData);
          }}
          className="mt-3"
        >
          <OrganizationFields
            idPrefix="edit-organization"
            defaults={{
              name: organization.name,
              website: organization.website,
              note: organization.note,
            }}
          />
          <div className="mt-4">
            <Button type="submit" variant="outline">
              Save details
            </Button>
          </div>
        </form>
      </Section>

      <Section
        label="Engagement history"
        meta={organization.engagements.length > 0 ? String(organization.engagements.length) : "none"}
      >
        <p className="type-small mt-3 max-w-2xl text-muted-foreground">
          Everyone whose engagement named this organization — partnership years, and the people
          who represented it. Logged from a person&rsquo;s record, not here.
        </p>

        {organization.engagements.length > 0 && (
          <ol className="mt-1 max-w-2xl">
            {organization.engagements.map((engagement) => (
              <li
                key={engagement.id}
                className="rule-subtle flex flex-wrap items-start gap-x-4 gap-y-2 py-3"
              >
                <span className="type-meta w-32 shrink-0 pt-1.5 tabular-nums">
                  {yearSpan(engagement.startYear, engagement.endYear)}
                </span>
                <Avatar
                  name={engagement.member.name}
                  src={engagement.member.avatarUrl}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/network/${engagement.member.id}`}
                    className={cn(
                      "type-small font-medium underline-offset-4 hover:text-primary hover:underline",
                      FOCUS,
                    )}
                  >
                    {engagement.member.name}
                  </Link>
                  <p className="type-small mt-0.5 text-muted-foreground">
                    {[engagementHeadline(engagement), engagementContext(engagement)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {engagement.note && (
                    <p className="type-meta mt-0.5">{engagement.note}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </Section>

      <Section label="Danger">
        <div className="mt-3 flex max-w-2xl flex-wrap items-center justify-between gap-3">
          <p className="type-small text-muted-foreground">
            An organization can only be deleted once no engagement names it.
          </p>
          <form
            action={async () => {
              "use server";
              await adminDeleteOrganization(organization.id);
            }}
          >
            <Button type="submit" size="sm" variant="outline">
              Delete organization
            </Button>
          </form>
        </div>
      </Section>
    </PortalLayout>
  );
}
