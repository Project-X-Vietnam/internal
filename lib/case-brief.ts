export type CaseBriefChapter = {
  milestone: number;
  title: string;
  summary: string[];
  takeaway: string;
};

type ClueTokenLike = {
  key: string;
  value: string;
};

const M1_SINGLE_SUSPECT_CHAPTER: CaseBriefChapter = {
  milestone: 1,
  title: "M1 — The Weight of Evidence",
  summary: [
    "The tower records pointed almost too neatly at Minh: motive, opportunity, and a badge tap onto floor 41 minutes before THEIA reported the death.",
    "The corrected clock matters. Without it, the entire case rests on a false hour.",
    "One splinter remains: Minh's badge entered, but it never left.",
  ],
  takeaway:
    "Working theory: Minh appears guilty, but the badge anomaly keeps the door open.",
};

const M1_MULTI_SUSPECT_CHAPTER: CaseBriefChapter = {
  milestone: 1,
  title: "M1 — The Weight of Evidence",
  summary: [
    "Your suspect board is moving in the right direction. The tower records support more than one defensible lead, and the first answer should not feel too clean.",
    "The corrected clock matters. Without it, the entire case rests on a false hour.",
    "One splinter remains: a badge entered the critical floor, but the matching exit never appears.",
  ],
  takeaway:
    "Working theory: keep the selected suspects active, but carry the badge anomaly forward.",
};

const CASE_BRIEF_CHAPTERS: CaseBriefChapter[] = [
  M1_MULTI_SUSPECT_CHAPTER,
  {
    milestone: 2,
    title: "M2 — The World Outside the Tower",
    summary: [
      "External records broke the tower's story. Minh was across town when his badge supposedly entered Kai's floor.",
      "The badge was not proof of Minh's presence. It was someone wearing his identity like a costume.",
      "A dawn flight, a Thao Dien trail, a quiet offshore wire, and a hidden dashboard route all entered the file.",
    ],
    takeaway:
      "Working theory: Minh was framed by someone with access, planning, and a reason to manufacture the obvious suspect.",
  },
  {
    milestone: 3,
    title: "M3 — The Dead Man Was Ready",
    summary: [
      "Kai's private dashboard was not empty. It was a descent, nested layer under nested layer, waiting for investigators who carried the corrected reported-death time.",
      "At the bottom was a dead-man's message — not a farewell, but instructions. Kai said he had planned everything you are seeing, warned you not to trust THEIA's first answer, and said the hour on his grave was wrong.",
      "The impossible clock: Kai's final system logout was 21:00. The death was reported at 23:47. Nearly three hours unaccounted for.",
    ],
    takeaway:
      "Working theory: Kai knew what was coming and prepared for it. But a body still ended up dead on floor 41 — and the timeline does not explain how.",
  },
  {
    milestone: 4,
    title: "M4 — The Machine That Lied",
    summary: [
      "THEIA only yielded when confronted with earned facts: the badge that entered without leaving, the money trail, and the missing minutes.",
      "She slipped into present tense about Kai. Then the shape of the night changed.",
      "Andy ordered the death and Bảo carried it out, but THEIA cannot identify the body in the office.",
    ],
    takeaway:
      "Working theory: Kai may be alive, Andy is an instigator and patsy, Bảo is the executioner, and the body's identity is the final locked door.",
  },
  {
    milestone: 5,
    title: "M5 — The Room at the End",
    summary: [
      "Kai's vault opened only when the whole investigation was assembled: date, place, codeword, cipher key, and pattern.",
      "The plaintext confirmed the body was Kiên, Kai's twin. Kai survived and used the investigation to bury the last witnesses to his escape.",
      "The failsafe gave one actionable truth: Gate 17, 06:00.",
    ],
    takeaway:
      "Case resolved: Andy ordered it, Bảo executed it, Kiên died, Kai is alive, and the team can catch him at dawn.",
  },
];

export function getUnlockedCaseBriefChapters(
  solvedMilestones: number[],
  clueTokens: ClueTokenLike[] = []
): CaseBriefChapter[] {
  const solved = new Set(solvedMilestones);
  const m1Mode = clueTokens.find(
    (token) => token.key === "m1_suspect_board_mode"
  )?.value;

  return CASE_BRIEF_CHAPTERS.filter((chapter) =>
    solved.has(chapter.milestone)
  ).map((chapter) => {
    if (chapter.milestone !== 1) return chapter;
    return m1Mode === "multi_suspect"
      ? M1_MULTI_SUSPECT_CHAPTER
      : M1_SINGLE_SUSPECT_CHAPTER;
  });
}
