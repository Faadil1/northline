# Custody Passport — Frontend Implementation Handoff

**Day 6 · “30 Days of Real Business Problems” · Visual-to-Frontend Translation**
Approved direction: **Modular Custody Passport + Transfer Imprint**
Stack implemented: React 18 + Vite + TypeScript, local component state (useReducer), plain CSS tokens, mocked frozen data. No backend, no auth, no GPS, no tracking UI.

---

## 1. Visual reading

The approved direction is a **cumulative operational document**, not a dashboard. Each physical handoff occupies one numbered sheet; sheets hang on a shared vertical document spine and accumulate permanently. Reading the two approved frames, the non-negotiable principles are:

1. **One document, one spine.** Sheets are sequential sections of a single custody document. They must never drift apart into an unrelated card grid.
2. **State is expressed three ways at once**: label text (OPEN / INCOMPLETE, LOCKED, EXPIRED), border treatment (dashed = open/editable; solid = locked; red = expired), and a restrained gray / olive / green / red palette. Color is never the only signal.
3. **The Transfer Imprint is green, permanent, and embedded inside the sheet** — a settled record block, not a toast, modal, badge, or animation event.
4. **Condensed uppercase typography is reserved for short labels, states, and identifiers** (sheet numbers, LOAD LD-4821, status lines). Names, operators, and explanatory sentences use readable sentence-case body type.
5. **Serious operational-document tone**: near-square corners, 1px rules, warm off-white sheet interiors on a gray work surface, dark near-black sheet header bands. No gradients, glassmorphism, pills, fake paper, decorative stamps, or celebratory motion.
6. **The sender stays visibly accountable** in every pending and expired frame. The Current Custodian summary is always present and always names the accountable organization.

## 2. Component architecture

Implemented component tree (files under `src/`):

```
App (state/CustodyContext.tsx — reducer, single source of truth)
└── pages/Home.tsx
    ├── RoleSwitcher                    (DEMO ONLY)
    ├── Reset control                   (DEMO ONLY)
    ├── LiveAnnouncer                   (aria-live status region)
    ├── ReceiverSurface
    │   ├── PassportDocument
    │   │   ├── PassportSheet (Sheet 01, locked — origin record)
    │   │   └── PassportSheet (Sheet 02: open | locked | expired)
    │   │       ├── VerificationChecklist     (open only)
    │   │       ├── AcceptanceAction          (open only)
    │   │       ├── TransferImprint           (locked only)
    │   │       ├── ExceptionRecord           (expired only)
    │   │       └── ExceptionAssignment       (expired only)
    │   └── CurrentCustodianSummary (rail)
    ├── DispatcherView
    │   ├── PassportDocument (shared)
    │   ├── CurrentCustodianSummary
    │   ├── Handoff monitor (status table)
    │   └── Timeout simulation (DEMO trigger for expiry)
    └── CustomerPassportMobile
        ├── CurrentCustodianSummary (compact)
        ├── Load detail block
        └── Permanent history list
```

Component specifications:

