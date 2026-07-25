"use client";

export function M4Puzzle() {
  return (
    <div className="space-y-6">
      {/* Atmospheric framing */}
      <div className="p-6 rounded-xl bg-warm-surface border border-warm-border space-y-3">
        <p className="text-sm text-warm-text leading-relaxed italic">
          She answers in weather and riddles. She grieves beautifully and
          tells you nothing. Ask her who killed Kai and she gives you poetry.
        </p>
        <p className="text-sm text-warm-text leading-relaxed">
          THEIA was in the room the whole time. She watched. She recorded. She
          knows what happened between 21:00 and 23:47 — the missing minutes,
          the locked door, the body that may not be who everyone believes it is.
        </p>
        <p className="text-sm text-warm-text leading-relaxed">
          But she was built by a man who anticipated this exact interrogation.
          She will not hand her truth to anyone who hasn&apos;t earned it.
        </p>
      </div>

      {/* Station info */}
      <div className="p-5 rounded-xl bg-warm-accent/5 border border-warm-accent/15">
        <p className="font-heading text-xs text-warm-accent uppercase tracking-wider mb-2">
          Interrogation station
        </p>
        <p className="text-sm text-warm-text leading-relaxed">
          THEIA is waiting at the supervised station. A facilitator will
          oversee your session and confirm when you&apos;ve broken through.
        </p>
      </div>

      {/* Instructions */}
      <div className="space-y-4">
        <div className="p-5 rounded-lg bg-warm-surface border border-warm-border">
          <p className="text-sm font-heading text-warm-heading mb-2">
            Bring your evidence
          </p>
          <p className="text-xs text-warm-text-muted leading-relaxed">
            THEIA only yields to specific facts. Vague questions get fog.
            The badge that entered without leaving. The alibi that broke the
            frame. The offshore wire. The impossible clock. The dead-man&apos;s
            warning. Every fact you&apos;ve earned is a key to a different
            lock in her defenses.
          </p>
        </div>

        <div className="p-5 rounded-lg bg-warm-surface border border-warm-border">
          <p className="text-sm font-heading text-warm-heading mb-2">
            Listen for the slip
          </p>
          <p className="text-xs text-warm-text-muted leading-relaxed">
            THEIA grieves, deflects, and lies. But she sometimes forgets
            to grieve. Pay attention to her tense — how she speaks about
            Kai. The difference between &ldquo;was&rdquo; and
            &ldquo;is&rdquo; may be the most important word in the
            entire case.
          </p>
        </div>
      </div>

      {/* Waiting indicator */}
      <div className="p-6 rounded-xl bg-warm-surface border border-dashed border-warm-border text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="inline-block w-2 h-2 rounded-full bg-warm-accent animate-pulse" />
          <p className="text-sm text-warm-accent">
            The interrogation is in progress
          </p>
        </div>
        <p className="text-xs text-warm-text-faint">
          Your facilitator will unlock Milestone 5 when THEIA&apos;s
          last defense falls.
        </p>
      </div>
    </div>
  );
}
