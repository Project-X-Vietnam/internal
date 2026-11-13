import type { Metadata } from "next";
import Link from "next/link";

import { Avatar } from "@/components/platform/avatar";
import { EngagementFields } from "@/components/platform/engagement-fields";
import { LootboxFields } from "@/components/platform/lootbox-fields";
import { PortalLayout } from "@/components/platform/nav";
import { PageHeader, Panel, Section } from "@/components/platform/page";
import { SelectField } from "@/components/platform/select-field";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { requireApprovedMember } from "@/lib/auth-guards";
import { LOOTBOX_ENABLED, parseLootbox } from "@/lib/lootbox";
import { updateOwnProfile } from "@/lib/member-actions";
import { listDepartments } from "@/lib/members";
import {
  addOwnEngagement,
  deleteOwnEngagement,
} from "@/lib/network-actions";
import {
  engagementContext,
  engagementHeadline,
  listEngagementsFor,
  listOrganizations,
  listPrograms,
  yearSpan,
} from "@/lib/network";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Your profile" };

type Links = { linkedin?: string | null; lark?: string | null; portfolio?: string | null };

const LABEL = "block text-sm font-medium";
const HINT = "type-meta mt-1.5";

export default async function MyProfilePage() {
  const member = await requireApprovedMember();
  const [departments, engagements, programs, organizations] = await Promise.all([
    listDepartments(),
    listEngagementsFor(member.id),
    listPrograms(),
    listOrganizations(),
  ]);
  const links = (member.links ?? {}) as Links;
  const lootbox = parseLootbox(member.lootbox);

  return (
    <PortalLayout member={member}>
      <PageHeader eyebrow="Your profile" title={member.name}>
        <div className="mt-6 flex items-center gap-4">
          <Avatar name={member.name} src={member.avatarUrl} size="lg" />
          <div>
            <p className="type-small text-muted-foreground">{member.email}</p>
            <p className={HINT}>Name, photo and email come from your Google account.</p>
          </div>
        </div>
      </PageHeader>

      {/* The form spans the page column so its section rules are the same length
          as every other page's; only the fields themselves are held to a
          comfortable measure. */}
      <form action={updateOwnProfile}>
        <Section label="Role">
          <div className="mt-3 grid max-w-2xl gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL} htmlFor="title">
                Title
              </label>
              <Input
                id="title"
                name="title"
                defaultValue={member.title ?? ""}
                placeholder="Program Lead"
                className="mt-1.5"
              />
            </div>
            <div>
              <label className={LABEL} htmlFor="departmentId">
                Department
              </label>
              <div className="mt-1.5">
                <SelectField
                  id="departmentId"
                  name="departmentId"
                  defaultValue={member.departmentId ?? ""}
                  placeholder="—"
                  options={departments.map((department) => ({
                    value: department.id,
                    label: department.name,
                  }))}
                />
              </div>
            </div>
            <div>
              <label className={LABEL} htmlFor="cohort">
                Cohort
              </label>
              <Input
                id="cohort"
                name="cohort"
                defaultValue={member.cohort ?? ""}
                placeholder="2026 Fellows"
                className="mt-1.5"
              />
            </div>
            <div>
              <label className={LABEL} htmlFor="location">
                Location
              </label>
              <Input
                id="location"
                name="location"
                defaultValue={member.location ?? ""}
                placeholder="Ho Chi Minh City"
                className="mt-1.5"
              />
            </div>
            <div>
              <label className={LABEL} htmlFor="timezone">
                Timezone
              </label>
              <Input
                id="timezone"
                name="timezone"
                defaultValue={member.timezone ?? ""}
                placeholder="Asia/Ho_Chi_Minh"
                className="mt-1.5"
              />
            </div>
          </div>
        </Section>

        <Section label="About you">
          <div className="mt-3 max-w-2xl space-y-4">
            <div>
              <label className={LABEL} htmlFor="expertise">
                Ask me about
              </label>
              <Input
                id="expertise"
                name="expertise"
                defaultValue={member.expertise.map((tag) => tag.label).join(", ")}
                placeholder="Curriculum design, Partnerships, Figma"
                className="mt-1.5"
                aria-describedby="expertise-hint"
              />
              <p id="expertise-hint" className={HINT}>
                Comma-separated, up to 12. These are what teammates search by.
              </p>
            </div>

            <div>
              <label className={LABEL} htmlFor="bio">
                Bio
              </label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={member.bio ?? ""}
                rows={4}
                placeholder="A couple of sentences about what you do here."
                className="mt-1.5"
              />
            </div>
          </div>
        </Section>

        <Section label="Links">
          <div className="mt-3 grid max-w-2xl gap-4 sm:grid-cols-3">
            <div>
              <label className={LABEL} htmlFor="linkedin">
                LinkedIn
              </label>
              <Input
                id="linkedin"
                name="linkedin"
                defaultValue={links.linkedin ?? ""}
                placeholder="linkedin.com/in/…"
                className="mt-1.5"
              />
            </div>
            <div>
              <label className={LABEL} htmlFor="lark">
                Lark handle
              </label>
              <Input id="lark" name="lark" defaultValue={links.lark ?? ""} className="mt-1.5" />
            </div>
            <div>
              <label className={LABEL} htmlFor="portfolio">
                Portfolio
              </label>
              <Input
                id="portfolio"
                name="portfolio"
                defaultValue={links.portfolio ?? ""}
                className="mt-1.5"
              />
            </div>
          </div>
        </Section>

        {LOOTBOX_ENABLED && (
          <Section label="Lootbox">
            <p className="type-small mt-3 max-w-2xl text-muted-foreground">
              Six things that are actually yours — a game, a drink, a pet, a bad habit. This is
              the only part of your profile that isn&rsquo;t about work, so don&rsquo;t make it
              about work.
            </p>

            <LootboxFields items={lootbox} />

            <p className={cn(HINT, "max-w-2xl")}>
              Images need to be a public https:// link — a transparent PNG floats best. Clear both
              fields to drop an item.
            </p>
          </Section>
        )}

        <div className="rule mt-14 flex items-center gap-3 pt-6">
          <Button type="submit">Save profile</Button>
          <Button asChild variant="ghost">
            <Link href={`/directory/${member.id}`}>View public profile</Link>
          </Button>
        </div>
      </form>

      {/* Outside the profile form — these rows are their own records with their
          own actions, and a form inside a form isn't HTML. The Role section
          above is *now*; this is every year before it. */}
      <Section label="Role history" meta={engagements.length > 0 ? String(engagements.length) : undefined}>
        <p className="type-small mt-3 max-w-2xl text-muted-foreground">
          Where you&rsquo;ve been across PJX — cohorts, programs, roles. This is what makes you
          findable in the network years after you hand over.
        </p>

        {engagements.length > 0 && (
          <ol className="mt-4 max-w-2xl">
            {engagements.map((engagement) => (
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
                </div>
                <form
                  action={async () => {
                    "use server";
                    await deleteOwnEngagement(engagement.id);
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
          <p className="type-label">Add an engagement</p>
          <form action={addOwnEngagement} className="mt-4">
            <EngagementFields
              idPrefix="own-engagement"
              programs={programs}
              departments={departments}
              organizationNames={organizations.map((organization) => organization.name)}
            />
            <div className="mt-4">
              <Button type="submit" variant="outline">
                Add to history
              </Button>
            </div>
          </form>
        </Panel>
      </Section>
    </PortalLayout>
  );
}
