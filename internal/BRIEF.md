# BRIEF.md — "THEIA" AI Treasure Hunt

## What we're building

A **hybrid** (partly browser, partly human-run) team detective treasure hunt for a PJX community event. Teams progress through **5 sequential milestones**, each themed on a real tech discipline. Every milestone is solved by using AI as a *thinking partner* (not by knowing the technology), and each unlocks the clue that gates the next. A single murder-mystery narrative runs across all five, with a Nolan-style plot that reverses four times.

**Design thesis:** technical barriers are low in the AI era; the real skill is logical thinking, forming hypotheses, and asking better questions. The game rewards reasoning, not memorization.

> Full narrative + designer-only solution lives in `PJX_AI_Treasure_Hunt_THEIA_Plot.md`. **Keep that file OUT of the client bundle / any repo the vibecoding AI reads freely — it contains the solution.**

---

## Architecture principle (read first)

The scope is too big to loop everything into one web app, and the budget is tiny (**~$50 of API credits total**). So:

- **The browser hosts the puzzle surfaces and the journey/gating.** It leads teams milestone to milestone and hosts the challenges that make sense to host.
- **Fellows do the AI thinking on their OWN devices and OWN LLM subscriptions** (ChatGPT/Claude/whatever they pay for). We do **not** proxy their prompting → their AI usage costs us **$0**.
- **What we can't control cheaply becomes a supervised human station.** Only the AI-interrogation milestone (M4) needs a controlled AI persona; it runs on a **facilitator's own subscription**, supervised.

**Net AI cost to run the event: ~$0.** The $50 is a dev/testing buffer, not an operating cost.

---

## Milestone hosting map

| # | Discipline | Where it runs | AI cost to us | Notes |
|---|-----------|---------------|---------------|-------|
| **M1** | Data Analysis | **Browser** | $0 | Client-side SQL sandbox. Fellows use own LLM to write queries. |
| **M2** | Automation / Backend | **Browser (light)** | $0 | "Fix the broken fetch" over mock API routes we host. (n8n optional — see below.) |
| **M3** | SWE Frontend | **Browser** | $0 | Instrumented page; console/DOM/storage clue chain. |
| **M4** | AI Interrogation | **Supervised human station** | ~$0 | THEIA persona on facilitator's own ChatGPT/Claude. See M4 section. |
| **M5** | Cyber Break-in | **Browser** | $0 | Password gate + layered cipher, validated server-side. |

---

## Core game loop

```
Team logs in → Milestone N → solve
→ (browser auto-validates)  OR  (facilitator marks cleared for M4)
→ unlock Milestone N+1 → repeat → finale
```

- **Sequential gating:** a team cannot access M(N+1) until M(N) is solved. Browser milestones validate server-side; M4 is unlocked by the supervising facilitator entering a code / marking the team cleared.
- **Progress is per-team, persistent** (refresh-safe, multi-device for a team). **Browser is the single source of truth for progress**, even for the human-run station.
- **Each milestone emits one "clue token"** that is often the *input* to a later milestone (e.g., the corrected time-of-death from M1 is the argument needed in M3; fragments from M1/M2/M3 build the M5 password). This cross-milestone dependency is the spine — persist earlier answers so later milestones can require them.

---

## Milestone build specs

### M1 — Data Analysis · Browser · $0
- Client-side **SQL playground** (sql.js / SQLite WASM) over a seeded 6-table dataset (employees, badge_access, phone_logs, transactions, vehicles, meetings). Read-only, isolated from app tables.
- Fellows paste the schema into their own LLM for query help. We host the data + auto-validate the submitted suspect/answer.
- **The timezone trap is intentional:** raw logs mix UTC and GMT+7. Do NOT normalize it for them — the puzzle is that they must, and the corrected timestamp gates M3.

### M2 — Automation / Backend · Browser (light) · $0
- We host **mock external API endpoints** as Next.js route handlers (ride logs, cell-tower pings, flight manifest) — static, free.
- Team task: **repair a broken data-fetch/transform** presented in-browser — wrong field mapping, a filter silently dropping the key row, and an **unpaginated call where the smoking-gun row is on page 2**.
- **Decision (default = light):** ship the lightweight in-browser "fix the fetch" version rather than a real n8n instance. Real n8n is an option only if authentic tooling is a hard requirement — it adds a self-hosted instance to babysit and a learning curve; not worth it for one event on this budget.

### M3 — SWE Frontend · Browser · $0
- A **deliberately instrumented page.** Clue chain: HTML comment → base64 in a `data-` attribute → disabled DOM node → IndexedDB value → a `console` function that only returns its payload when called with the **correct argument (the M1 corrected time-of-death)**.
- Fellows paste console output into their own LLM to decode. We host the page + validate.

### M4 — AI Interrogation · Supervised human station · ~$0
**The only milestone needing a controlled AI persona. It does NOT run in our web app and does NOT use our API credits.**

