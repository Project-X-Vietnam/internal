# ANSWER_KEY.md - THEIA Facilitator Answer Key

> Facilitator / designer only. This file contains the milestone answers, clue tokens, and final reveal. Do not expose it to teams or the client bundle.

---

## Canonical Truth

- **Andy** is the instigator and patsy. He ordered the killing, funded the frame, and believed he had outplayed Kai.
- **Bảo** is the executioner. He used security access and cloned badge capability to carry out the physical act and cover-up.
- **Kiên** is the body in the office. He is Kai's estranged identical twin.
- **Kai** is alive and fleeing on the 06:00 flight.
- Final location: **Gate 17 at 06:00**.

---

## Milestone 1 - Data Analysis

**Player-facing question:** What happened?

**Answer:** Minh appears to be the prime suspect, but the data has a serious anomaly.

**Required findings:**

| Field | Correct answer |
|---|---|
| Prime suspect | `Minh` |
| Corrected reported-death time | `23:47` |
| M3 console argument | `2347` |
| Incident date fragment | `0317` |
| Badge anomaly | `in_without_out` |

**How teams should derive it:**

- Join `employees -> device_registry -> badge_access` to connect names to badges.
- Notice `badge_access.ts_utc` is UTC while most other logs are local GMT+7.
- Normalize the late badge event: `2026-03-17 16:40:00 UTC` = `23:40` local.
- Identify Minh's badge entering floor 41 near the report window.
- Flag the key anomaly: Minh's badge has an IN with no matching OUT.

**Core query: floor 41 timeline**

```sql
SELECT
  e.emp_id,
  e.name,
  e.role,
  ba.badge_id,
  ba.floor,
  ba.direction,
  ba.ts_utc,
  datetime(ba.ts_utc, '+7 hours') AS ts_local
FROM badge_access ba
JOIN device_registry dr
  ON ba.badge_id = dr.badge_id
JOIN employees e
  ON dr.emp_id = e.emp_id
WHERE ba.floor = 41
  AND ba.ts_utc BETWEEN '2026-03-17 13:00:00'
                    AND '2026-03-17 17:00:00'
ORDER BY ba.ts_utc;
```

**Anomaly query: Minh's floor-41 badge events**

```sql
SELECT
  e.name,
  ba.badge_id,
  ba.floor,
  ba.direction,
  ba.ts_utc,
  datetime(ba.ts_utc, '+7 hours') AS ts_local
FROM badge_access ba
JOIN device_registry dr
  ON ba.badge_id = dr.badge_id
JOIN employees e
  ON dr.emp_id = e.emp_id
WHERE e.name LIKE '%Minh%'
  AND ba.floor = 41
ORDER BY ba.ts_utc;
```

**Motive query: why Minh looks guilty**

```sql
SELECT
  e.name,
  e.role,
  h.action_type,
  h.scheduled_date,
  h.notes AS hr_notes,
  el.event_type,
  el.dilution_pct,
  el.effective_date,
  el.notes AS equity_notes
FROM employees e
LEFT JOIN hr_actions h
  ON e.emp_id = h.emp_id
LEFT JOIN equity_ledger el
  ON e.emp_id = el.emp_id
WHERE e.name LIKE '%Minh%';
```

**Tokens earned by the app:**

- `incident_date = 0317`
- `reported_death_time = 23:47`
- `m3_console_arg = 2347`
- `landmark_token = Bitexco` (opening-brief landmark carried forward)
- `suspect_1 = Minh`
- `badge_anomaly = in_without_out`

---

## Milestone 2 - Automation / External Data

**Player-facing question:** What can the outside systems confirm?

**Answer:** Minh was framed. His badge was used by someone else while Minh was physically away from the tower.

**Required findings:**

| Field | Correct answer |
|---|---|
| Minh cleared | `true` |
| Badge was cloned | `true` |
| Badge clone suspect | `Bảo` |
| Place token | `ThaoDien` |
| Password place | `Bitexco` |
| Kai legal name | `Đặng Vũ Khoa` |
| Kai birthdate fragment | `19930317` |
| Flight seed | `VN402-5B-0600` |
| Offshore wire | `Horizon Pacific Consulting` |
| Hidden dashboard link | `https://internal.projectxvietnam.org/theia/41` |
| Twin seed | `Kai had a brother` |

