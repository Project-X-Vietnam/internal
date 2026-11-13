import Image from "next/image";

import { LootboxFields } from "@/components/platform/lootbox-fields";
import { AuthSplitShell } from "@/components/platform/page";
import { SelectField } from "@/components/platform/select-field";
import { Input, Textarea } from "@/components/ui/input";
import { parseLootbox } from "@/lib/lootbox";
import { STEP_META, STEPS, type OnboardingStep } from "@/lib/onboarding";
import { cn } from "@/lib/utils";

/**
 * The rendered half of /welcome. The route owns who-goes-where — session,
 * status, which step to resume — and this owns what a step looks like, so the
 * page stays readable as routing logic and this stays viewable without a
 * session behind it.
 *
 * Two columns, on the same split shell the sign-in page uses: the form on the
 * left, a photograph on the right. The photograph is not decoration. Onboarding
 * is the one moment a new member is doing admin for a group they haven't met,
 * and a picture of that group with a line about why the field matters is the
 * only argument available for why they should bother filling it in.
 *
 * Everything is a plain form control inside one `<form>` the caller wires to a
 * server action — the URL is the state, not React.
 */

const LABEL = "block text-sm font-medium";
const HINT = "type-meta mt-1.5";

/**
 * One photograph per step, each making the case for that step's fields.
 *
 * These are the same four shots the public sign-in page uses, and deliberately
 * only those four — the other three in `public/assets/` have personal content in
 * frame (see the note in app/signin/page.tsx). Alt text is copied from there so
 * the same image is described the same way in both places.
 */
const MEDIA: Record<
  OnboardingStep,
  { src: string; alt: string; eyebrow: string; line: string }
> = {
  role: {
    src: "/assets/pjx6.jpg",
    alt: "The Summer Fellowship 2025 cohort together at a Mentors Speed Dating session.",
    eyebrow: "The team",
    line: "Six departments. Your title is how people find the right one.",
  },
  about: {
    src: "/assets/pjx4.jpg",
    alt: "Fellows and a mentor at the Week 3 Social Capital workshop.",
    eyebrow: "Ask me about",
    line: "Someone here already knows the thing you're about to get stuck on.",
  },
  lootbox: {
    src: "/assets/pjx7.jpg",
    alt: "The team holding Move Forward booklets at the end of a programme evening.",
    eyebrow: "Off the clock",
    line: "Nobody remembers a job title. They remember the cat.",
  },
  reach: {
    src: "/assets/pjx1.jpg",
    alt: "A panel discussion in progress, with the team seated around the room.",
    eyebrow: "Remote-first",
    line: "Knowing when you're awake saves everyone a day.",
  },
};

/** Only the profile fields a step renders — not the whole Member row. */
export type OnboardingFormMember = {
  title: string | null;
  cohort: string | null;
  departmentId: string | null;
  bio: string | null;
  location: string | null;
  timezone: string | null;
  links: unknown;
  lootbox: unknown;
  expertise: { label: string }[];
};

type Links = { linkedin?: string | null; lark?: string | null; portfolio?: string | null };

