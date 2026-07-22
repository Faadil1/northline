# Source-of-Truth Map

Status legend: PRESENT (fully implemented and verified) / PARTIAL / MISSING / VIOLATED.

## Business rules (`specification/business-rules.md`)

| Rule | Implementation | Status |
|---|---|---|
| Sender remains responsible when transfer initiated | `CurrentCustodianSummary` derives custodian from `sheet02 !== 'locked' → SENDER`; demo begins at `sheet02: 'open'` | PRESENT |
| Receiver must verify load (load ID, seal, units, condition, photo) | `VerificationChecklist` — 5 checks, `types/custody.ts` `VerificationChecks` | PRESENT |
| Receiver must explicitly accept | `AcceptanceAction` dispatches `ACCEPT_CUSTODY`, gated on `allChecksPass` | PRESENT |
| Custody changes only after acceptance | Reducer: only `IMPRINT_SETTLED` (reachable only after `ACCEPT_CUSTODY`) sets `sheet02: 'locked'`; custodian is *derived* from this field, never set directly | PRESENT |
| Deadline expiry → transfer fails, sender remains responsible, exception created | `EXPIRE_HANDOFF` action, guarded to `sheet02 === 'open'` only; `ExceptionRecord` states sender remains accountable | PRESENT |
| Exception must get a named owner | `ASSIGN_EXCEPTION_OWNER` → `Jordan Lee` (frozen data) | PRESENT |
| Forbidden states never appear (`NO ACTIVE CUSTODIAN`, `TRANSFER ACCEPTED BY ADMIN`, `FORCE ACCEPTANCE`, `AUTO ACCEPTED`, `CUSTODY UNKNOWN`) | Grepped entire `src/` — zero occurrences outside a comment in `types/custody.ts` documenting what must never appear | PRESENT |
| `HANDOFF NOT CONFIRMED` exact message on non-acceptance | `ExceptionRecord.tsx`: `"Handoff not confirmed"` headline + sender-accountable + owner line | PRESENT |
| Manager cannot fabricate acceptance/signature/photo | No UI path sets `acceptedAt` or `imprintSettled` except the `ACCEPT_CUSTODY → IMPRINT_SETTLED` chain, which requires all 5 checks; `ASSIGN_EXCEPTION_OWNER` reducer branch never touches `sheet02`/`acceptedAt` | PRESENT |
| Records append-only / immutable history | Sheet 01 (origin) is static frozen data, always rendered regardless of Sheet 02 state; customer view keeps prior sheets visible after acceptance | PRESENT (in-memory demo scope; no real persistence layer, out of scope per spec) |

## State machine (`specification/state-machine.md`)

The full Move/Transfer/Exception/Commitment state machine is modeled as a simplified single-shipment reduction: `sheet02: 'open' | 'locked' | 'expired'` maps to `RECEIPT_PENDING → HELD_BY_RECEIVER` (locked) or `RECEIPT_PENDING → HANDOFF_NOT_CONFIRMED → EXCEPTION_OPEN` (expired). This is a deliberate, documented simplification for a single-Move prototype — not a violation, since the **core invariant** ("custody changes only on Transfer→ACCEPTED, no other path") is enforced exactly as specified. Status: **PRESENT** (simplified but faithful).

## Acceptance criteria (`specification/acceptance-criteria.md`)

See `audit/acceptance-audit.md` for the full 15/15 walkthrough with evidence.

## Data model (`specification/data-model.json`)

Frozen synthetic values (`data/shipment.ts`) match exactly: MV-2048, LD-4821, S-4812, 42/42 units, GOOD condition, Charlotte Origin Hub/Maya Chen, Northline Interstate Carrier/James Wilson, Elena Ruiz, Jordan Lee, "Contact Northline dispatch", 4:30 PM deadline. Status: **PRESENT**.

## Visual guardrails (`specification/visual-guardrails.md`) / direction

Cross-checked against the frozen direction in the task instructions (spine, dashed/solid/red states, condensed uppercase labels only, no gradients/glassmorphism/pills, sender-accountability always visible). Verified visually via the desktop/mobile captures in `captures/`. Status: **PRESENT**.
