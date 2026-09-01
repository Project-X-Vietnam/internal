import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Avatar } from "@/components/platform/avatar";
import { EngagementFields } from "@/components/platform/engagement-fields";
import { PortalLayout } from "@/components/platform/nav";
import { FOCUS, PageHeader, Panel, Section } from "@/components/platform/page";
import { ContactFields } from "@/components/platform/network-forms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { SelectField } from "@/components/platform/select-field";
import { requireAdmin } from "@/lib/auth-guards";
import { MemberStatus, PersonKind } from "@/lib/generated/prisma/enums";
import { listDepartments } from "@/lib/members";
import {
  adminAddConnection,
  adminAddEngagement,
  adminDeleteConnection,
  adminDeleteContact,
  adminDeleteEngagement,
  adminUpdatePerson,
} from "@/lib/network-actions";
import {
  engagementContext,
  engagementHeadline,
  getPersonForAdmin,
  listNetworkForAdmin,
  listOrganizations,
  listPrograms,
  yearSpan,
} from "@/lib/network";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Manage person" };

type Params = { params: Promise<{ id: string }> };

const LABEL = "block text-sm font-medium";
const HINT = "type-meta mt-1.5";

export default async function AdminPersonPage({ params }: Params) {
  const admin = await requireAdmin();
  const { id } = await params;

  const [person, programs, departments, organizations, everyone] = await Promise.all([
    getPersonForAdmin(id),
    listPrograms(),
    listDepartments(),
    listOrganizations(),
    listNetworkForAdmin(),
  ]);
  if (!person) notFound();

  const isContact = person.kind === PersonKind.CONTACT;
  const hasProfile = isContact || person.status === MemberStatus.APPROVED;
  const others = everyone.filter((entry) => entry.id !== person.id);

  // One list regardless of which side of the pair this person is stored on.
  const connections = [
    ...person.connectionsA.map((row) => ({ ...row, other: row.b })),
    ...person.connectionsB.map((row) => ({ ...row, other: row.a })),
  ];

  return (
    <PortalLayout member={admin} active="/admin/network">
      <PageHeader
        back={{ href: "/admin/network", label: "Network" }}
        eyebrow="Admin"
        title={person.name}
      >
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
          <Avatar name={person.name} src={person.avatarUrl} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{isContact ? "contact" : "member account"}</Badge>
              {person.email && (
                <span className="type-small text-muted-foreground">{person.email}</span>
              )}
            </div>
          </div>
          {hasProfile && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/directory/${person.id}`}>View profile</Link>
            </Button>
          )}
        </div>
      </PageHeader>

      <Section label="Details">
        {isContact ? (
          <form
            action={async (formData: FormData) => {
              "use server";
              await adminUpdatePerson(person.id, formData);
            }}
            className="mt-3"
          >
            <ContactFields
              idPrefix="edit-contact"
              defaults={{
                name: person.name,
                email: person.email,
                title: person.title,
                location: person.location,
                expertise: person.expertise.map((tag) => tag.label).join(", "),
                note: person.note,
              }}
            />
            <div className="mt-4">
              <Button type="submit" variant="outline">
                Save details
              </Button>
            </div>
          </form>
        ) : (
          <form
            action={async (formData: FormData) => {
              "use server";
              await adminUpdatePerson(person.id, formData);
            }}
            className="mt-3 max-w-2xl"
          >
            <p className="type-small text-muted-foreground">
              Accounts own their identity — name and photo come from Google, everything else from
              their profile. The one thing written here is the note.
            </p>
            <div className="mt-4">
              <label className={LABEL} htmlFor="account-note">
                Note
              </label>
              <Textarea
                id="account-note"
                name="note"
                rows={2}
                defaultValue={person.note ?? ""}
                placeholder="Context on the person — write it as if they might read it."
                className="mt-1.5"
                aria-describedby="account-note-hint"
              />
              <p id="account-note-hint" className={HINT}>
                Admins only — members never see this.
              </p>
            </div>
            <div className="mt-4">
              <Button type="submit" variant="outline">
                Save note
              </Button>
            </div>
          </form>
        )}
      </Section>

      <Section
        label="Engagements"
        meta={person.engagements.length > 0 ? String(person.engagements.length) : "none"}
      >
        {person.engagements.length > 0 && (
          <ol className="mt-1 max-w-2xl">
            {person.engagements.map((engagement) => (
              <li
                key={engagement.id}
                className="rule-subtle flex flex-wrap items-start gap-x-6 gap-y-1 py-3"
              >
                <span className="type-meta w-32 shrink-0 pt-0.5 tabular-nums">
                  {yearSpan(engagement.startYear, engagement.endYear)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="type-small font-medium">{engagementHeadline(engagement)}</p>
                  {engagementContext(engagement) && (
                    <p className="type-small mt-0.5 text-muted-foreground">
                      {engagementContext(engagement)}
                    </p>
                  )}
                  {engagement.note && (
                    <p className="type-small mt-1 text-muted-foreground">{engagement.note}</p>
                  )}
                  {engagement.createdBy && (
                    <p className="type-meta mt-1">Logged by {engagement.createdBy.name}</p>
                  )}
                </div>
                <form
                  action={async () => {
                    "use server";
                    await adminDeleteEngagement(engagement.id);
                  }}
                >
                  <Button type="submit" size="sm" variant="ghost">
                    Remove
                  </Button>
                </form>
              </li>
            ))}
          </ol>
        )}

        <Panel className="mt-5 max-w-2xl">
          <p className="type-label">Log an engagement</p>
          <form
            action={async (formData: FormData) => {
              "use server";
              await adminAddEngagement(person.id, formData);
            }}
            className="mt-4"
          >
            <EngagementFields
              idPrefix="admin-engagement"
              programs={programs}
              departments={departments}
              organizationNames={organizations.map((organization) => organization.name)}
              withNote
            />
            <div className="mt-4">
              <Button type="submit" variant="outline">
                Log engagement
              </Button>
            </div>
          </form>
        </Panel>
      </Section>

      <Section
        label="Connections"
        meta={connections.length > 0 ? String(connections.length) : "none"}
      >
        <p className="type-small mt-3 max-w-2xl text-muted-foreground">
          Explicit only: connect two people because they actually know each other, never because
          they shared a program year.
        </p>

        {connections.length > 0 && (
          <ul className="mt-1 max-w-2xl">
            {connections.map((connection) => (
              <li
                key={connection.id}
                className="rule-subtle flex flex-wrap items-center gap-x-4 gap-y-2 py-3"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/network/${connection.other.id}`}
                    className={cn(
                      "type-small font-medium underline-offset-4 hover:text-primary hover:underline",
                      FOCUS,
                    )}
                  >
                    {connection.other.name}
                  </Link>
                  <p className="type-small mt-0.5 text-muted-foreground">{connection.label}</p>
                  {connection.note && (
                    <p className="type-meta mt-0.5">{connection.note}</p>
                  )}
                </div>
                <form
                  action={async () => {
                    "use server";
                    await adminDeleteConnection(connection.id);
                  }}
                >
                  <Button type="submit" size="sm" variant="ghost">
                    Remove
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        )}

        <Panel className="mt-5 max-w-2xl">
          <p className="type-label">Connect with someone</p>
          <form action={adminAddConnection} className="mt-4">
            <input type="hidden" name="personId" value={person.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={LABEL} htmlFor="connection-other">
                  Person
                </label>
                <div className="mt-1.5">
                  <SelectField
                    id="connection-other"
                    name="otherId"
                    defaultValue=""
                    placeholder="Pick someone"
                    options={others.map((entry) => ({ value: entry.id, label: entry.name }))}
                  />
                </div>
              </div>
              <div>
                <label className={LABEL} htmlFor="connection-label">
                  How they&rsquo;re connected
                </label>
                <Input
                  id="connection-label"
                  name="label"
                  required
                  placeholder="Introduced them to PJX"
                  className="mt-1.5"
                  aria-describedby="connection-label-hint"
                />
                <p id="connection-label-hint" className={HINT}>
                  Members see this line.
                </p>
              </div>
              <div className="sm:col-span-2">
                <label className={LABEL} htmlFor="connection-note">
                  Note
                </label>
                <Textarea
                  id="connection-note"
                  name="note"
                  rows={2}
                  placeholder="Anything worth knowing about the relationship."
                  className="mt-1.5"
                  aria-describedby="connection-note-hint"
                />
                <p id="connection-note-hint" className={HINT}>
                  Admins only — members never see this.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Button type="submit" variant="outline">
                Connect
              </Button>
            </div>
          </form>
        </Panel>
      </Section>

      {isContact && (
        <Section label="Danger">
          <div className="mt-3 flex max-w-2xl flex-wrap items-center justify-between gap-3">
            <p className="type-small text-muted-foreground">
              Deleting a contact erases their engagements and connections with them — the network
              forgets they were ever here.
            </p>
            <form
              action={async () => {
                "use server";
                await adminDeleteContact(person.id);
              }}
            >
              <Button type="submit" size="sm" variant="outline">
                Delete contact
              </Button>
            </form>
          </div>
        </Section>
      )}
    </PortalLayout>
  );
}