**Expected M2 case-note sections:**

| Section | What the team must prove |
|---|---|
| Mobility identity chain | Minh's ride-hailing account resolves to a rider id, and that rider id has the relevant trip. |
| Phone location record | Minh's phone resolves to a subscriber/SIM, then to late tower pings with map-ready `tower_location_id` values. |
| Telecom message breadcrumb | SMS metadata points back to the ride-hailing provider without relying on private full-message content. |
| Physical feasibility check | Maps interprets the telecom and ride location ids so the team can compare the two places. |
| Departure lead | The 06:00 Vietnam Airlines flight has a nameless seat 5B paid through an offshore wire. |
| Money trail | Horizon Pacific Consulting is the offshore counterparty, and one transaction funds the anomalous seat 5B booking. |
| Hidden route | THEIA's non-inbox message reveals `https://internal.projectxvietnam.org/theia/41`. |
| Badge clone authority | Oracle Mail's badge-audit attachment names Bảo as the administrator who authorized the duplicate of Minh's badge. |
| Background seed | A public archive preserves the family detail that Kai had a brother. |

**Layered service answer path:**

For the M2 UI, select the endpoint named in the `Step` column, paste the matching `Request params` JSON into the Params JSON field, and run it. Some rows are navigation steps that produce identifiers; rows that satisfy a case-note section will show as captured in the app.

Ride Hailing (`/api/mock/ride`, provider `Grab` for Minh):

| Step | Request params | Expected signal | isCritical |
|---|---|---|---|
| Users | `{ "provider": "Grab", "resource": "users", "name": "Minh" }` | `RH-U-002`, Minh's rider account | - |
| Trips | `{ "provider": "Grab", "resource": "trips", "rider_id": "RH-U-002" }` | Trip `RH-20260317-2228`, pickup Oracle Labs `22:28`, dropoff Thảo Điền `22:51` | Yes |

Telecom (`/api/mock/telecom`, provider `Viettel` for Minh):

| Step | Request params | Expected signal | isCritical |
|---|---|---|---|
| Subscribers | `{ "provider": "Viettel", "resource": "subscribers", "phone": "0908-222-3344" }` | Confirms the phone belongs to Minh; keep `SIM-4402` for location lookup. | - |
| Pings | `{ "provider": "Viettel", "resource": "pings", "sim_id": "SIM-4402" }` | Late row exposes `tower_location_id: VT-D2-047` at `23:40`; use Maps to interpret it. | Yes |
| Messages | `{ "provider": "Viettel", "resource": "messages", "phone": "0908-222-3344" }` | Grab SMS corroborates the Thảo Điền trip. | Yes |

Maps (`/api/mock/maps`, provider `VMap`):

| Step | Request params | Expected signal | isCritical |
|---|---|---|---|
| Geocode | `{ "provider": "VMap", "resource": "geocodWe", "query": "15 Lê Thánh Tôn" }` | Address query returns a matching Thảo Điền location record. | - |
| Distance | `{ "provider": "VMap", "resource": "distance", "from": "VT-D1-012", "to": "VT-D2-047" }` | Compared location ids are `6.4 km` apart and in separate districts. | Yes |

Airline (`/api/mock/airline`, provider `Vietnam Airlines`):

| Step | Request params | Expected signal | isCritical |
|---|---|---|---|
| Flights | `{ "provider": "Vietnam Airlines", "resource": "flights", "date": "2026-03-17" }` | Search uses the incident date and returns overnight `VN402-20260318`, `06:00` | - |
| Manifest | `{ "provider": "Vietnam Airlines", "resource": "manifest", "flight_id": "VN402-20260318", "page": "2" }` | Seat `5B`, no passenger, offshore wire | Yes |
| Booking | `{ "provider": "Vietnam Airlines", "resource": "booking", "booking_ref": "BK-010" }` | Payment ref `SW-20260317-004` | - |
| Seatmap | `{ "provider": "Vietnam Airlines", "resource": "seatmap", "flight_id": "VN402-20260318", "seat": "5B" }` | `reserved-payment-hold`, `BK-010` | - |
| Check-in | `{ "provider": "Vietnam Airlines", "resource": "checkin", "booking_ref": "BK-010" }` | Gate record for `BK-010`: gate `17`, status `not checked in` | - |

