"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, FileText } from "lucide-react";
import type { CaseBriefChapter } from "@/lib/case-brief";
import type { Suspect } from "@/lib/game";
import { PROLOGUE_LINES } from "@/lib/prologue";
import { submitAnswer } from "@/lib/actions";
import { ClueDrawer } from "@/components/game/clue-drawer";
import { ElapsedTimer } from "@/components/game/elapsed-timer";
import { Typewriter } from "@/components/ui/typewriter-text";
import { M1Puzzle, buildM1CopyContext } from "@/components/puzzles/m1-puzzle";
import { M2Puzzle, buildM2CopyContext } from "@/components/puzzles/m2-puzzle";
import { M3Puzzle, buildM3CopyContext } from "@/components/puzzles/m3-puzzle";
import { M4Puzzle, buildM4CopyContext } from "@/components/puzzles/m4-puzzle";
import { M5Puzzle, buildM5CopyContext } from "@/components/puzzles/m5-puzzle";

type MilestoneInfo = {
  id: number;
  title: string;
  discipline: string;
  question: string;
  belief: string;
};

type Props = {
  milestone: MilestoneInfo;
  teamName: string;
  isSolved: boolean;
  startedAt: string | null;
  clueTokens: { key: string; value: string }[];
  suspects: Suspect[];
  caseBriefChapters: CaseBriefChapter[];
};

type CopyStatus = "idle" | "copied" | "error";

const PUZZLE_CONTEXT_BUILDERS: Record<number, () => string> = {
  1: buildM1CopyContext,
  2: buildM2CopyContext,
  3: buildM3CopyContext,
  4: buildM4CopyContext,
  5: buildM5CopyContext,
};

const HIDDEN_CONTEXT_CLUE_KEYS = new Set([
  "m1_suspect_board_mode",
  "m3_reveal_seen",
]);

function humanizeKey(key: string) {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatSuspectForContext(suspect: Suspect) {
  return [
    `${suspect.fullName} (${suspect.name})`,
    `Role: ${suspect.role}`,
    `Email: ${suspect.email}`,
    `Phone: ${suspect.phone}`,
    `SIM: ${suspect.simId}`,
    `Badge: ${suspect.badgeId}`,
    `Office: ${suspect.office}`,
    `District: ${suspect.district}`,
    `Profile: ${suspect.profile}`,
    `Provider preferences: ${suspect.providerPreferences.join("; ")}`,
    `Backstory: ${suspect.backstory}`,
  ].join("\n");
}

function buildMilestoneCopyContext({
  milestone,
  teamName,
  clueTokens,
  suspects,
  caseBriefChapters,
}: {
  milestone: MilestoneInfo;
  teamName: string;
  clueTokens: { key: string; value: string }[];
  suspects: Suspect[];
  caseBriefChapters: CaseBriefChapter[];
}) {
  const puzzleContext =
    PUZZLE_CONTEXT_BUILDERS[milestone.id]?.() ??
    `Milestone ${milestone.id} workspace context is not documented yet.`;
  const visibleClueTokens = clueTokens.filter(
    (token) => !HIDDEN_CONTEXT_CLUE_KEYS.has(token.key)
  );

  return [
    "THEIA investigation context",
    "Player-facing context copied from the current milestone.",
    "",
    `Team: ${teamName}`,
    `Milestone: M${milestone.id}, ${milestone.title}`,
    `Discipline: ${milestone.discipline}`,
    `Investigation question: ${milestone.question}`,
    "",
    "Opening briefing:",
    ...PROLOGUE_LINES.map((line) => `- ${line}`),
    "",
    "Unlocked narrative log:",
    caseBriefChapters.length
      ? caseBriefChapters
          .map((chapter) =>
            [
              `${chapter.title}`,
              ...chapter.summary.map((line) => `- ${line}`),
              `Takeaway: ${chapter.takeaway}`,
            ].join("\n")
          )
          .join("\n\n")
      : "No milestone narratives unlocked yet.",
    "",
    "Collected clue tokens:",
    visibleClueTokens.length
      ? visibleClueTokens
          .map((token) => `- ${humanizeKey(token.key)}: ${token.value}`)
          .join("\n")
      : "No clue tokens collected yet.",
    "",
    "Visible suspect dossiers:",
    suspects.map(formatSuspectForContext).join("\n\n"),
    "",
    "Current milestone workspace and documentation:",
    puzzleContext,
  ].join("\n");
}

async function copyTextToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const copied = document.execCommand("copy");
    if (!copied) throw new Error("Copy command failed");
  } finally {
    document.body.removeChild(textarea);
  }
}

