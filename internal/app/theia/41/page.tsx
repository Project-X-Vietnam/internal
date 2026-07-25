import { redirect } from "next/navigation";
import { canAccessMilestone, getTeamWithProgress, hasTeamClue } from "@/lib/actions";
import { getUnlockedCaseBriefChapters } from "@/lib/case-brief";
import { MILESTONES, getVisibleSuspects } from "@/lib/game";
import { MilestoneClient } from "@/app/milestone/[id]/milestone-client";

export default async function HiddenDashboardPage() {
  const team = await getTeamWithProgress();
  if (!team) redirect("/");

  const allowed = await canAccessMilestone(3);
  const hasDashboardLink = await hasTeamClue("dashboard_link", "/theia/41");
  if (!allowed || !hasDashboardLink) redirect("/hub");

  const milestone = MILESTONES.find((m) => m.id === 3)!;
  const isSolved = team.progress.some((p) => p.milestone === 3 && p.solvedAt);
  const solvedMilestones = team.progress
    .filter((p) => p.solvedAt)
    .map((p) => p.milestone);
  const clueTokens = team.clueTokens.map((t) => ({
    key: t.key,
    value: t.value,
  }));

  return (
    <MilestoneClient
      milestone={milestone}
      teamName={team.name}
      isSolved={isSolved}
      startedAt={team.startedAt?.toISOString() ?? null}
      clueTokens={clueTokens}
      suspects={getVisibleSuspects(clueTokens)}
      caseBriefChapters={getUnlockedCaseBriefChapters(
        solvedMilestones,
        clueTokens
      )}
    />
  );
}