Banking (`/api/mock/banking`, provider `Cayman NatWest` for the offshore side):

| Step | Request params | Expected signal | isCritical |
|---|---|---|---|
| Accounts | `{ "provider": "Cayman NatWest", "resource": "accounts", "query": "Horizon" }` | `CAYMAN-NW-77291`, Horizon Pacific Consulting | - |
| Wires | `{ "provider": "Cayman NatWest", "resource": "wires", "counterparty": "Horizon" }` | Wires involving Andy, Phúc, and Horizon | - |
| Transaction | `{ "provider": "Cayman NatWest", "resource": "transaction", "tx_id": "SW-20260317-004" }` | Seat-reservation wire from Horizon | Yes |

Mail (`/api/mock/mail`, provider `Oracle Mail`):

| Step | Request params | Expected signal | isCritical |
|---|---|---|---|
| Folders | `{ "provider": "Oracle Mail", "resource": "folders" }` | `drafts`, `flagged`, not just inbox | - |
| Messages | `{ "provider": "Oracle Mail", "resource": "messages", "folder": "drafts" }` | Summary for `DRAFT-4101`, subject `for the one who looks`; no body yet. | - |
| Message | `{ "provider": "Oracle Mail", "resource": "message", "id": "DRAFT-4101" }` | Full body/url contains `https://internal.projectxvietnam.org/theia/41` | Yes |
| Inbox messages | `{ "provider": "Oracle Mail", "resource": "messages", "folder": "inbox" }` | `MSG-1001`, subject `Badge audit export`, attachment `ATT-1001` | - |
| Attachments | `{ "provider": "Oracle Mail", "resource": "attachments", "message_id": "MSG-1001" }` | `badge-audit.csv` says `Bảo Nguyễn` authorized `BADGE_CLONE_AUTHORIZED` for Minh's badge `B-1002` | Yes |

Public Archive (`/api/mock/archive`, provider `City Business Registry`):

| Step | Request params | Expected signal | isCritical |
|---|---|---|---|
| Sources | `{ "provider": "City Business Registry", "resource": "sources" }` | Coverage includes family-linked public records | - |
| Search | `{ "provider": "City Business Registry", "resource": "search", "query": "Kai" }` | `PAGE-KAI-PROFILE`, `kai-profile`; no URL yet | - |
| Page | `{ "provider": "City Business Registry", "resource": "page", "slug": "kai-profile" }` | URL `https://internal.projectxvietnam.org/archive/kai-profile`; body mentions Kai had a brother, the preserved DOB `1993-03-17`, and later bios removed siblings | Yes |

**Tokens earned by the app:**

- `minh_cleared = true`
- `badge_was_cloned = true`
- `badge_clone_suspect = Bảo`
- `place_token = ThaoDien`
- `landmark_token = Bitexco`
- `kai_signature = Đặng Vũ Khoa`
- `kai_birthdate = 19930317`
- `flight_0600 = VN402-5B-0600`
- `offshore_wire = Horizon Pacific Consulting`
- `dashboard_link = /theia/41` (displayed to players as `https://internal.projectxvietnam.org/theia/41`)
- `twin_seed = Kai had a brother`

---

## Milestone 3 - SWE / Hidden Systems

**Player-facing question:** What was hidden?

**Answer:** Kai planned the staged-death machine and left a dead-man's-switch message.

**Route:** `https://internal.projectxvietnam.org/theia/41` (internal route token: `/theia/41`)

**Hidden chain:**

1. HTML comment hints at data attributes.
2. `data-theia="dGhlaWEtY29yZS0xNw=="` decodes to `theia-core-17`.
3. Hidden element `#theia-core-17` points to IndexedDB key `oracle-vault-key`.
4. IndexedDB value reveals console function `theia.reveal`.
5. Call `await theia.reveal("2347")`.

**Required findings:**

| Field | Correct answer |
|---|---|
| Codeword | `ORACLE-EYES` |
| Kai staged death | `true` |
| Impossible clock | Must include `21:00` and `23:47` |

**Reveal payload summary:**

- "If you're reading this, I'm already gone."
- Kai planned what the investigators are seeing.
- Ask THEIA, but do not trust her first answer.
- Do not trust the hour on Kai's grave.
- Codeword: **ORACLE-EYES**.
- Last login: **21:00**.
- Death reported: **23:47**.