/** The media column: photograph, scrim, and the line that argues for the step. */
function StepMedia({ step }: { step: OnboardingStep }) {
  const media = MEDIA[step];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-media bg-pxv-dark">
      <Image
        src={media.src}
        alt={media.alt}
        fill
        // The column is `hidden` below lg, and hidden is not unmounted — without
        // a near-zero width for narrow viewports a phone downloads a half-megabyte
        // photograph it will never show.
        sizes="(min-width: 1024px) 50vw, 1px"
        priority
        className="object-cover"
      />
      {/* Weighted to the bottom, where the text sits — a flat scrim over the
          whole frame would mute the photograph for no reason. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-pxv-dark via-pxv-dark/45 to-pxv-dark/5"
      />
      <div className="absolute inset-x-0 bottom-0 p-8 lg:p-10">
        <p className="type-label text-white/55">{media.eyebrow}</p>
        <p className="mt-2 max-w-sm text-[1.5rem] font-medium leading-[1.25] tracking-[-0.03em] text-white">
          {media.line}
        </p>
      </div>
    </div>
  );
}

/**
 * Four hairline segments rather than a percentage bar. The count is small and
 * knowable, so showing which of four you're on beats an abstract 50%.
 */
function StepProgress({ current }: { current: OnboardingStep }) {
  const index = STEPS.indexOf(current);

  return (
    <div>
      <p className="type-label">
        Step {index + 1} of {STEPS.length}
        {!STEP_META[current].required && <span className="ml-2 normal-case">· optional</span>}
      </p>
      <ol className="mt-2 flex gap-1.5" aria-hidden>
        {STEPS.map((step, position) => (
          <li
            key={step}
            className={cn(
              "h-0.5 flex-1 rounded-full transition-colors",
              position <= index ? "bg-primary" : "bg-border-strong",
            )}
          />
        ))}
      </ol>
    </div>
  );
}

/** Inline error for a required field the previous submit was missing. */
function Missing({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return <p className="type-meta mt-1.5 text-destructive">{children}</p>;
}

export function OnboardingStepView({
  step,
  member,
  departments,
  missing,
  pending,
  email,
  formId,
  action,
  footer,
}: {
  step: OnboardingStep;
  member: OnboardingFormMember;
  departments: { id: string; name: string }[];
  /** Field names the last submit rejected, from the URL. */
  missing: string[];
  /** Whether the account is still awaiting admin approval. */
  pending: boolean;
  email: string;
  formId: string;
  action: (formData: FormData) => void | Promise<void>;
  footer: React.ReactNode;
}) {
  const meta = STEP_META[step];
  const links = (member.links ?? {}) as Links;

  return (
    <AuthSplitShell
      wide
      aside={<StepMedia step={step} />}
      footer={
        <span>
          Signed in as <span className="text-foreground">{email}</span>
        </span>
      }
    >
      {pending && (
        // Repeated on every step rather than shown once: someone filling this in
        // deserves to know throughout that the wait and the form are independent
        // of each other.
        <p className="type-small mb-8 rounded-lg border border-border-strong bg-accent px-3.5 py-2.5 text-muted-foreground">
          An admin still has to approve your account. Filling this in now means you&rsquo;re in the
          directory the moment they do.
        </p>
      )}

      <StepProgress current={step} />

      <h1 className="type-display mt-5">{meta.title}</h1>
      <p className="type-body mt-2 text-muted-foreground">{meta.blurb}</p>

      <form id={formId} action={action} className="mt-8 space-y-5">
        <input type="hidden" name="step" value={step} />

        {step === "role" && (
          <>
            <div>
              <label className={LABEL} htmlFor="title">
                Title
              </label>
              <Input
                id="title"
                name="title"
                defaultValue={member.title ?? ""}
                placeholder="Program Lead"
                aria-invalid={missing.includes("title")}
                className="mt-1.5"
              />
              <Missing show={missing.includes("title")}>
                Teammates need something here — even &ldquo;Member&rdquo; beats blank.
              </Missing>
            </div>

            <div>
              <label className={LABEL} htmlFor="departmentId">
                Department
              </label>
              <div className="mt-1.5">
                <SelectField
                  id="departmentId"
                  name="departmentId"
                  defaultValue={member.departmentId ?? ""}
                  placeholder="Pick one…"
                  invalid={missing.includes("departmentId")}
                  options={departments.map((department) => ({
                    value: department.id,
                    label: department.name,
                  }))}
                />
              </div>
              <Missing show={missing.includes("departmentId")}>
                Pick the closest one — this is what the directory filters on.
              </Missing>
            </div>

            <div>
              <label className={LABEL} htmlFor="cohort">
                Cohort
              </label>
              <Input
                id="cohort"
                name="cohort"
                defaultValue={member.cohort ?? ""}
                placeholder="2025-2026"
                className="mt-1.5"
              />
              <p className={HINT}>Optional. The intake you joined with.</p>
            </div>
          </>
        )}

        {step === "about" && (
          <>
            <div>
              <label className={LABEL} htmlFor="expertise">
                Ask me about
              </label>
              <Input
                id="expertise"
                name="expertise"
                defaultValue={member.expertise.map((tag) => tag.label).join(", ")}
                placeholder="Curriculum design, Partnerships, Figma"
                aria-invalid={missing.includes("expertise")}
                aria-describedby="expertise-hint"
                className="mt-1.5"
              />
              <Missing show={missing.includes("expertise")}>
                At least one, please. This is how people find you.
              </Missing>
              <p id="expertise-hint" className={HINT}>
                Comma-separated, up to 12. &ldquo;Canva&rdquo; and &ldquo;Excel&rdquo; count —
                these are what teammates search by, not a CV.
              </p>
            </div>

            <div>
              <label className={LABEL} htmlFor="bio">
                Bio
              </label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={member.bio ?? ""}
                rows={4}
                placeholder="A couple of sentences about what you do here."
                className="mt-1.5"
              />
              <p className={HINT}>Optional, but it&rsquo;s the first thing people read.</p>
            </div>
          </>
        )}

        {step === "lootbox" && (
          <>
            <LootboxFields items={parseLootbox(member.lootbox)} />
            <p className={HINT}>
              Emoji or a public https:// image link, plus a short caption. Leave both blank to drop
              a slot.
            </p>
          </>
        )}

        {step === "reach" && (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={LABEL} htmlFor="location">
                  Location
                </label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={member.location ?? ""}
                  placeholder="Ho Chi Minh City"
                  className="mt-1.5"
                />
              </div>
              <div>
                <label className={LABEL} htmlFor="timezone">
                  Timezone
                </label>
                <Input
                  id="timezone"
                  name="timezone"
                  defaultValue={member.timezone ?? ""}
                  placeholder="Asia/Ho_Chi_Minh"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className={LABEL} htmlFor="linkedin">
                  LinkedIn
                </label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  defaultValue={links.linkedin ?? ""}
                  placeholder="linkedin.com/in/…"
                  className="mt-1.5"
                />
              </div>
              <div>
                <label className={LABEL} htmlFor="lark">
                  Lark handle
                </label>
                <Input id="lark" name="lark" defaultValue={links.lark ?? ""} className="mt-1.5" />
              </div>
              <div>
                <label className={LABEL} htmlFor="portfolio">
                  Portfolio
                </label>
                <Input
                  id="portfolio"
                  name="portfolio"
                  defaultValue={links.portfolio ?? ""}
                  className="mt-1.5"
                />
              </div>
            </div>
          </>
        )}
      </form>

      <div className="rule mt-10 flex flex-wrap items-center gap-3 pt-6">{footer}</div>
    </AuthSplitShell>
  );
}