| Component | Responsibility | Key props | Variants / visual states | User actions | Accessibility |
|---|---|---|---|---|---|
| `PassportDocument` | Cumulative document; owns spine and sheet order | — | Sheet 01 always locked; Sheet 02 open/locked/expired (mutually exclusive) | none | Sheets labelled `aria-label="Sheet 02 — …"` |
| `PassportSheet` | One sheet: status band + state headline + body | `number`, `status`, `statusText`, `kind`, `settling` | `--open` dashed body, `--locked` solid, `--expired` red tint/border; `--settling` band transition | none | `article` with descriptive label |
| `CurrentCustodianSummary` | Names the accountable organization right now | `compact` | sender-accountable / receiver-accepted; single quiet confirm pulse on update | none | `aria-label="Current custodian"` |
| `VerificationChecklist` | The five required checks | via context | interactive only while Sheet 02 is open; disabled during settling | toggle 4 checkboxes, pick 1 condition radio | `role="group"`, live “n of 5 complete”, real labelled inputs |
| `AcceptanceAction` | The only custody-moving control | via context | disabled (with reason) / enabled / accepting | accept custody | `aria-describedby` reason text always visible |
| `TransferImprint` | Permanent acceptance record inside the sheet | `acceptedAt`, `settling` | settling (one-time 1.5 s settle) / settled | none (never editable, never removable) | `aria-label="Transfer Imprint"`, `<dl>` facts |
| `ExceptionRecord` | Expired-handoff fact display | via context | expired only | none | plain text facts, not color-only |
| `ExceptionAssignment` | Assign exception owner | via context | unassigned (red action) / assigned (record panel) | assign owner | `role="status"` on assigned panel |
| `CustomerPassportMobile` | Customer view in priority order | via context | open / locked / expired history entries | none | linear single column, ≥15.5 px body |
| `RoleSwitcher` | Demo role switching only | via context | pressed state | switch role | `aria-pressed`, labelled “demonstration only” |

## 3. Design tokens

All tokens live at the top of `src/index.css` as CSS custom properties. No brand system was invented; values are extracted from the approved frames.

**Surfaces** — app `#E3E7E6`, panel `#D4D9D8`, sheet interior `#F7F5EF`, raised paper `#FCFBF7`, status band `#181813`.
**Ink** — primary `#1C1C18`, soft `#45453F`, mute `#6F6F66`, on-band `#E8E6DD`.
**Lines** — `#C6CAC3`, strong `#9BA097`, spine `#B3B8B1`.
**Pending (open)** — label `#8A8757`, state ink `#6E6C43`, dashed 1px boundary.
**Accepted / locked / imprint** — green `#2E6B4C`, deep `#1F4D37`, tint `#E9F1EA`.
**Expired / exception** — red `#9C3A28`, deep `#7C2B1D`, tint `#F6E3DD`, line `#8E2F22`.
**Focus** — 2px solid `#1C1C18`, offset 2px (always visible, never removed).
**Disabled** — bg `#D8D9D2`, ink `#8B8B82`, plus a text explanation (never color-only).
**Type** — labels: Barlow Condensed 600–700, uppercase, 0.05–0.1 em tracking, 13–19 px; body: Inter 400–700, 13.5–15.5 px, 1.5 line-height; document title 24 px.
**Metrics** — document max 1120 px, sheet max 760 px, radius 2 px everywhere (no pills).
**Motion** — single easing `cubic-bezier(0.22, 1, 0.36, 1)` (settle, no overshoot).

## 4. Responsive behavior

- **1440 × 900 (desktop capture):** document column + 300 px sticky rail (custody summary, monitor/priority block). Matches the approved wide frame.
- **Smaller desktop (≤960 px):** rail drops below the document; single column; sheet interior paddings hold.
- **Customer mobile view (≤640 px and the Customer surface generally):** max 420 px column; order is fixed by the customer priority list — current custodian first, then receiver/acceptance time, then load/seal/units/condition, then permanent prior sheets. Checklist rows grow to ≥44 px touch targets; body type steps to 15.5 px.
- **Sheets never become cards:** at every width the spine persists as the left vertical rule; sheets keep full-width attachment to it and stack vertically with consistent 26 px rhythm. There is no breakpoint where sheets reflow into a grid.

## 5. Interaction specification

