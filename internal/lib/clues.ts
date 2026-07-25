export const CLUE_VALUES = {
  incident_date: "0317",
  reported_death_time: "23:47",
  m3_console_arg: "2347",
  kai_signature: "Đặng Vũ Khoa",
  kai_birthdate: "19930317",
  suspect_1: "Minh",
  badge_anomaly: "in_without_out",
  place_token: "ThaoDien",
  password_place: "Bitexco",
  flight_0600: "VN402-5B-0600",
  dashboard_link: "/theia/41",
  codeword: "ORACLE-EYES",
  cipher_key: "THEIA",
  andy_role: "instigator_patsy",
  bao_role: "executioner",
} as const;

const M5_REQUIRED_CRIMES = {
  andyCrimes: [
    "conspiracy_murder",
    "money_laundering",
    "false_evidence",
    "obstruction",
  ],
  baoCrimes: [
    "murder",
    "unauthorized_access",
    "evidence_tampering",
    "obstruction",
  ],
  kaiCrimes: [
    "identity_fraud",
    "body_concealment",
    "obstruction",
    "flight_risk",
  ],
} as const;

const INTERNAL_ORIGIN = "https://internal.projectxvietnam.org";

export type ClueKey = keyof typeof CLUE_VALUES;

export type ClueTokenInput = {
  key: string;
  value: string;
};

type ValidationResult = {
  correct: boolean;
  message?: string;
  tokens?: ClueTokenInput[];
};

type ExistingClues = Map<string, string>;

export type M5PasswordSlotInput = {
  label?: unknown;
  value?: unknown;
  transform?: unknown;
};

function parsePayload(payload: string): unknown {
  try {
    return JSON.parse(payload);
  } catch {
    return payload;
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function latinized(value: string): string {
  return value
    .replace(/Đ/g, "D")
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalized(value: unknown): string {
  return latinized(text(value))
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function normalizedList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => normalized(item));
  const single = normalized(value);
  return single ? [single] : [];
}

function bool(value: unknown): boolean {
  return value === true || normalized(value) === "true" || normalized(value) === "yes";
}

function submittedValues(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => text(item)) : [];
}

function hasExactSelections(
  submitted: unknown,
  required: readonly string[]
): boolean {
  const selected = new Set(submittedValues(submitted));
  return (
    selected.size === required.length &&
    required.every((item) => selected.has(item))
  );
}

function hasExpectedM5Plaintext(value: unknown): boolean {
  const plain = normalized(value);
  return (
    plain.includes("andyordered") &&
    plain.includes("baocarried") &&
    plain.includes("kien") &&
    plain.includes("kaiisalive") &&
    plain.includes("gate17") &&
    plain.includes("0600")
  );
}

function isDashboardLink(value: unknown): boolean {
  const route = CLUE_VALUES.dashboard_link;
  const submitted = text(value);
  return submitted === route || submitted === `${INTERNAL_ORIGIN}${route}`;
}

function hasToken(clues: ExistingClues, key: ClueKey): boolean {
  return clues.get(key) === CLUE_VALUES[key];
}

export function clueMap(tokens: ClueTokenInput[]): ExistingClues {
  return new Map(tokens.map((token) => [token.key, token.value]));
}

export function normalizeM5Password(input: string): string {
  return latinized(input)
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9_-]/g, "");
}

function compactPasswordFragment(value: string): string {
  return latinized(value).replace(/[^a-zA-Z0-9]/g, "");
}

export function scoreM5PasswordSlots(slots: unknown): {
  valuesCorrect: number;
  transformsCorrect: number;
  total: number;
} {
  const expected: Record<string, { value: string; transform: string }> = {
    legalname: { value: CLUE_VALUES.kai_signature, transform: "strip" },
    codeword: { value: CLUE_VALUES.codeword, transform: "none" },
    place: { value: CLUE_VALUES.password_place, transform: "reverse" },
    birthdate: { value: CLUE_VALUES.kai_birthdate, transform: "none" },
  };
  const aliases: Record<string, keyof typeof expected> = {
    name: "legalname",
    legalname: "legalname",
    codeword: "codeword",
    place: "place",
    date: "birthdate",
    birthdate: "birthdate",
  };
  const submitted = Array.isArray(slots) ? slots : [];
  let valuesCorrect = 0;
  let transformsCorrect = 0;

  for (const [key, answer] of Object.entries(expected)) {
    const slot = submitted.find((item) => {
      const record = asRecord(item);
      const label = aliases[normalized(record.label)];
      return label === key;
    });
    if (!slot) continue;

    const record = asRecord(slot);
    if (normalized(record.value) === normalized(answer.value)) valuesCorrect++;
    if (text(record.transform) === answer.transform) transformsCorrect++;
  }

  return { valuesCorrect, transformsCorrect, total: Object.keys(expected).length };
}

