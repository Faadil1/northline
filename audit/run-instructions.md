# Run Instructions

Project root: `C:\Users\fboussari\day6-custody-passport\frontend-kimi\app\`

## Install

```powershell
cd "C:\Users\fboussari\day6-custody-passport\frontend-kimi\app"
npm install
```

If you see `ENOTFOUND npm.mirrors.msh.team` or `npm error Exit handler never called!`, the lockfile has stale resolved URLs from the original build sandbox. Fix once:

```powershell
Remove-Item -Force package-lock.json
Remove-Item -Recurse -Force node_modules
npm install --no-audit --no-fund
```

## Launch (dev server)

```powershell
npm run dev
```

Opens on **http://localhost:3000**.

## Tests

```powershell
npm run test
```

Runs the Vitest reducer suite (`src/state/CustodyContext.test.ts`, 14 tests covering all 12 required invariant cases: initial state, gating, acceptance, imprint singularity, expiry exclusivity, exception assignment, reset, forbidden-state unreachability).

## Build

```powershell
npm run build
```

Produces `dist/` via `tsc -b && vite build`.

## Reset the demo scenario

In the running app: header → **Demo controls** → **Reset demo** button. Returns to Sheet 02 OPEN/INCOMPLETE with cleared checks, no exception owner, same role selected.

## Driving the three flows manually

- **Success flow:** Receiver role (default) → check all 4 checkboxes + pick a condition (GOOD/DAMAGED/SHORTAGE) → "Accept custody" enables at 5/5 → click it → watch the 2.4s settle → Sheet 02 locks, Northline becomes custodian.
- **Failure flow:** Dispatcher role → "Simulate handoff expiry" (demo-only, visually secondary/dashed) → Sheet 02 shows EXPIRED / HANDOFF NOT CONFIRMED → "Assign exception owner" → Jordan Lee assigned, custody still Charlotte.
- **Mobile/customer flow:** Customer role, narrow the browser to ~390px wide (or use devtools responsive mode) → current custodian appears first, then load/seal/units/condition, then permanent history — no horizontal scroll.

## Captures

Screenshots were captured via Chrome browser automation against the running dev server and saved to `day6-custody-passport/captures/`. To reproduce, run `npm run dev`, open http://localhost:3000, and step through the flows above at 1440×900 (desktop) and ~390×844 (mobile).
