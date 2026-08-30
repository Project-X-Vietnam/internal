/**
 * Portrait lookup for the directory gallery.
 *
 * ── Note on the public-repo rule ────────────────────────────────────────────
 * AGENTS.md says member photos and names live in Postgres only. These portraits
 * are a deliberate, owner-approved exception: they are the same files already
 * published on the public marketing site (`landing-page/public/images/team/`),
 * so committing them here discloses nothing that isn't already indexed. Do not
 * treat this file as licence to add *new* member data — anything not already
 * public on the marketing site still belongs in the database.
 * ───────────────────────────────────────────────────────────────────────────
 *
 * `Member` rows are created by Google sign-in, so the name on the account is
 * whatever the person set there ("Liam Le") and rarely matches the full name the
 * marketing site uses ("Liam Minh Le"). Matching is therefore fuzzy, and
 * deliberately conservative: showing the wrong person's face is far worse than
 * showing none, so an ambiguous match resolves to nothing.
 */

/** Marketing-site name → file in `public/images/team/`. */
const BY_NAME: Record<string, string> = {
  "Kelly Tran": "lamha.jpg",
  "Liam Minh Le": "liamminhle.jpg",
  "Diu Nguyen": "diunguyen.jpg",
  "Ngoc Linh Tran": "ngoclinh.jpg",
  "Phi Long": "philong.jpeg",
  "Bo Nguyen": "bo-nguyen.jpg",
  "Dan Nhi": "dannhi.jpg",
  "Tran Lam Minh Thu": "tran-lam-minh-thu.jpg",
  "Giang Le": "giangle.jpg",
  "Nguyen Vu Gia Hung": "nguyenvugiahung.jpeg",
  "Phuong Nga": "phuongnga.jpeg",
  "Nguyen Duc Ha Nam": "hanam.jpeg",
  "Quynh Anh Tran": "quynhanhtran.jpg",
  "Nguyen Minh Ngoc": "nguyenminhngoc.jpg",
  "Nhi Dang": "nhi-dang.jpg",
  "Bin Nguyen": "bin-nguyen.jpg",
  "Yhuong Tran Thi": "yhuong-tran-thi.jpg",
  "Minh Huy": "minhhuy.jpg",
  "Minh Hung": "minhhung.jpg",
};

/**
 * Work addresses published alongside the portraits. Checked before the name
 * match because an address is exact — no heuristic needed.
 */
const BY_EMAIL: Record<string, string> = {
  "lamha.kelly@gmail.com": "lamha.jpg",
  "hunglm.pjxvietnam@gmail.com": "liamminhle.jpg",
  "diunt.pjxvietnam@gmail.com": "diunguyen.jpg",
  "hungnvg1.pjxvietnam@gmail.com": "nguyenvugiahung.jpeg",
};

const PATH = "/images/team/";

/** Lowercase, de-accented name tokens. Mirrors `slugify`'s NFD handling. */
function tokens(name: string): string[] {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

const INDEX = Object.entries(BY_NAME).map(([name, file]) => ({
  file,
  tokens: new Set(tokens(name)),
}));

/**
 * The portrait for a member, or null.
 *
 * A candidate wins only when one name is a subset of the other *and* they share
 * at least two tokens — enough to tell "Liam Le" from "Liam Minh Le" without
 * also collapsing "Bo Nguyen" into "Bin Nguyen". Two candidates tying on the
 * same score means the name is ambiguous, and ambiguity resolves to null.
 */
export function portraitFor(member: { name: string; email?: string | null }): string | null {
  const email = member.email?.trim().toLowerCase();
  if (email && BY_EMAIL[email]) return PATH + BY_EMAIL[email];

  const own = new Set(tokens(member.name));
  if (own.size === 0) return null;

  let best: { file: string; score: number } | null = null;
  let tied = false;

  for (const entry of INDEX) {
    let shared = 0;
    for (const token of own) if (entry.tokens.has(token)) shared += 1;
    if (shared < 2) continue;
    // One name must be contained in the other: a partial overlap is two
    // different people who happen to share syllables.
    if (shared !== own.size && shared !== entry.tokens.size) continue;

    if (!best || shared > best.score) {
      best = { file: entry.file, score: shared };
      tied = false;
    } else if (shared === best.score && entry.file !== best.file) {
      tied = true;
    }
  }

  if (!best || tied) return null;
  return PATH + best.file;
}