export function buildM5Password(clues: ExistingClues): string | null {
  const kai = clues.get("kai_signature");
  const codeword = clues.get("codeword");
  const place = clues.get("password_place");
  const birthdate = clues.get("kai_birthdate");
  if (!kai || !codeword || !place || !birthdate) return null;
  return `${compactPasswordFragment(kai)}_${codeword}_${place.split("").reverse().join("")}_${birthdate}`;
}

export function validateM5Password(input: string, clues: ExistingClues): boolean {
  const expected = buildM5Password(clues);
  if (!expected) return false;
  return normalizeM5Password(input) === normalizeM5Password(expected);
}

export function hasM5Prerequisites(clues: ExistingClues): boolean {
  return (
    hasToken(clues, "incident_date") &&
    hasToken(clues, "kai_signature") &&
    hasToken(clues, "kai_birthdate") &&
    hasToken(clues, "place_token") &&
    hasToken(clues, "password_place") &&
    hasToken(clues, "codeword") &&
    hasToken(clues, "cipher_key") &&
    hasToken(clues, "andy_role") &&
    hasToken(clues, "bao_role")
  );
}

export function validateMilestoneSubmission(
  milestone: number,
  payload: string,
  existingClues: ExistingClues
): ValidationResult {
  const data = asRecord(parsePayload(payload));

  switch (milestone) {
    case 1: {
      const suspects = normalizedList(data.suspects ?? data.suspect);
      const note = text(data.note);
      const ok =
        suspects.length === 1 && suspects[0] === "minh" && note.length >= 10;

      if (!ok) {
        return {
          correct: false,
          message:
            "Try again. Choose the strongest single suspect your team can defend, then add a short evidence note.",
        };
      }

      return {
        correct: true,
        tokens: [
          { key: "incident_date", value: CLUE_VALUES.incident_date },
          { key: "reported_death_time", value: CLUE_VALUES.reported_death_time },
          { key: "m3_console_arg", value: CLUE_VALUES.m3_console_arg },
          { key: "password_place", value: CLUE_VALUES.password_place },
          { key: "m1_hypothesis", value: "accepted" },
          { key: "m1_suspect_board_mode", value: "single_minh" },
          { key: "badge_anomaly", value: CLUE_VALUES.badge_anomaly },
        ],
      };
    }

    case 2: {
      const ok =
        bool(data.minhCleared) &&
        bool(data.badgeWasCloned) &&
        normalized(data.badgeCloneSuspect) === "bao" &&
        normalized(data.placeToken) === "thaodien" &&
        normalized(data.passwordPlace) === "bitexco" &&
        normalized(data.kaiLegalName) === "dangvukhoa" &&
        normalized(data.kaiBirthdate) === "19930317" &&
        normalized(data.flight0600) === "vn4025b0600" &&
        normalized(data.offshoreWire).includes("horizonpacific") &&
        isDashboardLink(data.dashboardLink) &&
        normalized(data.twinSeed).includes("brother");

      if (!ok) {
        return {
          correct: false,
          message:
            "Submit the complete external-evidence bundle: Minh cleared, cloned badge, Bảo, ThaoDien, Bitexco, Kai's legal name and birthdate, VN402-5B-0600, Horizon Pacific, the THEIA dashboard link, and the brother/twin seed.",
        };
      }

      return {
        correct: true,
        tokens: [
          { key: "minh_cleared", value: "true" },
          { key: "badge_was_cloned", value: "true" },
          { key: "badge_clone_suspect", value: "Bảo" },
          { key: "place_token", value: CLUE_VALUES.place_token },
          { key: "kai_signature", value: CLUE_VALUES.kai_signature },
          { key: "kai_birthdate", value: CLUE_VALUES.kai_birthdate },
          { key: "flight_0600", value: CLUE_VALUES.flight_0600 },
          { key: "offshore_wire", value: "Horizon Pacific Consulting" },
          { key: "dashboard_link", value: CLUE_VALUES.dashboard_link },
          { key: "twin_seed", value: "Kai had a brother" },
        ],
      };
    }

    case 3: {
      const ok =
        hasToken(existingClues, "m3_console_arg") &&
        existingClues.get("m3_reveal_seen") === "true" &&
        normalized(data.codeword) === "oracleeyes" &&
        normalized(data.impossibleClock).includes("2100") &&
        normalized(data.impossibleClock).includes("2347");

      if (!ok) {
        return {
          correct: false,
          message:
            "Submit the codeword and the 21:00 to 23:47 impossible clock after unlocking the reveal.",
        };
      }

      return {
        correct: true,
        tokens: [
          { key: "kai_staged_his_death", value: "true" },
          { key: "codeword", value: CLUE_VALUES.codeword },
          { key: "warning", value: "THEIA lies first; the death-hour is false" },
          { key: "twin_hint", value: "Two-Kai/autopsy contradiction" },
        ],
      };
    }

    case 4:
      return {
        correct: false,
        message: "Milestone 4 is cleared only by a facilitator.",
      };

    case 5: {
      const incorrectSuspects = [
        !hasExactSelections(data.andyCrimes, M5_REQUIRED_CRIMES.andyCrimes) &&
          "Andy",
        !hasExactSelections(data.baoCrimes, M5_REQUIRED_CRIMES.baoCrimes) &&
          "Bảo",
        !hasExactSelections(data.kaiCrimes, M5_REQUIRED_CRIMES.kaiCrimes) &&
          "Kai",
      ].filter(Boolean);

      const ok =
        hasM5Prerequisites(existingClues) &&
        hasExpectedM5Plaintext(data.finalPlaintext) &&
        incorrectSuspects.length === 0;

      if (!ok) {
        return {
          correct: false,
          message: incorrectSuspects.length
            ? `The arrest permit has unsupported or missing charges for: ${incorrectSuspects.join(", ")}.`
            : "Submit the police filing after decoding the final plaintext, with all expected crimes selected for Andy, Bảo, and Kai.",
        };
      }

      return {
        correct: true,
        tokens: [
          { key: "kai_location", value: "Gate 17 at 06:00" },
          { key: "body_identity", value: "Kiên Đặng" },
          { key: "kai_alive", value: "true" },
          { key: "case_resolved", value: "true" },
        ],
      };
    }

    default:
      return { correct: false };
  }
}

