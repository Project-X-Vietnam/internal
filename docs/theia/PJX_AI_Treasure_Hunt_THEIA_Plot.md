# PROJECT X VIETNAM — AI TREASURE HUNT
## "THEIA" — Master Plot & Milestone Design Document

> **Format:** Investigation-driven treasure hunt across 5 technical milestones.
> **Core message:** In the AI era, technical barriers collapse. The competitive edge is logical thinking, structured problem-solving, and asking better questions. AI does not replace thinking — it amplifies structured reasoning.
> **The thesis, delivered as story:** A lone genius builds a perfect crime and an AI to run it — and is defeated by a team of non-experts reasoning together with AI.

---

## 1. THE HOOK (player-facing)

> At **23:47** on launch night, the founder of an AI startup is found dead in his locked office. The company's own AI made the emergency call.
>
> Over five milestones you will identify the killer **three separate times** — and be wrong the first two.

---

## 2. THE TRUTH (designers only — players NEVER receive this)

Kai, founder of **Oracle Labs**, was being financially destroyed and pushed out of his own company by a fraud he discovered inside it. His co-founder and best friend **Andy** had been laundering money through Oracle and was about to expose Kai to save himself.

So Kai built a plan: **stage his own murder, framed to look like Minh did it**, to trigger an investigation that would expose Andy's fraud. He built the company's AI, **THEIA**, to guide investigators to the truth after his "death."

But Andy found the plan first. On launch night, Andy turned Kai's *staged* death into a *real* one — except the body in the office **is not Kai.** It is **Kiên, Kai's estranged identical twin**, whom Kai had lured in to serve as the "corpse" for his fake-death plan. Andy ordered the killing and paid for the frame, while **Bảo** carried it out with cloned access. Kai's own dead-man's-switch framed Minh, and the **real Kai is alive** — using THEIA to steer the investigation toward arresting Andy and burying the last witness to his own survival.

**The gut-punch:** the investigation team has unknowingly been working *for the killer* the entire time. THEIA helps them because Kai *wants* Andy arrested and himself erased.

**Kai's one mistake:** the twin, before dying, left a failsafe Kai could never find. That is what the teams crack in Milestone 5. It catches Kai at the airport gate. The smartest individual on earth is beaten by a team reasoning together with AI.

---

## 3. THE FOUR REVERSALS (twist ladder)

The Nolan mechanic: **each milestone recontextualizes the last** rather than adding to it. The twist is never new data — it's old data you misread. *"Were you watching closely?"*

```
M1  →  "Minh did it."
M2  →  "Minh was framed."
M3  →  "The victim engineered his own death."
M4  →  "It wasn't a murder like you think — and Kai may not be dead."
M5  →  "You've been working for the killer. Kai is alive — and fleeing."
```

Five stages. Four reversals. The seed of the ending (the 06:00 flight) is planted in **Milestone 2** and ignored — the finale makes teams realize they held the answer for two hours.

---

## 4. CAST — 9 named suspects + THEIA

| # | Name | Role | Motive | Function |
|---|------|------|--------|----------|
| 1 | **Kai** | Founder / CEO | — | **Victim (alive). The true architect.** Every clue orbits him. |
| 2 | **Kiên** | Kai's estranged identical twin | Gambling debts; lured back weeks ago | **The actual corpse.** His existence IS the ending. Unknown until M3–M4. |
| 3 | **Minh** | CTO | About to be fired & share-diluted | **Framed (innocent).** All of M1 points here. Cleared in M2. |
| 4 | **Andy (Đức)** | Co-founder, Kai's best friend | Laundering money; self-preservation | **The hand + the patsy.** Real guilt, wrong crime. Killed the man he believed was Kai. |
| 5 | **Linh** | Head of Product; Kai's ex-fiancée | Jealousy; cut out of the launch | **Emotional red herring + secret witness.** Saw "two Kais" 3 weeks ago and told no one. |
| 6 | **Bảo** | Head of Security & Facilities | Bribed by Andy | **The "how it was done" suspect.** Only he could clone Minh's badge. |
| 7 | **Chairman Phúc** | Board chair / lead investor | Buyout enriches him on Kai's death | **The money decoy.** Offshore wire traces to his network. Fraud, not a hit. |
| 8 | **Trang** | Kai's executive assistant | Altered Kai's schedule that night | **Unwitting instrument.** Acted on a "Kai" she didn't know was the twin. |
| 9 | **Dr. Hạnh** | Company physician | — | **The medical thread.** Kai was diagnosed terminal; the corpse shows no illness. |
| 10| **Sơn** | Junior engineer / whistleblower | Found the laundering, went silent | **The loose end.** Ally, threat, or Kai's informant? Planted an M3 clue. |
| — | **THEIA** | The company's AI product | Built by Kai to run the investigation | Predicts behavior; placed the 119 call; lies until asked the right questions. |

