import { getAllTeamsProgress, isFacilitatorAuthed, loginFacilitator } from "@/lib/actions";
import { MILESTONES } from "@/lib/game";
import { FacilitatorClient } from "./facilitator-client";

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function FacilitatorPage({ searchParams }: Props) {
  const authed = await isFacilitatorAuthed();
  const params = searchParams ? await searchParams : {};

  if (!authed) {
    return (
      <div className="min-h-screen bg-warm-bg text-warm-text flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <p className="font-heading text-xs text-warm-text-muted uppercase tracking-wider mb-3">
            Facilitator access
          </p>
          <h1 className="font-heading text-2xl text-warm-heading mb-2">
            Unlock station
          </h1>
          <p className="text-sm text-warm-text-muted mb-6">
            Enter the shared event PIN to view team progress and clear M4.
          </p>
          <form action={loginFacilitator} className="space-y-3">
            <input
              name="pin"
              type="password"
              autoComplete="off"
              className="w-full px-4 py-3 bg-warm-input border border-warm-border rounded-lg text-warm-text placeholder:text-warm-text-faint focus:outline-none focus:border-warm-accent/50 focus:ring-1 focus:ring-warm-accent/20"
              placeholder="Facilitator PIN"
              required
            />
            {params.error && (
              <p className="text-sm text-warm-error">
                {params.error === "missing-config"
                  ? "FACILITATOR_PIN is not configured."
                  : "Invalid facilitator PIN."}
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-warm-btn text-warm-bg font-semibold rounded-lg hover:bg-warm-btn-hover transition-colors"
            >
              Enter dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const teams = await getAllTeamsProgress();

  const teamsData = teams.map((team) => ({
    id: team.id,
    name: team.name,
    currentMilestone: team.currentMilestone,
    startedAt: team.startedAt?.toISOString() ?? null,
    finishedAt: team.finishedAt?.toISOString() ?? null,
    solvedMilestones: team.progress
      .filter((p) => p.solvedAt)
      .map((p) => p.milestone),
  }));

  return <FacilitatorClient teams={teamsData} milestones={[...MILESTONES]} />;
}
