"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { facilitatorUnlockM4 } from "@/lib/actions";

type TeamData = {
  id: string;
  name: string;
  currentMilestone: number;
  startedAt: string | null;
  finishedAt: string | null;
  solvedMilestones: number[];
};

type Props = {
  teams: TeamData[];
  milestones: { id: number; title: string }[];
};

function formatElapsed(startIso: string): string {
  const diff = Date.now() - new Date(startIso).getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function FacilitatorClient({ teams, milestones }: Props) {
  const router = useRouter();
  const [unlocking, setUnlocking] = useState<string | null>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => router.refresh(), 15000);
    return () => clearInterval(interval);
  }, [router]);

  async function handleUnlock(teamId: string) {
    setUnlocking(teamId);
    await facilitatorUnlockM4(teamId);
    router.refresh();
    setUnlocking(null);
  }

  const sorted = [...teams].sort((a, b) => {
    if (a.finishedAt && !b.finishedAt) return -1;
    if (!a.finishedAt && b.finishedAt) return 1;
    if (a.finishedAt && b.finishedAt)
      return new Date(a.finishedAt).getTime() - new Date(b.finishedAt).getTime();
    return b.solvedMilestones.length - a.solvedMilestones.length;
  });

  const active = teams.filter((t) => t.startedAt && !t.finishedAt).length;
  const finished = teams.filter((t) => t.finishedAt).length;
  const waiting = teams.filter((t) => !t.startedAt).length;

  return (
    <div className="min-h-screen bg-warm-bg text-warm-text">
      <header className="border-b border-warm-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-xl text-warm-heading">
              THEIA — Facilitator Dashboard
            </h1>
            <p className="text-xs text-warm-text-muted">
              Live team progress &middot; auto-refreshes every 15s
            </p>
          </div>
          <button
            onClick={() => router.refresh()}
            className="px-3 py-1.5 text-xs font-medium border border-warm-border rounded-md hover:bg-warm-surface-dark transition-colors"
          >
            Refresh now
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-warm-accent/5 border border-warm-accent/15 text-center">
            <p className="text-2xl font-bold text-warm-accent">{active}</p>
            <p className="text-xs text-warm-text-muted mt-1">Active</p>
          </div>
          <div className="p-4 rounded-lg bg-warm-success/5 border border-warm-success/15 text-center">
            <p className="text-2xl font-bold text-warm-success">{finished}</p>
            <p className="text-xs text-warm-text-muted mt-1">Finished</p>
          </div>
          <div className="p-4 rounded-lg bg-warm-surface border border-warm-border text-center">
            <p className="text-2xl font-bold text-warm-text-muted">{waiting}</p>
            <p className="text-xs text-warm-text-muted mt-1">Not started</p>
          </div>
        </div>

        {/* Milestone legend */}
        <div className="flex gap-4 mb-6 text-[11px] text-warm-text-muted">
          {milestones.map((m) => (
            <span key={m.id} className="flex items-center gap-1.5">
              <span className="font-mono text-warm-text">{m.id}</span>
              {m.title}
            </span>
          ))}
        </div>

        {/* Team cards */}
        <div className="space-y-3">
          {sorted.map((team, rank) => {
            const m4Solved = team.solvedMilestones.includes(4);
            const needsM4Unlock =
              team.currentMilestone === 4 && !m4Solved;

            return (
              <div
                key={team.id}
                className={`p-5 rounded-xl border transition-colors ${
                  team.finishedAt
                    ? "bg-warm-success/5 border-warm-success/15"
                    : needsM4Unlock
                    ? "bg-warm-accent/5 border-warm-accent/15"
                    : "bg-warm-surface border-warm-border"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-warm-text-muted font-mono w-6">
                      #{rank + 1}
                    </span>
                    <h3 className="font-heading text-warm-heading">{team.name}</h3>
                    {team.finishedAt && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-warm-success/15 text-warm-success">
                        Finished
                      </span>
                    )}
                    {needsM4Unlock && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-warm-accent/15 text-warm-accent animate-pulse">
                        Awaiting M4 clearance
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-warm-text-muted font-mono">
                    {!team.startedAt
                      ? "—"
                      : team.finishedAt
                      ? formatElapsed(team.startedAt) + " (final)"
                      : formatElapsed(team.startedAt)}
                  </div>
                </div>

                {/* Milestone progress bar */}
                <div className="flex gap-1.5 mb-1">
                  {milestones.map((m) => {
                    const solved = team.solvedMilestones.includes(m.id);
                    const isActive =
                      team.currentMilestone === m.id && !solved;
                    return (
                      <div
                        key={m.id}
                        className={`flex-1 h-2.5 rounded-full transition-colors ${
                          solved
                            ? "bg-warm-success"
                            : isActive
                            ? "bg-warm-accent animate-pulse"
                            : "bg-warm-surface-dark"
                        }`}
                        title={`M${m.id}: ${m.title} — ${
                          solved ? "Solved" : isActive ? "Active" : "Locked"
                        }`}
                      />
                    );
                  })}
                </div>
                <div className="flex gap-1.5 mb-3">
                  {milestones.map((m) => (
                    <div
                      key={m.id}
                      className="flex-1 text-center text-[10px] text-warm-text-faint"
                    >
                      M{m.id}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-warm-text-muted">
                    {team.solvedMilestones.length}/5 cleared
                    {team.currentMilestone > 0 &&
                      !team.finishedAt &&
                      team.startedAt && (
                        <> &middot; Working on M{team.currentMilestone}</>
                      )}
                  </p>

                  {needsM4Unlock && (
                    <button
                      onClick={() => handleUnlock(team.id)}
                      disabled={unlocking === team.id}
                      className="px-4 py-2 text-xs font-semibold bg-warm-accent text-white rounded-md hover:bg-warm-accent-light transition-colors disabled:opacity-50"
                    >
                      {unlocking === team.id
                        ? "Unlocking..."
                        : "Clear M4 → Unlock M5"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
