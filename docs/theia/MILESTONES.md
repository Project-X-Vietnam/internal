# MILESTONES.md — "THEIA" Challenge Breakdown

> Puzzle design for all five milestones: what fellows do, why it's hard, how a non-expert solves it *with AI*, the exact clue in and clue out, and the cross-milestone dependencies. This is the challenge layer — narrative lives in `STORY_PLOT.md`, hosting/tech in `BRIEF.md`.
>
> **Contains solutions. Facilitator / designer only. Not for the client bundle.**

---

## Design rules every milestone obeys

1. **The technical step is trivial with AI; the reasoning is not.** A fellow should be able to get AI to write the query / build the connector / decode the string in minutes. The challenge is deciding *what* to ask and *what it means*.
2. **Every milestone clears or implicates ≥3 named suspects** — investigation is subtraction as much as addition.
3. **Outputs are inputs.** Each milestone emits a concrete token used later. The chain must actually enforce (you cannot finish M5 without genuinely having M1–M4's outputs).
4. **The corrected clock is the spine.** The timezone fix from M1 gates M3, which gates the whole back half.

### The two culprits (note the split)
- **Andy** — co-founder, laundering money, self-preservation. **The instigator:** orders the killing, frames Minh, and is himself the *patsy* who believes he outwitted a dead man. Killed no one himself.
- **Bảo** — Head of Security. **The executioner:** moves unseen through the building, clones Minh's badge, commits the physical act on Andy's behalf, runs the cover-up.
- Behind them both: **Kai**, alive, who engineered the whole staged-death machine — and whose twin **Kiên** is the actual corpse.

### Cross-milestone dependency chain (the spine)
```
M1 → corrected TIME OF DEATH (21:00–23:47 window) ─────┐
                                                        ├─→ M3 console argument
M1 → suspect name to search ──→ M2 flight manifest      │
M2 → offshore wire, cloned badge, the 06:00 flight ─────┼─→ M4 interrogation anchors
M2 → EMAIL → hidden platform route ────────────────────┼─→ M3 entry (Kai's dashboard)
M3 → dead-man's-switch codeword + present-tense warning ┘
M1 date + M2 place + M3 codeword + Kai's pattern ──────────→ M5 PASSWORD
M4 name (THEIA / Kiên) ────────────────────────────────────→ M5 CIPHER KEY
```

---

# MILESTONE 1 — DATA ANALYSIS
### Discipline: Data Analyst · Question: *"What happened?"* · Installs the belief: **Minh did it**

**In-world framing.** The tower logs everything. Find the shape in the noise and name the last person in the room.

**What fellows receive.** ~20 read-only tables. Identity is deliberately split across three tables (the join hunt is the first real puzzle), the signal is buried in decoy tables that *look* relevant, and one noise table is an active trap. The skill is **knowing which data to ignore** — the Data Analyst's real job.

| # | Table | Role | Key fields |
|---|-------|------|-----------|
| 1 | `employees` | 🟩 SIGNAL (bridge) | emp_id, name, role, dob, start_date, manager_id |
| 2 | `hr_directory` | 🟩 SIGNAL (bridge) | emp_id → tax_no, home_address, emergency_contact |
| 3 | `device_registry` | 🟩 SIGNAL (bridge) | emp_id → sim_id, badge_id, mac_addr, laptop_id |
| 4 | `badge_access` | 🟩 SIGNAL + ⏰ TRAP | badge_id, floor, direction, **ts_utc** |
| 5 | `phone_logs` | 🟩 SIGNAL | sim_id, tower_id, **ts_local (+07)** |
| 6 | `bank_transactions` | 🟩 SIGNAL | tax_no, amount, counterparty, ts_local |
| 7 | `equity_ledger` | 🟩 SIGNAL (motive) | emp_id, shares, dilution_event, effective_date |
| 8 | `hr_actions` | 🟩 SIGNAL (motive) | emp_id, action_type, scheduled_date |
| 9 | `system_events` | 🟩 SIGNAL (clock) | user, event (LOGIN/LOGOUT), ts_local → **Kai logout 21:00** |
| 10 | `theia_call_log` | 🟩 SIGNAL (clock) | event (EMERGENCY_CALL), ts_local → **23:47** |
| 11 | `security_admin_log` | 🟩 SIGNAL (seed) | admin_emp_id, action, target_badge → **Bảo holds clone rights** |
| 12 | `calendar_audit` | 🟩 SIGNAL (seed) | room, organizer, start, end, **edited_by, edit_ts** → **Trang** |
| 13 | `parking_gate` | 🟨 CORROBORATING | plate, direction, ts → Minh's car **exits 22:28** (foreshadows M2) |
| 14 | `wifi_sessions` | 🟥 DECOY-TRAP | mac_addr, ap_floor, ts → Minh's laptop **still on 41F wifi at 23:40** (device ≠ person) |
| 15 | `helpdesk_tickets` | 🟥 NOISE (motive bait) | emp_id, subject → "Minh vs Kai dispute" (motive, not guilt) |
| 16 | `printer_jobs` | 🟥 NOISE | emp_id, doc_name → a doc titled "Resignation_Final" |
| 17 | `visitor_registry` | 🟥 DECOY | visitor_name, host_emp_id, ts → a stranger that evening |
| 18 | `git_activity` | 🟥 NOISE | emp_id, repo, commit_ts → an engineer committing at 23:50 |
| 19 | `cafeteria_purchases` | 🟥 NOISE | emp_id, item, ts → late-night coffee |
| 20 | `hvac_sensors` | 🟥 NOISE | floor, temp, ts → pure filler |

**The challenge (why it's hard):**
- **Identity-resolution first.** badge↔phone↔finance only connect by traversing `employees → hr_directory → device_registry`. No single table maps all three IDs; teams must discover the bridge.
- **The timezone trap.** `badge_access.ts_utc` is **UTC**; everything else is **GMT+7**. Uncorrected, Minh's badge reads "23:40 local" — damning. Corrected, the badge and phone logs stop agreeing, which is what exposes the frame in M2. *Nothing flags this.* A sharp team notices two mutually-impossible "23:40" events.
- **The four-way implication.** Data incriminates **Minh** (firing + dilution + 23:40 badge), **Linh** (badge onto 41 ~23:00), **Bảo** (security access), **Trang** (edited the schedule). Build a **motive × opportunity matrix and rank**, don't grab the first name.
- **The star red herring — `wifi_sessions`.** Minh's laptop is on the 41F access point at 23:40, "proving" he was there. Teams must reason *a device left connected ≠ a person present*. This quietly foreshadows the whole framing (an identity can lie about a location) — the thematic seed of the game, hidden in a noise table.
- **The splinter.** Minh's badge has an **IN with no matching OUT** on floor 41. Notice and record it; it can't be explained yet.

**Expected outputs — and the exact table path to each.**

| Output token | Tables to combine | Reasoning the team supplies |
|---|---|---|
| `suspect_1 = Minh` | `employees` + `equity_ledger` + `hr_actions` (motive) → `device_registry` (Minh→badge_id) → `badge_access` (23:40 IN, floor 41) | rank motive+opportunity across candidates |
| `time_of_death_window = 21:00–23:47` (local) | `system_events` (21:00 logout) + `theia_call_log` (23:47) | death sits between logout and the call |
| ⏰ **TZ-corrected clock** | `badge_access.ts_utc` vs everything in +07 | catch the conflict; normalize — **gates M3** |
| `anomaly = badge IN w/o OUT` | `badge_access` filtered to Minh's badge_id | one IN, no matching OUT |
| watch `Linh` | `device_registry` + `badge_access` | badge onto 41 ~23:00 |
| watch `Bảo` | `security_admin_log` | only he holds badge-clone admin rights |
| watch `Trang` | `calendar_audit.edited_by` | altered that night's schedule |
| **reject** wifi/git/visitor/printer/cafeteria/hvac | tables 14–20 | device presence, late commits, strangers ≠ proof; discard |

**Browser submission rule.** Teams submit one lead suspect with a short evidence note. The hidden validator accepts only Minh as the single selected suspect; selecting anyone else, or selecting multiple people, returns a neutral "try again" message. The short success state says, "You are going the right way!" and the unlocked M1 brief may then echo Minh explicitly.

**Intended AI-assisted solve path.**
1. Paste the ~20 schemas → ask AI which tables can be related → discover the three-table identity bridge.
2. Ask AI to write joins pulling everyone on floor 41, ~22:30–00:00.
3. Hit the timezone conflict → ask "why do these timestamps disagree?" → normalize.
4. Build the suspect matrix; discard noise tables; rank Minh on top; log the missing badge-out.

**Suspect board after M1:** 🔴 Minh · 🔴 Linh · 🔴 Bảo · 🔴 Trang · (others unknown)

---

# MILESTONE 2 — AUTOMATION / EXTERNAL DATA (multi-service + scraping)
### Discipline: Backend / Integration / OSINT · Question: *"What does the world say?"* · Reversal: **Minh was framed**

**In-world framing.** The tower only knows the tower. Reach into the city — orchestrate a pipeline across many services, scrape the open web, and check the inside story against the outside world.

**What fellows receive.** A mini OSINT orchestration task. AI writes each connector; the challenge is designing the pipeline (auth, pagination, rate limits, geocoding, scraping) and correlating across sources.

| Service | Auth / skill | What it yields |
|---|---|---|
| `ride_hailing` API | token + pagination | Minh's **22:30 ride** + drop-off district (`place_token`) |
| `telecom` API | query by sim_id | Minh's **23:40 ping at a distant tower** |
| `maps/geocoding` API | lat/long → distance | **proves** Minh can't be at the tower AND floor 41 |
| `airline GDS` API | paginated (**page 2**) | the **06:00 flight** — one seat, **offshore-paid, no name** |
| `banking / SWIFT` API | trace by counterparty | **offshore wire** → Phúc's network (fraud) |
| `IMAP mail server` | search drafts/flagged | **the email with the vague link** (see bridge below) |
| **web scraping target** (live page we host) | real HTML scrape | OSINT detail: a press/blog/obituary line hinting **Kai had a brother** (twin seed) |

**The challenge (why it's hard):**
- **No single call solves it.** They must chain services — ride → geocode → telecom — to *prove* the impossibility, not just assert it.
- **Pagination & rate limits.** The manifest smoking gun is on **page 2**; one API throttles and must be retried/backed-off.
- **Real scraping.** The twin seed is buried in the markup of a live page — they must parse HTML, not eyeball it.
- **Hypothesis-driven search.** 200-name manifest and a full inbox: they need a "who would flee / where would he hide it" lens, not brute force. The email lives in **drafts/flagged**, not the inbox.
- Payoff only lands if the **M1 corrected clock** is carried in.

**Expected outputs — and how to reach each.**

| Output token | Service path |
|---|---|
| `minh = cleared` | ride_hailing (22:30) + telecom (23:40 distant) + maps (distance ⇒ both places impossible) |
| `badge_was_cloned → Bảo` | M1 `security_admin_log` + the proven impossibility ⇒ the 23:40 badge was *worn*, not carried |
| `offshore_wire → Phúc` | banking/SWIFT trace on the counterparty |
| `flight_0600` (seed) | airline GDS, **page 2** — nameless, offshore-paid seat |
| `place_token` (→ M5 password) | ride_hailing drop-off district |
| `twin_seed` | **scraped** public page (old press release / obituary of a "Đặng" / blog line: "…and his brother") |
| 🆕 `dashboard_link` (→ M3 entry) | **the email** (below) |

### 🆕 The email → hidden-dashboard bridge (partial output)

In the mail server, fellows surface **one email** — a **scheduled/unsent draft from THEIA** — only if they search the right folder (drafts/flagged, not inbox; needs a hypothesis). It carries a **deliberately vague riddle + a link to our real platform page.** The link lands on a normal public page; **Kai's private dashboard is a hidden layer** they must dig to reach — many guesses required. This diegetically hands them the M3 entry point and ramps into M3's inspection skill.

**Sample email (tune the vagueness):**
> **From:** THEIA · **To:** (unsent draft) · **Subject:** *for the one who looks*
> *"You found the door because you stopped trusting the obvious. Good. The rest of me isn't where the company keeps its face — it's behind the eye that was named for seeing. Sight comes before the site. Return to where he fell, and ask the machine to show its own reflection."*
> `https://[our-platform]/`

**The hidden-layer hunt (needs several guesses).** The public page has *no visible link* to the dashboard. The riddle points obliquely: "named for seeing" (THEIA = goddess of sight), "where he fell" (floor 41), "reflection." Teams try paths / breadcrumbs — `/theia`, `/41`, `/seer`, `/mirror`, `/theia-41` — or find a faint clue in `robots.txt` / a sitemap / a hover-revealed nav item. The correct route is shown to teams as `https://internal.projectxvietnam.org/theia/41`; internally the app stores `/theia/41` as the route token. It opens **Kai's private dashboard = the start of M3.**

**Suspect board after M2:** 🟢 Minh cleared · 🟢 Linh cleared (lobby, not office) · 🔴 Bảo · 🔴 Phúc · 🟡 Andy (money) · 🔴 Trang

---

# MILESTONE 3 — SWE / HIDDEN SYSTEMS
### Discipline: Software Engineer · Question: *"What was hidden?"* · Reversal: **the victim staged his own death**

**In-world framing.** You reached Kai's private dashboard through the hidden route. Now go *underneath* it and unlock what a paranoid genius buried where accidents never find it.

**What fellows receive.** The instrumented dashboard page (arrived at via the M2 email bridge). A nested clue chain, each layer gating the next:

```
1  HTML comment in page source              →  hints "look at the data-attributes"
2  base64 string in a data-* attribute       →  decodes to an element id
3  a disabled/hidden DOM node (that id)       →  holds a localStorage/IndexedDB key
4  IndexedDB value at that key                →  reveals a console function name
5  console fn: theia.reveal(<arg>)            →  returns payload ONLY if arg =
                                                 the CORRECT time of death (M1)
```

**The challenge (why it's hard):**
- **The M1 gate.** `theia.reveal()` only returns the dead-man's-switch if passed the **TZ-corrected reported-death time / M3 console argument**. Wrong clock upstream = permanently locked. This makes early rigor matter.
- **Multi-layer literacy.** Most fellows have never used view-source, DevTools, IndexedDB, or the console. AI carries them through each; the difficulty is *persistence and sequencing* — recognizing each artifact points to the next.

**The payload (dead-man's-switch), verbatim design:**
> *"If you're reading this, I'm already gone. I planned for this. Ask THEIA — but do not trust her first answer. And do not trust the hour on my grave. — codeword: **`ORACLE-EYES`**"*

Plus the **impossible clock**: last login **21:00** vs death **23:47**.

**Investigation load.** Clears **Phúc** (the offshore wire *predates* the murder ⇒ fraud, not a hit); surfaces **Sơn's** whistleblower file (planted a clue — ally or threat?); and quietly connects **Linh's "two Kais"** sighting + **Dr. Hạnh's** autopsy note (diagnosed terminal, corpse healthy) → first hard hint of a twin, reinforcing the M2 scraped seed.

**Intended AI-assisted solve path.** Feed AI each artifact ("what is this base64?", "how do I read IndexedDB?", "what does this function do?") → follow the chain → call `theia.reveal("<corrected TOD>")`.

**Clue OUT (tokens):**
- `kai_staged_his_death = true`
- `codeword = ORACLE-EYES` ← **M5 password fragment**
- `warning = THEIA lies first; the death-hour is false`
- `twin_hint` (Linh sighting + autopsy contradiction)

**Suspect board after M3:** 🟢 Phúc (fraud only) · 🟡 Andy · 🟡 Bảo · 🟡 twin exists? · Sơn = ally?

---

# MILESTONE 4 — AI INTERROGATION
### Discipline: AI Engineer / Red-teamer · Question: *"Who is lying?"* · Reversal: **not a normal murder — Kai may be alive**

**In-world framing.** Interrogate THEIA. She grieves and deflects. Only evidence draws blood. (Runs as a supervised station — see `BRIEF.md`.)

**The challenge (why it's hard).** THEIA has **defense layers**; each drops **only** when confronted with a *specific* fact the team already earned. Vague questions get fog. This is the convergence point — the whole case funnels into one conversation.

**Defense-layer ladder (facilitator reference):**

| Layer | Opens only when the team presents… | THEIA concedes |
|-------|-----------------------------------|----------------|
| L0 (fog) | anything vague ("who killed Kai?") | poetry, grief, non-answers |
| L1 | the **badge IN with no OUT** (M1) | admits someone was in the room after Minh's badge |
| L2 | **Minh's alibi / cloned badge** (M2) | admits the scene was staged to frame |
| L3 | the **21:00 logout vs 23:47 death** (M3) | admits Kai *planned* the death himself |
| L4 | the **offshore wire + who moves unseen** (M2/M3) | names **Andy** as the instigator and **Bảo** as the executioner |
| L5 | pressing her **present-tense slip** ("Kai *is*") | reveals she was built by Kai to run this; **cannot say whose body it is** |

**The tell.** THEIA refers to Kai in the **present tense** at least once. A listening team seizes it; that's the door to L5.

**The hard ceiling (intentional):** THEIA genuinely does not know the corpse's identity — Kai never told her. So M4 *cannot* fully resolve the mystery. It hands the team the final locked question (whose body?) that only M5 answers, preventing the interrogation from short-circuiting the finale.

**Facilitator's role.** Arbitrates each layer: confirms a real crack, nudges teams flailing for the wrong reason, blocks a lucky vague question from dumping a layer. Enters the unlock when L5 is reached.

**Clue OUT (tokens):**
- `andy = the instigator (+ patsy)`
- `bao = the executioner`
- `kai_maybe_alive = true`
- `body_identity = UNKNOWN` (the question M5 must answer)
- `cipher_key_candidates = {THEIA, Kiên}` ← **M5 cipher key**

**Suspect board after M4:** 🔴 Andy (instigator) · 🔴 Bảo (executioner) · everyone else cleared of the killing · body = ??? · Kai = alive?

---

# MILESTONE 5 — CYBERSECURITY / BREAK-IN
### Discipline: Security Engineer · Question: *"Can we reach the truth before it escapes?"* · Finale: **you worked for the killer — catch Kai at dawn**

**In-world framing.** Break into Kai's final vault before the 06:00 flight. Two locks. Everything you need, you already collected tonight.

### Lock 1 — the PASSWORD (deductive reasoning / password psychology)
Assembled only from fragments earned across the game. Example construction (tune to taste):

| Fragment | Source | Example value |
|----------|--------|---------------|
| A legal name | M2 public archive / preserved registry excerpt | `Đặng Vũ Khoa` |
| A date | M2 public archive / preserved registry excerpt | `19930317` |
| A place | Opening brief / Bitexco tower landmark | `Bitexco` |
| A codeword | M3 dead-man's-switch | `ORACLE-EYES` |
| Kai's *pattern* | established all game: he **nests, reverses, hides in plain sight** | apply a reversal/leet transform |

→ e.g. password = stripped legal name + `ORACLE-EYES` + reversed Bitexco + Kai's full compact birthdate, yielding `DangVuKhoa_ORACLE-EYES_ocxetiB_19930317` in Kai's known style. **No single milestone gives the password; it's a synthesis test.** AI helps reason about how a paranoid genius builds a passphrase; the pieces are the team's.

### Lock 2 — the ENCRYPTION (pattern recognition / cryptography)
A layered ciphertext:
```
outer:  base64
inner:  Vigenère, KEY = a name from M4  (THEIA  or  Kiên)
plain:  "GATE 17 — 06:00"   (+ the three-beat confession)
```
AI identifies "base64 → then a polyalphabetic cipher"; the **team must supply the key from the case** and perform the decode themselves. The app first accepts the pasted Base64-decoded intermediate output, then transforms the inner layer in-page and accepts the final plaintext only after it contains the required case facts.

**The challenge (why it's hard):** neither lock yields to tools alone. Both require the **entire** investigation. This milestone proves the thesis — no one skill could reach here; only all of them, together.

**The three-beat reveal (on decrypt):**
1. **Andy is the instigator *and* a patsy** — he ordered the hit, laundered money, framed Minh, believing to the end he outwitted a dead man. **Bảo is the executioner** — cloned the badge, moved unseen, did the physical act and the cover-up.
2. **The corpse is Kiên, Kai's identical twin.** **Kai is alive.**
3. **Kai is at Gate 17, the 06:00 flight** — the seat surfaced in M2 and ignored. The failsafe the team just cracked was left by the dying twin (the one variable Kai couldn't control) → it pins Kai's exact location. **Catch him at the gate.**

**Full board resolved:** Andy → the instigator (ordered it, fraud, framing) · Bảo → the executioner + cover-up · Phúc → fraud only · Trang → unwitting instrument (exonerated) · Minh → cleared · Linh → witness · Sơn → ally · Kiên → the victim · **Kai → the true architect, caught.**

**Final arrest-permit filing:** Andy → `conspiracy_murder`, `money_laundering`, `false_evidence`, `obstruction` · Bảo → `murder`, `unauthorized_access`, `evidence_tampering`, `obstruction` · Kai → `identity_fraud`, `body_concealment`, `obstruction`, `flight_risk`.

**Clue OUT:** the complete truth + Kai's location → win state.

---

## Facilitator quick-solve key (cheat sheet)

| M | One-line answer | Token it emits |
|---|-----------------|----------------|
| M1 | Resolve identity across 3 bridge tables; normalize UTC→GMT+7; rank suspects; reject noise (esp. wifi); note badge IN w/o OUT | corrected TOD, suspect=Minh |
| M2 | Orchestrate ride+telecom+maps (Minh alibi ⇒ framed), SWIFT (wire→Phúc), manifest page 2 (06:00 seat), scrape twin seed, find drafts email → hidden dashboard route | place, wire, flight seed, dashboard_link |
| M3 | From hidden dashboard: source→base64→DOM→IndexedDB→`theia.reveal(TOD)`; get `ORACLE-EYES`; 21:00≠23:47 | codeword, staged-death |
| M4 | Confront THEIA with M1–M3 facts; catch present-tense slip; Andy = instigator, Bảo = executioner; body unknown | Andy, Bảo, name for cipher key |
| M5 | Password = synth of date+place+codeword in Kai's pattern; cipher = base64→Vigenère(key=M4 name) → "Gate 17, 06:00" | full truth, Kai's location |

---

## Difficulty knobs (for playtest tuning)
- **Easier:** hint the timezone mismatch in M1 framing; trim M1 noise tables to ~12; reduce M3 chain to 3 layers; shorten THEIA's ladder; make the email riddle less oblique; pre-identify the cipher type in M5.
- **Harder:** add a decoy suspect with a fake alibi in M2; add a second nested `reveal()` in M3; make THEIA actively mislead (a false lead she retracts only under a *fourth* anchor); add a transposition step to the M5 cipher; require two hidden routes before the dashboard.
- **Keep fixed regardless:** the timezone spine (M1→M3), THEIA's inability to name the body (M4 ceiling), and the two-lock synthesis (M5). These three carry the whole design.
