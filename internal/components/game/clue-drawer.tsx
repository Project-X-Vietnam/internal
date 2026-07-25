"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Mail, Phone, ScanLine, X } from "lucide-react";
import { PROLOGUE_LINES } from "@/lib/prologue";
import type { Suspect } from "@/lib/game";

type CaseBriefChapter = {
  milestone: number;
  title: string;
  summary: string[];
  takeaway: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  clueTokens: { key: string; value: string }[];
  suspects: Suspect[];
  caseBriefChapters: CaseBriefChapter[];
  selectedSuspectId: string | null;
  onSelectSuspect: (id: string | null) => void;
};

type FriendlyClue = {
  title: string;
  detail: string;
};

const HIDDEN_CLUE_KEYS = new Set(["m1_suspect_board_mode", "m3_reveal_seen"]);

const FRIENDLY_CLUES: Record<string, (value: string) => FriendlyClue> = {
  incident_date: (value) => ({
    title: "Date to remember",
    detail: `Keep ${value} in the case file. It may matter again later.`,
  }),
  reported_death_time: (value) => ({
    title: "Corrected report time",
    detail: `THEIA reported the death at ${value} after the clock correction.`,
  }),
  m3_console_arg: (value) => ({
    title: "Dashboard unlock number",
    detail: `Use ${value} if a later system asks for the corrected time without punctuation.`,
  }),
  kai_signature: (value) => ({
    title: "Kai's legal name",
    detail: `${value} comes from the archived founder profile and is one of the vault ingredients.`,
  }),
  kai_birthdate: (value) => ({
    title: "Kai's birthdate fragment",
    detail: `${value} comes from Kai's archived public profile. It is more personal than the incident date.`,
  }),
  m1_hypothesis: () => ({
    title: "First theory accepted",
    detail: "Your team has a defensible suspect board. Keep testing it.",
  }),
  badge_anomaly: () => ({
    title: "Badge trail anomaly",
    detail: "One badge enters the critical floor, but the matching exit is missing.",
  }),
  minh_cleared: () => ({
    title: "Alibi confirmed",
    detail: "External records show Minh could not be in both places at once.",
  }),
  badge_was_cloned: () => ({
    title: "Badge identity is unreliable",
    detail: "The tower badge log proves access, not who physically carried the badge.",
  }),
  badge_clone_suspect: (value) => ({
    title: "Badge-clone lead",
    detail: `${value} had the access needed to make the badge trail lie.`,
  }),
  place_token: (value) => ({
    title: "Alibi location",
    detail: `${value} proves Minh was away from the critical floor.`,
  }),
  password_place: (value) => ({
    title: "Tower landmark",
    detail: `${value} is the place named in the opening brief. Kai uses it as a vault ingredient.`,
  }),
  flight_0600: (value) => ({
    title: "Dawn flight lead",
    detail: `A 06:00 booking stands out on the manifest: ${value}.`,
  }),
  offshore_wire: (value) => ({
    title: "Money trail",
    detail: `The suspicious wire points to ${value}.`,
  }),
  dashboard_link: (value) => ({
    title: "Hidden dashboard found",
    detail: `The private THEIA route is https://internal.projectxvietnam.org${value}.`,
  }),
  twin_seed: () => ({
    title: "Family clue",
    detail: "Kai's history includes a quiet brother thread. Do not lose it.",
  }),
  kai_staged_his_death: () => ({
    title: "Staged-death signal",
    detail: "Kai prepared a death scene and expected someone to investigate it.",
  }),
  codeword: (value) => ({
    title: "Codeword",
    detail: `${value} is one of the final vault ingredients.`,
  }),
  warning: (value) => ({
    title: "THEIA warning",
    detail: value,
  }),
  twin_hint: () => ({
    title: "Autopsy contradiction",
    detail: "The body evidence does not cleanly match the story everyone is telling.",
  }),
  andy_role: () => ({
    title: "Andy's role",
    detail: "Andy ordered the plan and thought he was in control, but he was being used too.",
  }),
  bao_role: () => ({
    title: "Bảo's role",
    detail: "Bảo carried out the physical act and helped make the scene look impossible.",
  }),
  kai_maybe_alive: () => ({
    title: "Kai status",
    detail: "THEIA's wording suggests Kai may still be alive.",
  }),
  body_identity_status: () => ({
    title: "Body identity",
    detail: "The person in the room is still not confirmed.",
  }),
  cipher_key: (value) => ({
    title: "Cipher key",
    detail: `${value} is needed for the final decryption.`,
  }),
  kai_location: (value) => ({
    title: "Final location",
    detail: value,
  }),
  body_identity: (value) => ({
    title: "Body identified",
    detail: `The body was ${value}.`,
  }),
  kai_alive: () => ({
    title: "Kai survived",
    detail: "The final file confirms Kai is alive.",
  }),
  case_resolved: () => ({
    title: "Case resolved",
    detail: "Your team has assembled the truth.",
  }),
};