- **THEIA runs as a shared Custom GPT (ChatGPT) or Claude Project on the FACILITATOR'S own subscription.** System prompt, case evidence, and defense-layer rules live inside the GPT/Project config — never shown in chat.
- **A facilitator sits with the team** the whole time. Supervision means: persona can't leak or be overridden, and the facilitator **arbitrates** — confirms when a team genuinely cracks a defense layer, nudges teams flailing for the wrong reason, and prevents a lucky vague question from dumping the answer.
- Build the GPT/Project **once**; every facilitator uses the same link → consistent behavior across teams.
- Mechanic: THEIA lies/deflects; only questions **anchored to specific prior facts** (missing badge-out from M1, offshore wire from M2, 21:00 logout from M3, autopsy contradiction) peel back layers. The catch: THEIA slips into **present tense** about Kai → reveals he may be alive.
- **Fallback** if a facilitator has no paid sub: point that one station at our metered API — a few dollars total, since it's one supervised station, not open to all devices.
- When cleared, the facilitator enters the unlock in the facilitator dashboard → opens M5 for that team in the browser.

### M5 — Cyber Break-in · Browser · $0
- **Two-lock gate**, both validated server-side:
  1. **Password** assembled from clues across all milestones (Kai's legal name and DOB fragment from the archive, the Bitexco landmark from the opening brief, a codeword from M3, plus Kai's "nests/reverses/hides-in-plain-sight" pattern).
  2. **Layered cipher:** base64 → Vigenère whose **key is an earlier clue** → plaintext (a gate + a time).
- Fellows use their own LLM to identify the cipher method. Success triggers the finale reveal.

Each browser milestone screen needs: intro/framing card, the interactive puzzle, a submit box, and a success state that reveals the narrative beat + unlocks the next milestone.

---

## Tech stack (suggested)

- **Next.js (App Router)** — already scaffolded.
- **Server Actions / Route Handlers** for answer validation, clue unlocks, and the M2 mock APIs (keep all solutions server-side).
- **DB:** SQLite/Postgres (Prisma) for team progress. M1's query sandbox runs client-side (sql.js) against a **read-only seed** — never the app's own DB.
- **Auth:** lightweight team login (team name + join code). No full user accounts.
- **No app-hosted LLM required.** M4's AI lives on the facilitator's ChatGPT/Claude subscription (external). Only wire an API call if you use the M4 metered fallback.
- **State:** server is source of truth for progress; client just renders.

---

## Data model (starting point)

```
Team        { id, name, joinCode, currentMilestone, startedAt }
Progress    { teamId, milestone, solvedAt, cluesUnlocked[] }
Submission  { teamId, milestone, payload, correct, createdAt }   // anti-cheat + analytics
ClueToken   { teamId, key, value }   // e.g. "time_of_death", "password_fragment_2"
```

The M1 investigation dataset is **seed data**, separate from app tables.

---

## Facilitator dashboard (required, but simple)

- Live per-team progress + leaderboard.
- **Manual unlock control for M4:** the supervising facilitator marks a team "interrogation cleared," which opens M5 in the browser. This is how the human station and the web app stay in sync — browser remains the source of truth.

---

## Staffing / run-of-show note

The real constraint is now **people, not tech**: you need **one facilitator per team during the M4 interrogation window** (plus roaming supervision elsewhere). Staggered arrivals at M4 are fine; if teams bunch up, plan enough facilitators or a short queue. Design the run-of-show around interrogation-station throughput.

---

## Non-negotiable build rules

1. **No spoilers client-side.** Answers, the real culprit, cipher keys, and the M4 persona/system prompt live only server-side or inside the facilitator's private GPT/Project — never in the client bundle.
2. **Server-side validation** for every browser milestone submission.
3. **Cross-milestone dependencies must actually enforce.** M3's console function and M5's locks must be uncrackable without genuinely solving earlier milestones — not guessable.
4. **The timezone trap (M1) is intentional.** Don't fix it; the corrected timestamp gates M3.
5. **Difficulty is in the reasoning, not the tooling.** A non-expert with AI should clear the technical step in minutes; the challenge is deciding *what* to do.
6. **Budget discipline:** default to $0-AI browser milestones + facilitator-subscription M4. Only touch the $50 for the M4 fallback or dev/testing.

---

## Build order (recommended)

1. Scaffolding: team auth, progress state, milestone gating, facilitator dashboard with manual unlock, one placeholder puzzle end-to-end.
2. **M5 (locks)** and the **M4 Custom GPT/Project** first — highest design risk; prove they feel fair. (M4 is built outside the app.)
3. M1 SQL sandbox + seed dataset with the timezone trap.
4. M3 instrumented page + console-function gate.
5. M2 mock APIs + broken-fetch puzzle.
6. Narrative reveal screens + finale.

---

## Milestone → investigation question (for copy/UI)

```
M1 Data Analysis     → "What happened?"          → belief: Minh did it
M2 Automation/BE     → "What does the world say?" → reversal: Minh was framed
M3 SWE Frontend      → "What was hidden?"         → reversal: victim staged his death
M4 AI Interrogation  → "Who is lying?"            → reversal: not a normal murder; Kai may be alive
M5 Cyber Break-in    → "Can we reach the truth?"  → finale: catch Kai at the gate
```