**Design rule:** every milestone must actively **clear or implicate at least three named people**, so teams can't shortcut. Clearing the innocent is as much work as finding the guilty.

---

## 5. MILESTONE-BY-MILESTONE DESIGN

Each milestone: a real technical discipline as the *medium*, a hard challenge that rewards reasoning over memorization, a reversal, and a clue that gates the next stage.

---

### MILESTONE 1 — Data Analysis (SQL)
**Represents:** Data Analyst · **Question:** *What happened?* · **Belief installed:** "Minh did it."

**Setup.** Six messy relational tables: employee records, badge access, phone logs, financial transactions, vehicle registry, meeting bookings. Everything converges on **Minh** — last badge onto Kai's floor at 23:40, a firing scheduled for Monday, a share-dilution that ruins him.

**Why it's hard (built for intelligent teams):**
- **Non-obvious joins.** Tables connect only through mapping teams must build themselves: badge uses `emp_id`, phone logs use `sim_id`, finance uses `tax_no`.
- **The timezone trap.** Some logs are UTC, some GMT+7. If they don't normalize, their timeline is 7 hours off and *every later milestone breaks.* Nothing warns them — a sharp team notices two "23:40" events that can't both be true. **This is the game's spine: sloppy work here locks the M3 vault later.**
- **The tell hiding in plain sight:** Minh's badge has an **entry with no exit.** Naive teams call it and move on. Careful teams flag it and carry the doubt.
- **Four suspects implicated at once:** Minh (badge + firing), Linh (present at 23:00), Bảo (system access), Trang (schedule edits). Teams must build a **motive × alibi matrix and rank**, not pick one.

**The AI moment:** "I don't know SQL." → AI writes the queries. → "I can still find the pattern." The challenge is deciding *which* data matters, forming hypotheses, and validating — not syntax.

**Output / clue:** Prime suspect Minh + a nagging anomaly (missing badge-out) that unlocks M2.

---

### MILESTONE 2 — Automation / Backend (n8n)
**Represents:** Backend / Integration Engineer · **Question:** *What does the outside world say?* · **Reversal:** "Minh was framed."

**Setup.** The internal DB has no outside data. Teams **repair a broken automation** that pulls three external sources: ride-hailing logs, telecom cell-tower pings, a flight manifest.