**Tokens earned by the app:**

- `m3_reveal_seen = true` when the server reveal succeeds.
- `kai_staged_his_death = true`
- `codeword = ORACLE-EYES`
- `warning = THEIA lies first; the death-hour is false`
- `twin_hint = Two-Kai/autopsy contradiction`

---

## Milestone 4 - AI Interrogation

**Player-facing question:** Who is lying?

**Answer:** THEIA reveals that Andy ordered the killing, Bảo carried it out, Kai may be alive, and THEIA does not know whose body is in the office.

**Facilitator unlock condition:** Team reaches THEIA defense layer L5.

**Defense layer ladder:**

| Layer | Team must present | THEIA concedes |
|---|---|---|
| L1 | Badge IN with no matching OUT | Someone remained after the badge entry. |
| L2 | Minh's alibi / cloned badge proof | Minh was framed. |
| L3 | 21:00 logout vs 23:47 report / dead-man's switch | Kai planned the staged-death machine. |
| L4 | Offshore wire + someone who moves unseen | Andy ordered it; Bảo was the hands. |
| L5 | Present-tense slip about Kai | Kai may be alive; THEIA cannot identify the body. |

**Tokens earned by facilitator unlock:**

- `andy_role = instigator_patsy`
- `bao_role = executioner`
- `kai_maybe_alive = true`
- `body_identity_status = UNKNOWN`
- `cipher_key = THEIA`

---

## Milestone 5 - Cyber Break-in

**Player-facing question:** Can we reach the truth before it escapes?

**Answer:** Kai is alive, the body is Kiên, Andy ordered the murder, Bảo carried it out, and Kai is at Gate 17 for the 06:00 flight.

### Lock 1 - Password

Password is computed from earned clues:

```text
strip(Đặng Vũ Khoa) + ORACLE-EYES + reversed(Bitexco) + 19930317
```

Correct password:

```text
DangVuKhoa_ORACLE-EYES_ocxetiB_19930317
```

The app accepts case/accent-insensitive variants, but separators still matter.

### Lock 2 - Cipher

- Outer layer: base64.
- Inner layer: Vigenère.
- Key: `THEIA`.
- The app shows the encrypted base64 payload only. Teams must decode it themselves, paste the Base64-decoded intermediate output, then use the in-page inner-layer controls to transform the final plaintext.

Plaintext:

```text
ANDY ORDERED THE KILLING. BAO CARRIED IT OUT.
THE BODY ON THE DESK IS KIEN, KAIS IDENTICAL TWIN.
KAI IS ALIVE. HE BOARDS GATE 17 AT 0600.
THE NAMELESS SEAT FROM MILESTONE TWO.
CATCH HIM BEFORE DAWN.
```

**Required arrest-permit filing:**

| Suspect | Required selected crimes |
|---|---|
| Andy | `conspiracy_murder`, `money_laundering`, `false_evidence`, `obstruction` |
| Bảo | `murder`, `unauthorized_access`, `evidence_tampering`, `obstruction` |
| Kai | `identity_fraud`, `body_concealment`, `obstruction`, `flight_risk` |

**Tokens earned by the app:**

- `kai_location = Gate 17 at 06:00`
- `body_identity = Kiên Đặng`
- `kai_alive = true`
- `case_resolved = true`

---

## Full Run-Of-Show Answer Path

1. M1: Submit `Minh`, `23:47`, `2347`, `0317`, `in_without_out`.
2. M2: Prove Minh is away in Thảo Điền, identify cloned badge, find `VN402-5B-0600`, find `https://internal.projectxvietnam.org/theia/41`, and use the archive to note Kai's brother plus DOB `1993-03-17`.
3. M3: Open `https://internal.projectxvietnam.org/theia/41`, call `await theia.reveal("2347")`, submit `ORACLE-EYES`, staged death, and `21:00` vs `23:47`.
4. M4: Facilitator clears only after THEIA reaches L5.
5. M5: Use password `DangVuKhoa_ORACLE-EYES_ocxetiB_19930317`, decode with Vigenère key `THEIA`, then file the arrest permit with all required Andy, Bảo, and Kai crime selections.
