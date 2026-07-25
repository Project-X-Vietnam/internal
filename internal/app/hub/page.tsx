import { redirect } from "next/navigation";
import { getTeamWithProgress } from "@/lib/actions";
import { getUnlockedCaseBriefChapters } from "@/lib/case-brief";
import { MILESTONES, getMilestoneStatus, getVisibleSuspects } from "@/lib/game";
import { HubClient } from "./hub-client";

export default async function HubPage() {
  const team = await getTeamWithProgress();
  if (!team) redirect("/");

  const solvedMilestones = team.progress
    .filter((p) => p.solvedAt)
    .map((p) => p.milestone);

  const milestoneData = MILESTONES.map((m) => ({
    ...m,
    status: getMilestoneStatus(m.id, team.currentMilestone, solvedMilestones),
  }));

  const clueTokens = team.clueTokens.map((t) => ({
    key: t.key,
    value: t.value,
  }));

  return (
    <HubClient
      teamName={team.name}
      milestones={milestoneData}
      suspects={getVisibleSuspects(clueTokens)}
      clueTokens={clueTokens}
      caseBriefChapters={getUnlockedCaseBriefChapters(
        solvedMilestones,
        clueTokens
      )}
      startedAt={team.startedAt?.toISOString() ?? null}
    />
  );
}
