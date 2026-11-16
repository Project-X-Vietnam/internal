import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { OnboardingStepView } from "@/components/platform/onboarding";
import { AuthShell } from "@/components/platform/page";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";
import { getCurrentMember } from "@/lib/auth-guards";
import { MemberStatus } from "@/lib/generated/prisma/enums";
import { saveOnboardingStep, skipOnboarding } from "@/lib/member-actions";
import { listDepartments } from "@/lib/members";
import {
  coreComplete,
  firstIncompleteStep,
  isStep,
  nextStep,
  previousStep,
  STEP_META,
  STEPS,
  type OnboardingStep,
} from "@/lib/onboarding";

export const metadata: Metadata = { title: "Set up your profile" };

type Search = { step?: string; missing?: string };

const DECLINED = {
  [MemberStatus.REJECTED]: {
    heading: "Request declined",
    body: "Your access request wasn't approved. If you think that's a mistake, reach out to a team admin directly.",
  },
  [MemberStatus.SUSPENDED]: {
    heading: "Access suspended",
    body: "Your account has been suspended. Reach out to a team admin if you need it restored.",
  },
} as const;

function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/signin" });
      }}
    >
      <Button type="submit" variant="ghost" size="sm">
        Sign out
      </Button>
    </form>
  );
}

/** The one-screen states: declined, suspended, and finished-but-still-waiting. */
function Notice({
  heading,
  body,
  email,
  children,
}: {
  heading: string;
  body: string;
  email: string;
  children?: React.ReactNode;
}) {
  return (
    <AuthShell>
      <p className="type-label text-primary">Project X Vietnam</p>
      <h1 className="type-display rule-subtle mt-3 pb-4">{heading}</h1>
      <p className="type-body mt-4 text-muted-foreground">{body}</p>
      <p className="type-meta mt-6">
        Signed in as <span className="text-foreground">{email}</span>
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {children}
        <SignOutButton />
      </div>
    </AuthShell>
  );
}

/**
 * Onboarding. Routing only — the steps themselves render in
 * components/platform/onboarding.tsx.
 *
 * Reachable while PENDING, which is the point: the Member row exists from the
 * first sign-in, so someone can describe themselves while an admin reviews them
 * and land in the directory fully formed the moment they're approved. It is also
 * where `requireApprovedMember` sends anyone who reached APPROVED without a
 * usable profile — bootstrap admins, and everyone approved before this existed.
 */
export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const member = await getCurrentMember();
  if (!member) redirect("/signin");

  // A decision, not a waiting room — no form for these two.
  if (member.status === MemberStatus.REJECTED || member.status === MemberStatus.SUSPENDED) {
    const { heading, body } = DECLINED[member.status];
    return <Notice heading={heading} body={body} email={member.email} />;
  }

  const params = await searchParams;
  const pending = member.status === MemberStatus.PENDING;

  // An explicit ?step wins, so Back and "Review answers" work. Otherwise resume
  // at the first unanswered thing — or treat them as done if they already
  // finished the flow once.
  //
  // `coreComplete` is part of the test rather than a separate check: without it,
  // anyone who reached ?step=done with a required field still empty would land
  // on the "You're set up" notice, and every link out of it would bounce them
  // straight back here. Incomplete means never finished, so they resume instead.
  const requested = isStep(params.step) ? params.step : null;
  const finished =
    (params.step === "done" || (!requested && Boolean(member.onboardedAt))) &&
    coreComplete(member);

  if (finished) {
    // Approved and set up: the payoff is the directory they just joined, with
    // their own card in it. No interstitial to click through. (`finished`
    // already implies a complete profile, so status is the only thing left to
    // check.)
    if (!pending) redirect("/directory");

    return (
      <Notice
        // A real apostrophe, not `&rsquo;` — JSX decodes entities in text
        // children, never in a string prop, so the entity would render literally.
        heading="You’re set up"
        body={
          pending
            ? "Your profile is ready. An admin still needs to approve your account — you'll drop straight into the directory once they do."
            : "Your profile is saved."
        }
        email={member.email}
      >
        <Button asChild variant="outline" size="sm">
          <Link href={`/welcome?step=${STEPS[0]}`}>Review answers</Link>
        </Button>
      </Notice>
    );
  }

  const step: OnboardingStep = requested ?? firstIncompleteStep(member);
  const missing = (params.missing ?? "").split(",").filter(Boolean);
  const previous = previousStep(step);
  const isLast = nextStep(step) === null;

  // Only the department step needs the list; the other three shouldn't pay for it.
  const departments = step === "role" ? await listDepartments() : [];

  return (
    <OnboardingStepView
      step={step}
      member={member}
      departments={departments}
      missing={missing}
      pending={pending}
      email={member.email}
      formId="onboarding-step"
      action={saveOnboardingStep}
      footer={
        <>
          <Button type="submit" form="onboarding-step">
            {isLast ? "Finish" : "Continue"}
          </Button>

          {previous && (
            <Button asChild variant="ghost" size="sm">
              <Link href={`/welcome?step=${previous}`}>Back</Link>
            </Button>
          )}

          {/* Only optional steps can be walked past. The required ones have no
              skip because the directory cannot work without their answers. */}
          {!STEP_META[step].required && (
            <form action={skipOnboarding} className="ml-auto">
              <Button type="submit" variant="ghost" size="sm">
                Skip the rest
              </Button>
            </form>
          )}
        </>
      }
    />
  );
}
