# Acceptance Criteria Audit (15/15)

1. **Team A remains responsible during a pending handoff.** — PASS.
   Evidence: `CurrentCustodianSummary` shows "Charlotte Origin Hub" while `sheet02 === 'open'`; `captures/receiver-initial-desktop.png`. Unit test: "initial state has Charlotte (sender) as custodian".

2. **Carrier B must confirm the load before anything changes.** — PASS.
   Evidence: `AcceptanceAction` button `disabled` until `checksComplete`; reducer's `ACCEPT_CUSTODY` branch hard-rejects unless `allChecksPass(state.checks)`. Unit tests: "incomplete checklist rejects acceptance", "five completed checks permit acceptance".

3. **The Passport creates a stamp only after acceptance.** — PASS.
   Evidence: `TransferImprint` only renders inside `state.sheet02 === 'locked'` branch of `PassportDocument`; `IMPRINT_SETTLED` is the only action that sets `imprintSettled: true`, and it no-ops unless `state.accepting` (itself gated by the 5-check rule). Unit test: "acceptance creates exactly one imprint".

4. **The stamp contains the minimum required proof fields.** — PASS.
   Evidence: `TransferImprint.tsx` `<dl>` renders From / To / Accepted by / Recorded / Load·Seal / Units·Condition — matches `data-model.json` Transfer fields. `captures/receiver-accepted-desktop.png`.

5. **An expired transfer produces exactly `HANDOFF NOT CONFIRMED`.** — PASS.
   Evidence: `ExceptionRecord.tsx` headline is literally "Handoff not confirmed"; no alternate message path exists. `captures/dispatcher-expired-desktop.png`.

6. **An exception is created without changing custody.** — PASS.
   Evidence: `EXPIRE_HANDOFF` reducer branch sets `sheet02: 'expired'` only — does not touch any custodian-deriving field; `CurrentCustodianSummary` still shows Charlotte Origin Hub post-expiry. Unit test: "expiry keeps sender as custodian".

7. **The exception can be assigned to a named owner.** — PASS.
   Evidence: `ASSIGN_EXCEPTION_OWNER` → `exceptionOwner: 'Jordan Lee'`; `ExceptionAssignment.tsx` renders "Exception owner: Jordan Lee" + "Next action: Contact Northline dispatch." `captures/dispatcher-assigned-desktop.png`.

8. **A manager cannot fabricate an acceptance.** — PASS.
   Evidence: grepped `src/` for `FORCE ACCEPTANCE`, `ACCEPTED BY ADMIN`, `AUTO ACCEPTED` — zero matches in code (only in a "must never appear" comment). No dispatcher/manager-facing action sets `acceptedAt`, `imprintSettled`, or `sheet02: 'locked'`. Unit test: "manager-style action cannot fabricate acceptance".

9. **Prior history remains visible after new events occur.** — PASS.
   Evidence: Sheet 01 (origin record) renders unconditionally in `PassportDocument` regardless of Sheet 02 state, relabelled "Historical — locked" once Sheet 02 accepts; `CustomerPassportMobile` "Permanent history" list keeps Sheet 01 always, adds Sheet 02 once accepted. `captures/receiver-accepted-desktop.png`, `customer-accepted-desktop.png`.

10. **The customer sees the current active custodian.** — PASS.
    Evidence: `CustomerPassportMobile` renders `CurrentCustodianSummary` first (priority order documented in-UI as "Customer view priority"). `captures/customer-accepted-desktop.png`, `customer-accepted-mobile.png`.

11. **No GPS or generic tracker is required anywhere in the flow.** — PASS.
    Evidence: grepped `src/` for `map`, `gps`, `leaflet`, `mapbox`, `geolocation` — no matches; no map/location components exist. "No location tracking or delivery analytics." is stated in-UI.

12. **The demo runs fully locally with no external dependency.** — PASS.
    Evidence: `npm run build` and `npm run dev` succeed with zero network calls at runtime (Vite dev server confirmed via `read_console_messages`/browser session — no fetch/XHR to any external host). All data is local constants in `data/shipment.ts`.

13. **All data is synthetic (no real customer or Mayzlin data).** — PASS.
    Evidence: `data/shipment.ts` contains only the frozen fictional dataset (MV-2048, Elena Ruiz, Charlotte Origin Hub, Northline Interstate Carrier, etc.) — matches the frozen spec exactly, no real company/person names.

14. **The product's limits are visible somewhere in the UI or accompanying material.** — PASS.
    Evidence: in-UI: "No location tracking or delivery analytics." (customer view); demo-only zone explicitly labelled "Demo controls" with note "Role switch & reset are demo-only."; `Custody Passport — Implementation Handoff.md` §10 "Known limitations" documents in-memory-only state, no photo upload, single shipment.

15. **The state change is visually strong enough to read clearly in a short video without narration.** — PASS.
    Evidence: 2.4s signature settle sequence (button → "Recording acceptance…" → imprint fade/translate + status-band crossfade black→green → sheet flips OPEN/dashed → LOCKED/solid, custody summary pulse). Verified live in browser; `captures/signature-final-frame.png` is the locked/settled end frame. `prefers-reduced-motion` path collapses to instant state change while still announcing via the live region, so the criterion holds with or without motion.

## Result: 15 / 15 PASS