| Interaction | Response |
|---|---|
| Request handoff | Pre-state per the frozen spike: demo begins at Sheet 02 OPEN / INCOMPLETE, sender accountable. |
| Complete a check | Checkbox fills, row ink turns green-deep, live counter reads “n of 5 complete”. Condition is a GOOD / DAMAGED / SHORTAGE radio segment, not a bare checkbox. |
| Enable ACCEPT CUSTODY | Only when 5/5 pass (hard gate in the reducer, not just the UI). Disabled reason text updates: “Complete all five verification checks (n of 5).” |
| Accept custody | Button locks to “Recording acceptance…”, all inputs freeze, imprint settle sequence runs (§6). |
| Imprint settles | Sheet 02 becomes LOCKED; green imprint embedded; custody summary flips to Northline with one quiet background pulse; live region announces the change. |
| Custody summary updates | Derives from sheet state only — sender until acceptance, receiver after. No independent override exists. |
| Timeout | Dispatcher demo trigger expires the request: Sheet 02 EXPIRED, red record, sender still accountable, “Next action due: 4:30 PM”. Impossible after acceptance (reducer guard). |
| Exception assignment | ASSIGN EXCEPTION OWNER → Jordan Lee; next action becomes “Contact Northline dispatch”. Custody unchanged, stated in writing on the panel. |
| Reset between branches | RESET DEMO returns to Sheet 02 OPEN with cleared checks and no exception owner, preserving the selected role. Accepted and expired can never coexist — one `sheet02` field, one branch at a time. |

## 6. Signature motion

The 8–12 second signature path is the *whole* interaction: read lede (~2 s) → five checks (~4–6 s) → accept (~1 s) → settle (~2.4 s). The settle sequence itself:

