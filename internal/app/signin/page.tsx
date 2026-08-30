import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthCarousel, type Slide } from "@/components/platform/auth-carousel";
import { AuthSplitShell } from "@/components/platform/page";
import { Button } from "@/components/ui/button";
import { auth, signIn } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign in" };

const ERRORS: Record<string, string> = {
  OAuthAccountNotLinked: "That email is already registered with a different sign-in method.",
  AccessDenied: "Google declined the sign-in request.",
  Configuration: "Google sign-in isn't configured yet. Ask an admin to check the server settings.",
};

/**
 * Sign-in is the only page this platform serves to unauthenticated visitors,
 * so everything here is world-readable — including these photographs.
 *
 * They are program and cohort shots that already ship in this (public) repo and
 * already appear on /legacy/welcome. The individual portraits in the same folder
 * are deliberately NOT used here, and neither are the two group shots with
 * personal content in frame (a birthday slide, a private cafe photo). If the
 * team would rather show nothing to the public, delete this array — the shell
 * renders the form full-width without an `aside`.
 */
const SLIDES: Slide[] = [
  {
    src: "/assets/pjx6.jpg",
    alt: "The Summer Fellowship 2025 cohort together at a Mentors Speed Dating session.",
    caption: "Summer Fellowship 2025 — Mentors Speed Dating",
  },
  {
    src: "/assets/pjx4.jpg",
    alt: "Fellows and a mentor at the Week 3 Social Capital workshop.",
    caption: "Week 3 — Social Capital",
  },
  {
    src: "/assets/pjx1.jpg",
    alt: "A panel discussion in progress, with the team seated around the room.",
    caption: "Panel discussion — Global & Vietnamese perspectives",
  },
  {
    src: "/assets/pjx7.jpg",
    alt: "The team holding Move Forward booklets at the end of a programme evening.",
    caption: "Move Forward — closing night",
  },
];

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const { from, error } = await searchParams;

  // Already signed in? Let the guards decide where they belong.
  if (await auth()) redirect(from && from.startsWith("/") ? from : "/directory");

  const configured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  return (
    <AuthSplitShell
      aside={<AuthCarousel slides={SLIDES} />}
      footer={<span>Project X Vietnam — internal</span>}
    >
      <p className="type-label text-primary">Project X Vietnam</p>
      <h1 className="type-display mt-3">Welcome back</h1>
      <p className="type-body mt-3 text-muted-foreground">
        The team&rsquo;s own space — who we are, what we know, and what we&rsquo;ve built.
      </p>

      {error && (
        <p
          role="alert"
          className="type-small mt-8 rounded-lg border border-destructive/25 bg-destructive/[0.07] px-3 py-2 text-destructive"
        >
          {ERRORS[error] ?? "Sign-in failed. Please try again."}
        </p>
      )}

      {!configured ? (
        <p
          role="alert"
          className="type-small mt-8 rounded-lg border border-border-strong bg-muted px-3 py-2 text-muted-foreground"
        >
          Google sign-in isn&rsquo;t configured. Set{" "}
          <code className="font-mono">GOOGLE_CLIENT_ID</code> and{" "}
          <code className="font-mono">GOOGLE_CLIENT_SECRET</code> in{" "}
          <code className="font-mono">.env</code> — see{" "}
          <code className="font-mono">.env.example</code>.
        </p>
      ) : (
        <form
          className="mt-8"
          action={async () => {
            "use server";
            await signIn("google", {
              redirectTo: from && from.startsWith("/") ? from : "/directory",
            });
          }}
        >
          {/* Google is the only method there is — Auth.js is configured with one
              provider and membership is decided by the admin queue, so there is
              nothing to offer beside it and no divider to draw. */}
          <Button type="submit" variant="outline" size="lg" className="w-full">
            <GoogleMark />
            Continue with Google
          </Button>
        </form>
      )}

      <p className="type-meta mt-8">
        Members only. New here? Sign in and an admin will review your request.
      </p>
    </AuthSplitShell>
  );
}

/** Google's mark, in its own colours — the one place brand colour isn't ours. */
function GoogleMark() {
  return (
    <svg viewBox="0 0 18 18" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.47.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}