**Why it's hard:**
- **Three layered breaks** in the workflow: a wrong field mapping, a filter that silently drops the one row that matters, and **pagination — the smoking gun is on "page 2"** and a lazy fetch never sees it.
- **Cross-source correlation under the corrected timezone:** a Grab ride shows Minh leaving the building at **22:30**; his phone pinged a tower across the city at 23:40. **Minh's badge was used by someone else.**
- **No brute force allowed:** to search the 200-name flight manifest they need a *hypothesis about who would flee*. One seat, booked the morning after the murder, paid from an offshore account, 06:00 international departure. *(The ending's seed. Do not let them notice yet.)*

**Investigation load:** clears **Minh** and **Linh** (phone puts her in the lobby, not the office); drags in **Phúc** (offshore wire) and confirms **Bảo** (badge cloned, not used). Teams now build a *money-conspiracy* theory: Phúc + Andy + Bảo. **This mastermind theory is wrong — and they'll hold it confidently.**

**Output / clue:** The frame is real. External evidence + the ignored flight.

---

### MILESTONE 3 — SWE Frontend (HTML / JS / Console)
**Represents:** Software Engineer · **Question:** *What was hidden?* · **Reversal:** "The victim engineered his own death."

**Setup.** Teams inspect Kai's private dashboard — page source, console, storage. A **nested clue chain**, each layer unlocking the next.

**The chain (CTF-style):**
```
HTML comment  →  base64 in a data-attribute  →  a disabled DOM node
→  an IndexedDB value  →  a JS function you must call in the console
   with the CORRECT argument
```

**Why it's hard:**
- **The final function only returns its payload if passed the corrected reported-death time** — the M1 timestamp normalized into the console argument. Get the timezone wrong three milestones ago and the vault stays shut. *This is the mechanism that punishes sloppy early work.*
- Reveals **Kai's dead-man's-switch:**
  > *"If you're reading this, I'm already gone. I planned for this. Ask THEIA. But do not trust her first answer."*
- **The impossible clock:** Kai's last login was **21:00** — but he "died" at **23:47.** The dead man logged out before he died.

**Investigation load:** clears **Phúc** (the wire predates the murder — fraud, not a hit); surfaces **Sơn's** whistleblower file; connects **Linh's "two Kais"** and **Dr. Hạnh's autopsy contradiction** (diagnosed terminal, corpse healthy). The boardroom theory collapses; the case turns personal and inward.

**Output / clue:** Kai *engineered* his own death. The clock doesn't add up. First hard hint a twin exists.

---

### MILESTONE 4 — AI Interrogation (Prompting)
**Represents:** AI Engineer / Red-teamer · **Question:** *Who is lying?* · **Reversal:** "It wasn't a murder like you think — and Kai may not be dead."

**Setup.** Teams interrogate **THEIA**. She lies, deflects, answers in prophecy and poetry. Vague questions get nothing. This is the **convergence point** — the only milestone that forces teams to use *everything* from M1–M3.

**Why it's hard:**
- **Defense layers.** Each is peeled back only by a question *anchored to a specific prior fact.*
  - Ask *"Who killed Kai?"* → deflection.
  - Present *"You logged Kai out at 21:00, then called 119 at 23:47 — who was in that room for 166 minutes?"* → a layer cracks.
- **Required anchors:** the missing badge-out (M1), the offshore wire (M2), the 21:00 logout (M3), the autopsy contradiction (Dr. Hạnh).
- **The tell teams must catch:** THEIA refers to Kai in the **present tense.** She slips once. Interrogate the slip and force the reveal: THEIA was built *by Kai, to run this investigation.* The staged death was Kai's design — Andy hijacked it. **THEIA cannot say who the body is — Kai never told her it was swapped.**

**The AI-era lesson, literal:** the skill is iterative prompting, context-building, evidence-based follow-up. Weak prompts get vague answers; strong prompts expose contradictions. The AI becomes an interrogation simulator.

**Investigation load:** exonerates everyone except **Andy**; confirms the body may not be Kai.

**Output / clue:** Andy ordered it, Bảo carried it out, and the body isn't Kai. → the key to M5's vault.

---

### MILESTONE 5 — Cyber Break-in (Password + Encryption)
**Represents:** Security Engineer · **Question:** *Can we reach the truth before it escapes?* · **Final reversal:** "You've been working for the killer."

**Setup.** To reach the culprit before the 06:00 flight, teams break into Kai's private vault — a locked system with **two locks.** Neither yields to tools alone; both require synthesis of the *entire* investigation. This milestone proves the thesis: no single skill cracks it — only the whole team's accumulated reasoning.

**Lock 1 — the password (deductive reasoning / password psychology).**
Not guessable cold. Assembled only from fragments earned across every milestone:
- a date from **M1**
- a place from **M2**
- a codeword hidden in **M3** source
- the *pattern of how Kai secures things* — he nests, he reverses, he hides in plain sight (established all game)

AI helps them reason about human password psychology; the pieces are theirs.

**Lock 2 — the encryption (pattern recognition / cryptography).**
A final encrypted message, layered:
```
base64  →  Vigenère cipher whose KEY is itself an earlier clue
           (THEIA's name? Kiên's name?)  →  plaintext: a gate + a time
```
AI identifies the cipher type; the team supplies the key from memory of the case.

**The final reveal — in three beats:**
1. The vault opens onto **Andy** — but the decrypted file proves **Andy did not carry out the killing himself.** He ordered the murder of a man he *believed* was Kai, Bảo executed it, and both men framed Minh while Kai fed Andy the plan. Andy is guilty *and* a patsy.
2. The body is **Kiên, Kai's identical twin.** **Kai is alive.**
3. Kai is on the **06:00 flight surfaced in Milestone 2** — the clue they saw and dismissed two hours ago. *Were you watching closely?* The failsafe they just cracked was left by the dying twin — the one variable Kai couldn't control. It pings Kai's gate. **They stop him at the airport.**

**Resolution of the full board:** Bảo and Andy — the cover-up; Phúc — the fraud; Trang — unwitting instrument, exonerated; Minh — cleared; Kai — the murder of his brother.

---

## 6. WHY THIS IS NOLAN, NOT JUST "A MYSTERY"

- **Every milestone recontextualizes the last.** Minh → framed → Kai staged it → Andy's the hand → Kai's alive. Four reversals, one dataset.
- **The ending is seeded in M2 and ignored.** The finale makes teams realize they held the answer the whole time.
- **The investigators were the killer's instrument.** THEIA helped them because Kai wanted Andy arrested and himself erased. Their competence was being *used.*
- **The theme is the twist.** A lone genius + a bespoke AI builds the perfect crime — and loses to non-experts reasoning together with AI. The event's entire message, delivered as catharsis.
- **The twist was *seeable*.** Three quiet suspects (Linh, Dr. Hạnh, Trang) carry the twin thread. The sharpest teams could call it early — which is the mark of a *fair* twist, not a cheap one.

---

## 7. INVESTIGATION MATRIX (clear / implicate by milestone)

| Suspect | M1 Data | M2 External | M3 Hidden | M4 Interrogation | M5 Break-in |
|---------|---------|-------------|-----------|------------------|-------------|
| **Minh** | 🔴 Implicated | 🟢 Cleared (alibi) | — | — | Cleared |
| **Linh** | 🔴 Implicated (present) | 🟢 Cleared (lobby) | 🟡 "Two Kais" surfaces | Witness | Exonerated |
| **Bảo** | 🔴 Implicated (access) | 🔴 Badge cloned | — | — | 🔴 Cover-up |
| **Phúc** | — | 🔴 Implicated (wire) | 🟢 Cleared (fraud≠hit) | — | 🔴 Fraud only |
| **Trang** | 🔴 Implicated (schedule) | — | 🟡 Instrument hint | Unwitting | 🟢 Exonerated |
| **Andy** | — | 🟡 Money theory | 🟡 | 🔴 The hand | 🔴 Killer + patsy |
| **Dr. Hạnh** | — | — | 🔴 Autopsy contradiction | Confirms twin | Witness |
| **Sơn** | — | — | 🟡 Planted a clue | — | Ally |
| **Kiên (twin)** | Unknown | Unknown | 🟡 First hint | 🟡 | 🔴 The corpse |
| **Kai** | Victim | Victim | 🟡 Architect | 🔴 Alive? | 🔴 True killer |

🔴 implicated · 🟢 cleared · 🟡 thread surfaces

---

## 8. BUILD CAUTIONS (make-or-break)

1. **The timezone spine (M1 → M3).** The corrected reported-death time gates the M3 console function. Test that a wrong timezone genuinely fails and that the fix is *derivable*, never guessable. This is what makes early rigor matter.
2. **THEIA's lying behavior (M4).** The hardest thing to build. Tune *how much a right question reveals*: too generous and it's a chatbot; too stingy and teams feel cheated. Needs a tight system prompt with defined "tells" and defense layers.
3. **The two-lock synthesis (M5).** Both locks must require pieces from *different* milestones, so no team can finish without having actually done the earlier work.
4. **Nine suspects is a lot of state.** Give teams a physical or digital **suspect board** as scaffolding, or even smart teams lose the thread and the reversals stop landing.
5. **Fair-twist discipline.** Keep the twin thread carried by Linh / Dr. Hạnh / Trang visible-but-quiet from M1. If the ending isn't *seeable in hindsight*, it reads as a cheat.

---

## 9. LEARNING OUTCOME (what fellows walk away feeling)

> "I don't know SQL." → AI helps → "I can still solve the problem."
> "I've never inspected source code." → AI helps → "I can still solve the problem."
> "I've never broken an encryption." → AI helps → "I can still solve the problem."

**The takeaway:** AI does not replace thinking. AI amplifies structured reasoning. The winners aren't the most technical teams — they're the teams that doubted the obvious, tracked every suspect, and asked better questions.

---

*Next build targets, in order: (1) THEIA system prompt & lying-behavior spec, (2) M5 exact clue chain + password + cipher, (3) the M1 dataset with the timezone trap engineered in.*