- **Duration:** 2400 ms total. **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` — decelerating, no overshoot, no bounce.
- **0–400 ms:** button holds “Recording acceptance…” (cursor: wait). Everything else static.
- **400–1900 ms:** imprint block fades 0→1 opacity while translating −6 px → 0; its left rule draws from 1 px to 4 px. Simultaneously the sheet status band crossfades near-black → deep green.
- **1900–2400 ms:** sheet state headline flips to SHEET 02 — LOCKED; dashed boundary becomes solid; custody summary runs one 900 ms background pulse (green tint → paper).
- **Static throughout:** Sheet 01, the spine, the document head, and all historical content. Nothing historical ever moves.
- **Final frame:** locked sheet, settled imprint, green spine node, receiver named as current custodian. No confetti, glow, or celebration anywhere.
- **Reduced motion:** `prefers-reduced-motion` collapses all animation to ≤1 ms and the reducer settles in 300 ms — states change instantly, text still announces.

## 7. State consistency audit

Contradictions Claude Code must avoid (all guarded in `src/state/CustodyContext.tsx`):

1. **Accepted and expired must never coexist.** Enforced by a single `sheet02: 'open' | 'locked' | 'expired'` field — branches are one value, not two booleans.
2. **EXPIRE after acceptance** must be a no-op (reducer guards on `sheet02 !== 'open'`). The dispatcher expiry trigger unmounts when the sheet locks.
3. **Custody must never be “unknown” or empty.** The summary derives directly from sheet state; there is no code path that renders NO ACTIVE CUSTODIAN, CUSTODY UNKNOWN, AUTO ACCEPTED, FORCE ACCEPTANCE, or ACCEPTED BY ADMIN.
4. **Expiry and exception assignment never move custody.** Both the expired sheet and the assigned panel say “Charlotte Origin Hub remains accountable” in text.
5. **Exactly one imprint per sheet.** The imprint renders only inside the locked Sheet 02 and has no remove/edit affordance.
6. **Sheet 01 never re-renders differently.** It is frozen mocked history; it must not react to Sheet 02 state.

## 8. Accessibility audit

- **Keyboard:** every action is a native `button`, `checkbox`, or `radio` — full Tab/Space/arrow-key operation, including the condition segment (radio group arrow keys).
- **Focus visibility:** global `:focus-visible` 2px ink outline, never suppressed; radios show focus on the segment.
- **Checkbox labels:** each check is a real `<label>` wrapping its input; the checklist is a `role="group"` with a named title and a live “n of 5” counter.
- **Color independence:** every state also changes text (OPEN / INCOMPLETE, LOCKED, EXPIRED), border style (dashed/solid/red), and the spine node. Green checks are also checked boxes.
- **Reduced motion:** full `prefers-reduced-motion` support (§6).
- **Mobile type:** ≥15.5 px body, 13 px minimum for meta text, 44 px touch rows.
- **Disabled-button explanation:** ACCEPT CUSTODY always displays *why* it is disabled, wired with `aria-describedby`; the reason is polite, specific, and live-updating.
- **Live regions:** one `role="status"` announcer reports acceptance, expiry, and assignment; it clears on reset.

## 9. Implementation risks

1. **Branch leakage (accepted + expired simultaneously).** Mitigation: single enum field + reducer guards; verified by clicking through both branches with resets.
2. **Custody drift (summary disagreeing with sheet).** Mitigation: custody is *derived*, never stored; one selector computes the custodian for all three surfaces.
3. **Imprint treated as decoration.** Mitigation: imprint is a data-driven `<dl>` rendered from acceptance state; removing acceptance data removes the imprint — it cannot be faked by styling.
4. **Motion undermining the serious tone.** Mitigation: one easing, one 2.4 s sequence, no overshoot, reduced-motion path; static elements enumerated in §6.
5. **Demo controls leaking into product semantics.** Mitigation: RoleSwitcher, Reset, and Timeout simulation are visually segregated in the header/rail and labelled “demo only”; none exist inside the document sheets.

## 10. Claude Code handoff

**Run:** `npm install && npm run dev` (Vite). **Build:** `npm run build` → `dist/`. No environment variables, no services.

**Audit these files first:**
1. `src/state/CustodyContext.tsx` — the state machine and every guard in §7.
2. `src/components/VerificationChecklist.tsx` + `AcceptanceAction.tsx` — the five-check gate.
3. `src/components/TransferImprint.tsx` — permanence of the imprint.
4. `src/components/ExceptionRecord.tsx` + `ExceptionAssignment.tsx` — custody-unchanged rules.
5. `src/index.css` — tokens, spine, state treatments, reduced motion.

**Deviations from the Framer reference (all deliberate):**
- *Condition as segmented radio instead of a plain checkbox row* — a condition is a choice among values, not a boolean; also yields a larger touch target and native keyboard behavior. Visual weight identical.
- *Open/accepted/expired shown as one document across time, not side-by-side panels* — the reference showed both branches for evaluation; the frozen spec forbids their coexistence, so the app renders one branch at a time with a demo reset between them.
- *Dispatcher monitor rail added* — the expired frame’s facts are preserved verbatim inside Sheet 02; the rail only adds handoff metadata and the demo expiry trigger.
- *Expiry is a deterministic demo trigger, not a wall-clock timer* — keeps the 4:30 PM deadline truthful as displayed text without surprising state changes mid-review.
- *Acceptance timestamp is the real local time* — the reference’s “June 18 · 2:47 PM” is mocked; recording the actual click time is more credible for a live document.

**Known limitations:** state is in-memory (refresh resets the demo; localStorage intentionally unused to keep branch resets clean); no photo-evidence upload (check is a confirmation, per spec scope); single shipment only (frozen data).

**Acceptance-criteria checklist (quality gate):**
1. ✅ Pending handoff never releases the sender (open and expired both name Charlotte).
2. ✅ ACCEPT CUSTODY disabled until 5/5 (reducer-level gate).
3. ✅ Acceptance creates exactly one permanent imprint.
4. ✅ Accepted and expired cannot coexist (single status field).
5. ✅ Expiry does not change custody.
6. ✅ Exception assignment does not change custody.
7. ✅ Previous custodians remain visible (Sheet 01 everywhere; history on customer view).
8. ✅ Mobile view begins with the current custodian.
9. ✅ No GPS, map, or tracking UI exists.
10. ✅ Understandable without narration (all states self-labelled; demo copy is explanatory, not instructional).