export function MilestoneClient({
  milestone,
  teamName,
  isSolved,
  startedAt,
  clueTokens,
  suspects,
  caseBriefChapters,
}: Props) {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [solved, setSolved] = useState(isSolved);
  const [submitting, setSubmitting] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);
  const [briefChapters, setBriefChapters] = useState(caseBriefChapters);
  const [narrativeDone, setNarrativeDone] = useState(isSolved);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim() || submitting) return;
    await doSubmit(answer.trim());
  }

  async function doSubmit(payload: string) {
    setSubmitting(true);
    setFeedback(null);

    const result = await submitAnswer(milestone.id, payload);

    if (result.correct) {
      setSolved(true);
      setNarrativeDone(false);
      if ("caseBriefChapters" in result && result.caseBriefChapters) {
        setBriefChapters(result.caseBriefChapters);
      }
      setFeedback(null);
    } else {
      setFeedback(result.message ?? "Incorrect. Try again.");
    }
    setSubmitting(false);
  }

  async function handleCopyContext() {
    try {
      const contextText = buildMilestoneCopyContext({
        milestone,
        teamName,
        clueTokens,
        suspects,
        caseBriefChapters: briefChapters,
      });
      await copyTextToClipboard(contextText);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }

    window.setTimeout(() => setCopyStatus("idle"), 1800);
  }

  function renderPuzzle() {
    switch (milestone.id) {
      case 1:
        return <M1Puzzle onSolve={doSubmit} />;
      case 2:
        return <M2Puzzle onSolve={doSubmit} teamName={teamName} />;
      case 3:
        return <M3Puzzle onSolve={doSubmit} />;
      case 4:
        return <M4Puzzle />;
      case 5:
        return <M5Puzzle onSolve={doSubmit} />;
      default:
        return (
          <>
            <div className="mb-8 p-12 rounded-xl border border-dashed border-warm-border text-center">
              <p className="text-warm-text-muted text-sm">
                Milestone {milestone.id} puzzle workspace
              </p>
              <p className="text-warm-text-faint text-xs mt-1">
                (Puzzle component will be built here)
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="answer"
                  className="block text-xs font-medium text-warm-text-muted mb-1.5 uppercase tracking-wider"
                >
                  Submit your answer
                </label>
                <input
                  id="answer"
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-4 py-3 bg-warm-input border border-warm-border rounded-lg text-warm-text placeholder:text-warm-text-faint focus:outline-none focus:border-warm-accent/50 focus:ring-1 focus:ring-warm-accent/20 transition-colors"
                  placeholder="Enter your answer..."
                />
              </div>
              {feedback && (
                <p className="text-sm text-warm-error">{feedback}</p>
              )}
              <button
                type="submit"
                disabled={submitting || !answer.trim()}
                className="px-6 py-3 bg-warm-btn text-warm-bg font-semibold rounded-lg hover:bg-warm-btn-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Checking..." : "Submit"}
              </button>
            </form>
          </>
        );
    }
  }

  const currentChapter =
    briefChapters.find((chapter) => chapter.milestone === milestone.id) ?? null;
  const narrativeText = currentChapter
    ? [...currentChapter.summary, currentChapter.takeaway].join("\n\n")
    : milestone.belief;
  const shouldUseDiscoveredM3Route = milestone.id === 2;

  return (
    <div className="min-h-screen bg-warm-bg text-warm-text">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-warm-bg/80 backdrop-blur-md border-b border-warm-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/hub"
              className="text-warm-text-muted hover:text-warm-text transition-colors text-sm shrink-0"
            >
              &larr; Hub
            </Link>
            <span className="text-warm-border shrink-0">|</span>
            <h1 className="font-heading text-sm text-warm-heading truncate">
              M{milestone.id} — {milestone.title}
            </h1>
            <span className="hidden sm:inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full bg-warm-surface-dark text-warm-text-muted shrink-0">
              {milestone.discipline}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {startedAt && <ElapsedTimer startedAt={startedAt} />}
            <span className="hidden sm:inline text-sm text-warm-text-muted">
              {teamName}
            </span>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-warm-border bg-warm-surface px-3 text-xs font-medium text-warm-text-muted transition-colors hover:bg-warm-surface-dark hover:text-warm-text focus:outline-none focus:ring-2 focus:ring-warm-accent/25"
              aria-label="Open case brief"
              title="Open case brief"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span>Case Brief</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-24 pt-6 sm:px-6">
        {/* Narrative intro */}
        <div className="mb-5 grid gap-3 rounded-lg bg-warm-surface border border-warm-border px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="min-w-0">
            <p className="font-heading text-[11px] text-warm-text-muted uppercase tracking-wider mb-1">
              Investigation question
            </p>
            <p className="text-base md:text-lg font-heading text-warm-heading italic truncate">
              &ldquo;{milestone.question}&rdquo;
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:justify-end">
            <div className="text-left md:text-right">
              <p className="text-[11px] text-warm-text-faint uppercase tracking-wider">
                Current discipline
              </p>
              <p className="text-sm text-warm-text-muted">
                {milestone.discipline}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyContext}
              className="inline-flex h-9 w-fit items-center gap-2 rounded-lg border border-warm-border bg-warm-bg px-3 text-xs font-medium text-warm-text-muted transition-colors hover:bg-warm-surface-dark hover:text-warm-text focus:outline-none focus:ring-2 focus:ring-warm-accent/25"
              aria-label="Copy milestone context for AI prompting"
              title="Copy milestone context for AI prompting"
            >
              {copyStatus === "copied" ? (
                <Check className="h-4 w-4 text-warm-success" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
              <span>
                {copyStatus === "copied"
                  ? "Copied"
                  : copyStatus === "error"
                    ? "Copy failed"
                    : "Copy context"}
              </span>
            </button>
          </div>
        </div>

        {/* Solved state */}
        {solved ? (
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="rounded-xl border border-warm-success/20 bg-warm-success/5 px-5 py-4 text-center">
              <p className="font-heading text-xs text-warm-success uppercase tracking-wider mb-2">
                Milestone cleared
              </p>
              <p className="text-lg text-warm-text">{milestone.belief}</p>
            </div>

            <section className="rounded-xl border border-warm-border bg-warm-surface px-5 py-5 text-left">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-heading text-[11px] text-warm-text-muted uppercase tracking-wider">
                    New narrative unlocked
                  </p>
                  <h2 className="mt-1 font-heading text-lg text-warm-heading">
                    {currentChapter?.title ?? `M${milestone.id} narrative`}
                  </h2>
                </div>
                {!narrativeDone && (
                  <span className="rounded-full bg-warm-surface-dark px-2 py-1 text-[11px] text-warm-text-muted">
                    typing
                  </span>
                )}
              </div>

              <div className="min-h-[180px] whitespace-pre-wrap text-sm leading-7 text-warm-text-muted">
                {narrativeDone ? (
                  narrativeText
                ) : (
                  <Typewriter
                    text={narrativeText}
                    speed={14}
                    cursor="▌"
                    hideCursorOnFinish
                    onFinished={() => setNarrativeDone(true)}
                  />
                )}
              </div>
            </section>

            <div className="flex justify-center">
              {narrativeDone ? (
                shouldUseDiscoveredM3Route ? (
                  <div className="max-w-xl rounded-xl border border-warm-accent/20 bg-warm-accent/5 px-5 py-4 text-center">
                    <p className="font-heading text-[11px] uppercase tracking-wider text-warm-accent">
                      Hidden route unlocked
                    </p>
                    <p className="mt-2 text-sm leading-6 text-warm-text-muted">
                      The THEIA link recovered from the Mail service is live
                      now. Open that route to enter Kai&apos;s private
                      dashboard.
                    </p>
                  </div>
                ) : milestone.id < 5 ? (
                  <Link
                    href={`/milestone/${milestone.id + 1}`}
                    className="inline-block px-6 py-3 bg-warm-btn text-warm-bg font-semibold rounded-lg hover:bg-warm-btn-hover transition-colors"
                  >
                    Continue to M{milestone.id + 1}
                  </Link>
                ) : (
                  <Link
                    href="/finale"
                    className="inline-block px-6 py-3 bg-warm-btn text-warm-bg font-semibold rounded-lg hover:bg-warm-btn-hover transition-colors"
                  >
                    Final reveal
                  </Link>
                )
              ) : (
                <button
                  type="button"
                  onClick={() => setNarrativeDone(true)}
                  className="px-5 py-2.5 text-sm font-semibold text-warm-text-muted transition-colors hover:text-warm-text"
                >
                  Skip animation
                </button>
              )}
            </div>
          </div>
        ) : (
          renderPuzzle()
        )}

        {!solved && feedback && (
          <div className="mt-4 rounded-lg border border-warm-error/20 bg-warm-error/5 px-4 py-3 text-sm text-warm-error">
            {feedback}
          </div>
        )}
      </main>

      <ClueDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        clueTokens={clueTokens}
        suspects={suspects}
        caseBriefChapters={briefChapters}
        selectedSuspectId={selectedSuspectId}
        onSelectSuspect={setSelectedSuspectId}
      />
    </div>
  );
}
