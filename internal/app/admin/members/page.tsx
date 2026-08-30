import type { Metadata } from "next";

import { Avatar } from "@/components/platform/avatar";
import { PortalLayout } from "@/components/platform/nav";
import { PageHeader, Panel, RuleList, Section } from "@/components/platform/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth-guards";
import { MemberRole, MemberStatus } from "@/lib/generated/prisma/enums";
import {
  approveMember,
  rejectMember,
  setMemberRole,
  suspendMember,
} from "@/lib/member-actions";
import { listMembersForAdmin } from "@/lib/members";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Members" };

const STATUS_VARIANT = {
  [MemberStatus.PENDING]: "warning",
  [MemberStatus.APPROVED]: "success",
  [MemberStatus.REJECTED]: "destructive",
  [MemberStatus.SUSPENDED]: "destructive",
} as const;

const ROW = "-mx-3 flex flex-wrap items-center gap-x-4 gap-y-3 px-3 py-4 sm:-mx-4 sm:px-4";

export default async function AdminMembersPage() {
  const admin = await requireAdmin();
  const members = await listMembersForAdmin();

  const pending = members.filter((entry) => entry.status === MemberStatus.PENDING);
  const rest = members.filter((entry) => entry.status !== MemberStatus.PENDING);

  return (
    <PortalLayout member={admin} active="/admin/members">
      <PageHeader
        eyebrow="Admin"
        title="Members"
        description="Approving someone here is what makes them a member — sign-in alone grants nothing."
      />

      <Section label="Awaiting approval" meta={pending.length > 0 ? String(pending.length) : "none"}>
        {pending.length === 0 ? (
          <Panel dashed className="mt-3 text-center">
            <p className="type-small text-muted-foreground">Nothing waiting.</p>
          </Panel>
        ) : (
          <RuleList className="mt-1">
            {pending.map((entry) => (
              <li key={entry.id} className={ROW}>
                <Avatar name={entry.name} src={entry.avatarUrl} />
                <div className="min-w-0 flex-1">
                  <p className="type-small truncate font-medium">{entry.name}</p>
                  <p className="type-small truncate text-muted-foreground">{entry.email}</p>
                  <p className="type-meta mt-0.5">Requested {formatDate(entry.requestedAt)}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <form
                    action={async () => {
                      "use server";
                      await approveMember(entry.id);
                    }}
                  >
                    <Button type="submit" size="sm">
                      Approve
                    </Button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await rejectMember(entry.id);
                    }}
                  >
                    <Button type="submit" size="sm" variant="outline">
                      Decline
                    </Button>
                  </form>
                </div>
              </li>
            ))}
          </RuleList>
        )}
      </Section>

      <Section label="Everyone else" meta={String(rest.length)}>
        {rest.length === 0 ? (
          <Panel dashed className="mt-3 text-center">
            <p className="type-small text-muted-foreground">No other accounts yet.</p>
          </Panel>
        ) : (
          <RuleList className="mt-1">
            {rest.map((entry) => {
              const isSelf = entry.id === admin.id;
              return (
                <li key={entry.id} className={ROW}>
                  <Avatar name={entry.name} src={entry.avatarUrl} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="type-small truncate font-medium">
                      {entry.name}
                      {isSelf && <span className="text-muted-foreground"> (you)</span>}
                    </p>
                    <p className="type-small truncate text-muted-foreground">{entry.email}</p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <Badge variant={STATUS_VARIANT[entry.status]}>
                      {entry.status.toLowerCase()}
                    </Badge>
                    {entry.role === MemberRole.ADMIN && <Badge>admin</Badge>}
                  </div>

                  {/* The action slot is always rendered, and always the same
                      width, so the status chips line up down the column even on
                      your own row — where the controls are hidden. Hiding them
                      is convenience only; the actions refuse self-targeting
                      server-side too. */}
                  <div className="flex shrink-0 justify-end gap-1 sm:w-52">
                    {!isSelf && (
                      <>
                        {entry.status === MemberStatus.APPROVED ? (
                          <form
                            action={async () => {
                              "use server";
                              await suspendMember(entry.id);
                            }}
                          >
                            <Button type="submit" size="sm" variant="ghost">
                              Suspend
                            </Button>
                          </form>
                        ) : (
                          <form
                            action={async () => {
                              "use server";
                              await approveMember(entry.id);
                            }}
                          >
                            <Button type="submit" size="sm" variant="ghost">
                              Restore
                            </Button>
                          </form>
                        )}

                        <form
                          action={async () => {
                            "use server";
                            await setMemberRole(
                              entry.id,
                              entry.role === MemberRole.ADMIN
                                ? MemberRole.MEMBER
                                : MemberRole.ADMIN,
                            );
                          }}
                        >
                          <Button type="submit" size="sm" variant="ghost">
                            {entry.role === MemberRole.ADMIN ? "Remove admin" : "Make admin"}
                          </Button>
                        </form>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </RuleList>
        )}
      </Section>
    </PortalLayout>
  );
}
