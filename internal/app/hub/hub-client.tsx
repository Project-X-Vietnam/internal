"use client";

import { useState } from "react";
import Link from "next/link";
import type { CaseBriefChapter } from "@/lib/case-brief";
import type { MilestoneStatus, Suspect } from "@/lib/game";
import { ClueDrawer } from "@/components/game/clue-drawer";
import { ElapsedTimer } from "@/components/game/elapsed-timer";

type MilestoneData = {
  id: number;
  title: string;
  discipline: string;
  question: string;
  belief: string;
  icon: string;
  status: MilestoneStatus;
};

type Props = {
  teamName: string;
  milestones: MilestoneData[];
  suspects: Suspect[];
  clueTokens: { key: string; value: string }[];
  caseBriefChapters: CaseBriefChapter[];
  startedAt: string | null;
};

const STATUS_STYLES: Record<MilestoneStatus, string> = {
  active:
    "bg-warm-surface border-warm-accent/30 hover:border-warm-accent/60 cursor-pointer shadow-sm hover:shadow-md",
  solved:
    "bg-warm-success/5 border-warm-success/30 cursor-pointer shadow-sm",
  locked:
    "bg-warm-surface-dark/50 border-warm-border cursor-not-allowed opacity-60",
};

const STATUS_BADGES: Record<MilestoneStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-warm-accent/15 text-warm-accent" },
  solved: { label: "Solved", className: "bg-warm-success/15 text-warm-success" },
  locked: { label: "Locked", className: "bg-warm-border/50 text-warm-text-faint" },
};

export function HubClient({
  teamName,
  milestones,
  suspects,
  clueTokens,
  caseBriefChapters,
  startedAt,
}: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);

  function openSuspect(id: string) {
    setSelectedSuspectId(id);
    setDrawerOpen(true);
  }

  return (
    <div className="min-h-screen bg-warm-bg text-warm-text">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-warm-bg/80 backdrop-blur-md border-b border-warm-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-heading text-xl text-warm-heading">THEIA</h1>
            <span className="text-xs text-warm-text-muted font-heading">Case board</span>
          </div>
          <div className="flex items-center gap-4">
            {startedAt && (
              <ElapsedTimer startedAt={startedAt} />
            )}
            <span className="text-sm text-warm-text-muted">{teamName}</span>
            <button
              onClick={() => setDrawerOpen(true)}
              className="px-3 py-1.5 text-xs font-medium border border-warm-border rounded-md hover:bg-warm-surface-dark transition-colors text-warm-text-muted hover:text-warm-text"
            >
              Case Brief
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Suspect strip */}
        <div className="mb-10">
          <p className="font-heading text-xs text-warm-text-muted uppercase tracking-wider mb-3">
            Persons of interest
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {suspects.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => openSuspect(s.id)}
                className="flex flex-col items-center gap-1.5 min-w-[56px]"
              >
                <div className="w-10 h-10 rounded-full bg-warm-surface-dark border border-warm-border flex items-center justify-center text-sm font-medium text-warm-text-muted">
                  {s.initial}
                </div>
                <span className="text-[11px] text-warm-text-muted whitespace-nowrap">
                  {s.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Milestone cards */}
        <div className="space-y-4">
          <p className="font-heading text-xs text-warm-text-muted uppercase tracking-wider mb-2">
            Investigation milestones
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {milestones.map((m) => {
              const badge = STATUS_BADGES[m.status];
              const content = (
                <div
                  className={`relative p-5 rounded-xl border transition-all ${STATUS_STYLES[m.status]}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-heading text-base text-warm-heading">
                        M{m.id} — {m.title}
                      </h3>
                      <p className="text-xs text-warm-text-muted mt-0.5">
                        {m.discipline}
                      </p>
                    </div>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-sm text-warm-text-muted italic">
                    &ldquo;{m.question}&rdquo;
                  </p>
                  {m.status === "solved" && (
                    <p className="text-xs text-warm-success mt-2">
                      {m.belief}
                    </p>
                  )}
                </div>
              );

              if (m.status === "locked") {
                return <div key={m.id}>{content}</div>;
              }

              return (
                <Link key={m.id} href={`/milestone/${m.id}`}>
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <ClueDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        clueTokens={clueTokens}
        suspects={suspects}
        caseBriefChapters={caseBriefChapters}
        selectedSuspectId={selectedSuspectId}
        onSelectSuspect={setSelectedSuspectId}
      />
    </div>
  );
}
