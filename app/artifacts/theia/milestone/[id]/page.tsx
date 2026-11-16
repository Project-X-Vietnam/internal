import { redirect, notFound } from "next/navigation";
import { getTeamWithProgress, canAccessMilestone, hasTeamClue } from "@/lib/actions";
import { getUnlockedCaseBriefChapters } from "@/lib/case-brief";
import { MILESTONES, getVisibleSuspects } from "@/lib/game";
import { MilestoneClient } from "./milestone-client";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function MilestonePage({ params }: Props) {
  const { id } = await params;
  const milestoneId = parseInt(id, 10);

  if (isNaN(milestoneId) || milestoneId < 1 || milestoneId > 5) {
    notFound();
  }

  const team = await getTeamWithProgress();
  if (!team) redirect("/artifacts/theia");

  const allowed = await canAccessMilestone(milestoneId);
  if (!allowed) redirect("/artifacts/theia/hub");

  if (milestoneId === 3) {
    const hasDashboardLink = await hasTeamClue("dashboard_link", "/theia/41");
    if (hasDashboardLink) redirect("/theia/41");
    redirect("/artifacts/theia/hub");
  }

  const milestone = MILESTONES.find((m) => m.id === milestoneId)!;
  const isSolved = team.progress.some(
    (p) => p.milestone === milestoneId && p.solvedAt
  );
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