function humanizeKey(key: string) {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatClue(token: { key: string; value: string }): FriendlyClue {
  const formatter = FRIENDLY_CLUES[token.key];
  if (formatter) return formatter(token.value);

  return {
    title: humanizeKey(token.key),
    detail: token.value,
  };
}

export function ClueDrawer({
  open,
  onClose,
  clueTokens,
  suspects,
  caseBriefChapters,
  selectedSuspectId,
  onSelectSuspect,
}: Props) {
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(
    selectedSuspectId
  );
  const visibleClues = clueTokens.filter(
    (token) => !HIDDEN_CLUE_KEYS.has(token.key)
  );
  const selectedSuspect = useMemo(
    () => suspects.find((suspect) => suspect.id === localSelectedId) ?? null,
    [localSelectedId, suspects]
  );

  useEffect(() => {
    setLocalSelectedId(selectedSuspectId);
  }, [selectedSuspectId]);

  function selectSuspect(id: string | null) {
    setLocalSelectedId(id);
    onSelectSuspect(id);
  }

  const sheetSpring = {
    type: "spring" as const,
    stiffness: 400,
    damping: 40,
  };

  const sheetExitSpring = {
    type: "spring" as const,
    stiffness: 500,
    damping: 45,
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={onClose}
          />

          <div className="pointer-events-none fixed inset-y-0 right-0 z-50 flex w-full justify-end overflow-hidden">
              <AnimatePresence initial={false} mode="popLayout">
                {selectedSuspect && (
                  <motion.aside
                    key={selectedSuspect.id}
                    className="pointer-events-auto absolute inset-y-0 right-0 z-10 w-full max-w-xl overflow-y-auto border-l border-warm-border bg-warm-bg shadow-2xl will-change-transform lg:relative lg:right-auto lg:z-auto lg:w-[420px] lg:max-w-[420px] lg:shrink-0"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%", transition: sheetExitSpring }}
                    transition={sheetSpring}
                    aria-label={`${selectedSuspect.name} dossier`}
                  >
                    <SuspectDossier
                      suspect={selectedSuspect}
                      onClose={() => selectSuspect(null)}
                    />
                  </motion.aside>
                )}
              </AnimatePresence>

            {/* Drawer */}
            <motion.div
              className="pointer-events-auto h-full w-full max-w-xl shrink-0 overflow-y-auto border-l border-warm-border bg-warm-surface will-change-transform"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%", transition: sheetExitSpring }}
              transition={sheetSpring}
            >
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="font-heading text-[11px] text-warm-text-muted uppercase tracking-wider mb-1">
                      Oracle Labs
                    </p>
                    <h2 className="font-heading text-xl text-warm-heading">
                      Case Brief
                    </h2>
                    <p className="mt-1 text-sm text-warm-text-muted">
                      Prologue, unlocked story beats, evidence, and suspects.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-md hover:bg-warm-surface-dark transition-colors text-warm-text-muted hover:text-warm-text"
                    aria-label="Close case brief"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

              <section className="mb-8">
                <h3 className="font-heading text-xs text-warm-text-muted uppercase tracking-wider mb-3">
                  Opening briefing
                </h3>
                <div className="rounded-lg border border-warm-border bg-warm-bg px-4 py-3">
                  <div className="space-y-3">
                    {PROLOGUE_LINES.map((line, index) => (
                      <p
                        key={line}
                        className={`text-sm leading-relaxed ${
                          index === 3 || index === PROLOGUE_LINES.length - 1
                            ? "font-medium italic text-warm-heading"
                            : "text-warm-text-muted"
                        }`}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="font-heading text-xs text-warm-text-muted uppercase tracking-wider">
                    Narrative log
                  </h3>
                  <span className="rounded-full bg-warm-surface-dark px-2 py-0.5 text-[11px] text-warm-text-muted">
                    {caseBriefChapters.length}/5 unlocked
                  </span>
                </div>
                {caseBriefChapters.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-warm-border bg-warm-bg px-4 py-4">
                    <p className="text-sm text-warm-text-faint italic">
                      Milestone narratives will appear here after your team
                      earns them.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {caseBriefChapters.map((chapter) => (
                      <div
                        key={chapter.milestone}
                        className="rounded-lg border border-warm-border bg-warm-bg px-4 py-3"
                      >
                        <h4 className="font-heading text-sm text-warm-heading">
                          {chapter.title}
                        </h4>
                        <div className="mt-3 space-y-2">
                          {chapter.summary.map((line) => (
                            <p
                              key={line}
                              className="text-sm leading-relaxed text-warm-text-muted"
                            >
                              {line}
                            </p>
                          ))}
                        </div>
                        <p className="mt-3 border-t border-warm-border pt-3 text-sm font-medium leading-relaxed text-warm-text">
                          {chapter.takeaway}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xs text-warm-text-muted uppercase tracking-wider mb-3">
                  Evidence notes
                </h3>
                {visibleClues.length === 0 ? (
                  <p className="text-sm text-warm-text-faint italic">
                    No clues collected yet. Solve milestones to gather evidence.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {visibleClues.map((t) => {
                      const clue = formatClue(t);
                      return (
                      <div
                        key={t.key}
                        className="p-3 rounded-lg bg-warm-bg border border-warm-border"
                      >
                        <p className="mb-1 text-sm font-medium text-warm-heading">
                          {clue.title}
                        </p>
                        <p className="text-sm leading-relaxed text-warm-text-muted">
                          {clue.detail}
                        </p>
                      </div>
                      );
                    })}
                  </div>
                )}
              </section>

              <section>
                <h3 className="font-heading text-xs text-warm-text-muted uppercase tracking-wider mb-3">
                  Suspect board
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {suspects.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => selectSuspect(s.id)}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                        selectedSuspect?.id === s.id
                          ? "border-warm-accent/35 bg-warm-accent/5"
                          : "border-warm-border bg-warm-bg hover:border-warm-border-dark hover:bg-warm-surface-dark/50"
                      }`}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warm-surface-dark text-xs font-medium text-warm-text-muted">
                        {s.initial}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-warm-text">
                          {s.name}
                        </p>
                        <p className="truncate text-xs text-warm-text-muted">
                          {s.role}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function SuspectDossier({
  suspect,
  onClose,
}: {
  suspect: Suspect;
  onClose: () => void;
}) {
  return (
    <div className="min-h-full">
      <div className="sticky top-0 z-10 border-b border-warm-border bg-warm-bg/95 px-4 py-4 backdrop-blur sm:px-5">
        <button
          type="button"
          onClick={onClose}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-warm-text-muted transition-colors hover:text-warm-text"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Case brief
        </button>
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-warm-surface-dark text-sm font-medium text-warm-text-muted">
            {suspect.initial}
          </div>
          <div className="min-w-0">
            <p className="font-heading text-[11px] uppercase tracking-wider text-warm-text-muted">
              Suspect dossier
            </p>
            <h3 className="mt-1 font-heading text-lg text-warm-heading">
              {suspect.fullName}
            </h3>
            <p className="text-sm text-warm-text-muted">{suspect.role}</p>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-4 py-5 sm:px-5">
        <p className="text-sm leading-relaxed text-warm-text-muted">
          {suspect.profile}
        </p>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <InfoRow
            icon={<Mail className="h-3.5 w-3.5" aria-hidden="true" />}
            label="Email"
            value={suspect.email}
          />
          <InfoRow
            icon={<Phone className="h-3.5 w-3.5" aria-hidden="true" />}
            label="Phone"
            value={suspect.phone}
          />
          <InfoRow
            icon={<ScanLine className="h-3.5 w-3.5" aria-hidden="true" />}
            label="SIM"
            value={suspect.simId}
          />
          <InfoRow
            icon={<ScanLine className="h-3.5 w-3.5" aria-hidden="true" />}
            label="Badge"
            value={suspect.badgeId}
          />
          <InfoRow label="Office" value={suspect.office} />
          <InfoRow label="District" value={suspect.district} />
        </div>

        <div className="rounded-md border border-warm-border bg-warm-surface px-3 py-3">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-warm-text-muted">
            Provider preferences
          </p>
          <div className="space-y-1.5">
            {suspect.providerPreferences.map((preference) => (
              <p
                key={preference}
                className="rounded-md bg-warm-bg px-2.5 py-2 font-mono text-[11px] text-warm-text-muted"
              >
                {preference}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-md bg-warm-surface-dark px-3 py-3">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-warm-text-muted">
            Backstory
          </p>
          <p className="text-sm leading-relaxed text-warm-text-muted">
            {suspect.backstory}
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-warm-border bg-warm-surface px-3 py-2">
      <p className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-warm-text-muted">
        {icon}
        {label}
      </p>
      <p className="truncate font-mono text-xs text-warm-heading" title={value}>
        {value}
      </p>
    </div>
  );
}
