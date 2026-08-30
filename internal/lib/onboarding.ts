/**
 * The shape of the /welcome flow, and the one definition of "complete".
 *
 * Kept out of the page so the guard in lib/auth-guards.ts, the server action in
 * lib/member-actions.ts and the nudge on the home page all agree on what a
 * finished profile is. When that answer lived in three places it drifted within
 * a day.
 *
 * Two different questions, deliberately not merged:
 *
 *   coreComplete()  — has this person supplied the fields the directory needs to
 *                     function? Title, department, and at least one expertise
 *                     tag: without them a tile renders "No title yet" and the
 *                     filters can't find them. This gates access.
 *   profileGaps()   — what did they skip? Bio, lootbox, links, location. These
 *                     make a profile worth reading but nothing breaks without
 *                     them, so they are nudged, never enforced.
 */

export const STEPS = ["role", "about", "lootbox", "reach"] as const;
export type OnboardingStep = (typeof STEPS)[number];

export const STEP_META: Record<
  OnboardingStep,
  { title: string; blurb: string; required: boolean }
> = {
  role: {
    title: "Where you sit",
    blurb: "This is what teammates see first, and what the directory filters on.",
    required: true,
  },
  about: {
    title: "What to ask you about",
    blurb: "The whole point of a directory is knowing who to go to. Be specific.",
    required: true,
  },
  lootbox: {
    title: "Your lootbox",
    blurb: "Six things that are actually yours. The one part that isn't about work.",
    required: false,
  },
  reach: {
    title: "Where to find you",
    blurb: "Timezone matters more than you'd think on a remote team.",
    required: false,
  },
};

/** Narrow structural type — anything with these fields works, row or session. */
export type OnboardingMember = {
  title: string | null;
  departmentId: string | null;
  expertise: { id: string }[];
  bio: string | null;
  location: string | null;
  timezone: string | null;
  links: unknown;
  lootbox: unknown;
  onboardedAt: Date | null;
};

function filled(value: string | null | undefined) {
  return Boolean(value && value.trim());
}

/**
 * The fields the directory genuinely needs. A member without these renders as a
 * near-empty tile that no filter can reach, which is worse for everyone than a
 * short gate on the way in.
 */
export function coreComplete(member: OnboardingMember) {
  return filled(member.title) && Boolean(member.departmentId) && member.expertise.length > 0;
}

/** Which required step is still unanswered — where the flow should resume. */
export function firstIncompleteStep(member: OnboardingMember): OnboardingStep {
  if (!filled(member.title) || !member.departmentId) return "role";
  if (member.expertise.length === 0) return "about";
  return "lootbox";
}

export function nextStep(step: OnboardingStep): OnboardingStep | null {
  const index = STEPS.indexOf(step);
  return index < 0 || index === STEPS.length - 1 ? null : STEPS[index + 1];
}

export function previousStep(step: OnboardingStep): OnboardingStep | null {
  const index = STEPS.indexOf(step);
  return index <= 0 ? null : STEPS[index - 1];
}

export function isStep(value: unknown): value is OnboardingStep {
  return typeof value === "string" && (STEPS as readonly string[]).includes(value);
}

/**
 * Optional things this member skipped, as human labels for the nudge. Ordered by
 * how much each one actually helps a colleague reading the profile — a bio earns
 * its prompt, a timezone barely does, so the caller can show only the first few.
 */
export function profileGaps(member: OnboardingMember): string[] {
  const links = (member.links ?? {}) as Record<string, unknown>;
  const gaps: string[] = [];

  if (!filled(member.bio)) gaps.push("a bio");
  if (!Array.isArray(member.lootbox) || member.lootbox.length === 0) gaps.push("a lootbox");
  if (!Object.values(links).some((value) => filled(value as string))) gaps.push("any links");
  if (!filled(member.location) && !filled(member.timezone)) gaps.push("where you are");

  return gaps;
}

/** "a bio and a lootbox" — for prose, not a list. */
export function joinGaps(gaps: string[]) {
  if (gaps.length <= 1) return gaps[0] ?? "";
  if (gaps.length === 2) return `${gaps[0]} and ${gaps[1]}`;
  return `${gaps.slice(0, -1).join(", ")} and ${gaps[gaps.length - 1]}`;
}