export const M4_CLUE_TOKENS: ClueTokenInput[] = [
  { key: "andy_role", value: CLUE_VALUES.andy_role },
  { key: "bao_role", value: CLUE_VALUES.bao_role },
  { key: "kai_maybe_alive", value: "true" },
  { key: "body_identity_status", value: "UNKNOWN" },
  { key: "cipher_key", value: CLUE_VALUES.cipher_key },
];

export function clueTokensForSolvedMilestones(
  solvedMilestones: number[]
): ClueTokenInput[] {
  const solved = new Set(solvedMilestones);
  const tokens: ClueTokenInput[] = [];

  if (solved.has(1)) {
    tokens.push(
      { key: "incident_date", value: CLUE_VALUES.incident_date },
      { key: "reported_death_time", value: CLUE_VALUES.reported_death_time },
      { key: "m3_console_arg", value: CLUE_VALUES.m3_console_arg },
      { key: "password_place", value: CLUE_VALUES.password_place },
      { key: "m1_hypothesis", value: "accepted" },
      { key: "badge_anomaly", value: CLUE_VALUES.badge_anomaly }
    );
  }

  if (solved.has(2)) {
    tokens.push(
      { key: "minh_cleared", value: "true" },
      { key: "badge_was_cloned", value: "true" },
      { key: "badge_clone_suspect", value: "Bảo" },
      { key: "place_token", value: CLUE_VALUES.place_token },
      { key: "kai_signature", value: CLUE_VALUES.kai_signature },
      { key: "kai_birthdate", value: CLUE_VALUES.kai_birthdate },
      { key: "flight_0600", value: CLUE_VALUES.flight_0600 },
      { key: "offshore_wire", value: "Horizon Pacific Consulting" },
      { key: "dashboard_link", value: CLUE_VALUES.dashboard_link },
      { key: "twin_seed", value: "Kai had a brother" }
    );
  }

  if (solved.has(3)) {
    tokens.push(
      { key: "kai_staged_his_death", value: "true" },
      { key: "codeword", value: CLUE_VALUES.codeword },
      { key: "warning", value: "THEIA lies first; the death-hour is false" },
      { key: "twin_hint", value: "Two-Kai/autopsy contradiction" }
    );
  }

  if (solved.has(4)) tokens.push(...M4_CLUE_TOKENS);

  return tokens;
}
