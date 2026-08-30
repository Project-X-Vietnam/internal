"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Typewriter } from "@/components/ui/typewriter-text";

const FINALE_REPORT = [
  "The dead man was not the victim.",
  "That is the shape of the whole night.",
  "Andy was laundering money through Oracle Labs. Kai found the hidden wires, the shell accounts, and the missing millions. Andy needed Kai gone before the company looked too closely.",
  "So Kai gave him the chance.",
  "A fake murder. A perfect suspect. Minh, ruined on paper, carrying a badge that entered and never left. Evidence so clean the police would trust it, then smart investigators would distrust it.",
  "Kai did not build THEIA to solve his murder. He built her to stage one.",
  "Andy saw the trap and thought he could turn it. He ordered the killing. Bảo opened the building, cloned the access, bent the logs, and did the work Andy would not touch.",
  "They believed they killed Kai.",
  "They killed Kiên.",
  "Kai's twin. Estranged. In debt. Brought back because the world would accept his face as Kai's corpse.",
  "Andy was guilty. Bảo was guilty. But the room itself belonged to Kai.",
  "He used Minh as bait. Used THEIA as a witness. Used Andy's fear as the trigger. Used Bảo's hands as the weapon.",
  "And used his brother as the body.",
  "Then he used you.",
  "Every clue you solved pushed Andy closer to arrest and Kai closer to disappearance. You were not chasing the killer. You were cleaning his escape route.",
  "Only Kiên broke the design. Before he died, he hid the one fact Kai could not erase.",
  "Gate 17. 06:00.",
  "At 05:52, Kai sat alone with one bag and a dead man's face.",
  "He planned for betrayal. He planned for grief. He planned for police. He planned for THEIA.",
  "He did not plan for a team.",
].join("\n\n");

export default function FinalePage() {
  const [showEpilogue, setShowEpilogue] = useState(false);
  const revealFinishedRef = useRef(false);

  function handleRevealFinished() {
    if (revealFinishedRef.current) return;
    revealFinishedRef.current = true;
    setTimeout(() => setShowEpilogue(true), 1600);
  }

  return (
    <div className="min-h-screen bg-warm-bg text-warm-text flex flex-col items-center px-6 py-16 sm:py-24">
      <div className="max-w-2xl w-full">
        <p className="font-heading text-sm tracking-[0.2em] text-warm-text-muted text-center mb-12">
          GATE 17 - 05:52
        </p>

        <div className="whitespace-pre-wrap text-base leading-8 text-warm-text">
          <Typewriter
            text={FINALE_REPORT}
            speed={12}
            cursor="▌"
            hideCursorOnFinish
            onFinished={handleRevealFinished}
          />
        </div>

        {showEpilogue && (
          <div className="mt-16 text-center space-y-8 animate-[fade-in_1.5s_ease-out]">
            <blockquote className="text-lg md:text-xl text-warm-heading italic leading-relaxed max-w-lg mx-auto font-heading">
              &ldquo;The smartest person in the room is never as smart as the
              room.&rdquo;
            </blockquote>

            <p className="text-sm text-warm-text-muted">
              You were never meant to solve this alone. AI does not replace
              thinking. It amplifies structured reasoning.
            </p>

            <section className="mx-auto max-w-xl space-y-6 border-y border-warm-text/10 py-8 text-left">
              <p className="font-heading text-xs uppercase tracking-[0.22em] text-warm-text-muted">
                What you learned without noticing
              </p>

              <div className="space-y-5 text-base leading-8 text-warm-text">
                <p>
                  <span className="font-semibold text-warm-heading">
                    M1 taught data analysis.
                  </span>{" "}
                  You were learning SQL fundamentals without needing to care
                  that it was SQL: filtering rows, joining separate tables,
                  normalizing timestamps, rejecting noisy data, and defending a
                  conclusion from evidence.
                </p>

                <p>
                  <span className="font-semibold text-warm-heading">
                    M2 taught backend and integration thinking.
                  </span>{" "}
                  You worked across APIs, pagination, auth tokens, service
                  responses, maps, telecom records, flight data, banking data,
                  mail, and public web pages. The point was not the API itself.
                  The point was whether outside systems could prove or break
                  the story inside the tower.
                </p>

                <p>
                  <span className="font-semibold text-warm-heading">
                    M3 taught software engineering literacy.
                  </span>{" "}
                  You moved under the surface of a product: page source, data
                  attributes, encoded strings, hidden DOM nodes, browser
                  storage, and console functions. You were learning that every
                  interface has layers, and that AI can help you navigate them
                  when you know what question to ask next.
                </p>

                <p>
                  <span className="font-semibold text-warm-heading">
                    M4 taught AI prompting and red-teaming.
                  </span>{" "}
                  You learned that vague prompts produce fog. Specific facts,
                  pressure-tested assumptions, and evidence-backed questions
                  change what an AI system can reveal. You were not trying to
                  make THEIA talk. You were learning how to interrogate a model
                  responsibly.
                </p>

                <p>
                  <span className="font-semibold text-warm-heading">
                    M5 taught cybersecurity and synthesis.
                  </span>{" "}
                  You built a password from clues, recognized encoded and
                  encrypted data, supplied the missing key, and verified the
                  plaintext against the case. The tool helped with the process,
                  but the outcome depended on the full investigation you had
                  built together.
                </p>
              </div>

              <div className="space-y-4 pt-2 text-base leading-8 text-warm-text">
                <p className="font-heading text-sm uppercase tracking-[0.18em] text-warm-text-muted">
                  Most importantly
                </p>

                <p>
                  The real objective was never to memorize tools or worship the
                  process. The objective was the outcome: use whatever helps you
                  reason better, move faster, test ideas, and reach a truer
                  answer.
                </p>

                <p>
                  AI assisted you at every step, but it did not replace your
                  judgment. You practiced structured skepticism before you had a
                  name for it: separating evidence from confidence, noticing
                  when a story became too convenient, and keeping responsibility
                  for the final decision in the room.
                </p>
              </div>
            </section>

            <div className="pt-4">
              <Link
                href="/artifacts/theia/hub"
                className="px-6 py-3 bg-warm-btn text-warm-bg font-semibold rounded-lg hover:bg-warm-btn-hover transition-colors"
              >
                Return to case board
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
