import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import type {
  CustodyAction,
  CustodyState,
  VerificationChecks,
} from '@/types/custody'

const EMPTY_CHECKS: VerificationChecks = {
  loadId: false,
  sealId: false,
  units: false,
  condition: false,
  photo: false,
}

/**
 * Demo begins at the frozen spike entry point:
 * SHEET 02 — OPEN / INCOMPLETE (handoff already requested, sender still accountable).
 */
const initialState: CustodyState = {
  role: 'receiver',
  sheet02: 'open',
  checks: EMPTY_CHECKS,
  condition: null,
  accepting: false,
  imprintSettled: false,
  acceptedAt: null,
  exceptionOwner: null,
}

function allChecksPass(checks: VerificationChecks): boolean {
  return Object.values(checks).every(Boolean)
}

export { initialState }

export function reducer(state: CustodyState, action: CustodyAction): CustodyState {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.role }

    case 'TOGGLE_CHECK':
      // Verification is only possible while the sheet is open.
      if (state.sheet02 !== 'open' || state.accepting) return state
      return {
        ...state,
        checks: { ...state.checks, [action.key]: !state.checks[action.key] },
      }

    case 'SET_CONDITION':
      if (state.sheet02 !== 'open' || state.accepting) return state
      return {
        ...state,
        condition: action.condition,
        checks: { ...state.checks, condition: true },
      }

    case 'ACCEPT_CUSTODY':
      // Hard gate: acceptance is impossible until all five checks pass.
      if (state.sheet02 !== 'open' || !allChecksPass(state.checks) || state.accepting)
        return state
      return { ...state, accepting: true }

    case 'IMPRINT_SETTLED':
      if (!state.accepting) return state
      // Exactly one permanent imprint; sheet locks; expired can never follow.
      return {
        ...state,
        accepting: false,
        imprintSettled: true,
        sheet02: 'locked',
        acceptedAt: new Date().toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        }),
      }

    case 'EXPIRE_HANDOFF':
      // Expiry is only reachable from open — never after acceptance.
      if (state.sheet02 !== 'open' || state.accepting) return state
      return { ...state, sheet02: 'expired', exceptionOwner: null }

    case 'ASSIGN_EXCEPTION_OWNER':
      // Exception handling never changes custody.
      if (state.sheet02 !== 'expired' || state.exceptionOwner) return state
      return { ...state, exceptionOwner: 'Jordan Lee' }

    case 'RESET_DEMO':
      return { ...initialState, role: state.role }

    default:
      return state
  }
}

interface CustodyContextValue {
  state: CustodyState
  dispatch: React.Dispatch<CustodyAction>
  checksComplete: boolean
  checksCompletedCount: number
}

const CustodyContext = createContext<CustodyContextValue | null>(null)

/** Settle duration of the Transfer Imprint sequence (ms). Kept under reduced-motion. */
export const IMPRINT_SETTLE_MS = 2400

export function CustodyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const checksComplete = allChecksPass(state.checks)
  const checksCompletedCount = Object.values(state.checks).filter(Boolean).length

  // Drive the acceptance -> imprint settled transition. Deterministic local timer.
  useEffect(() => {
    if (!state.accepting) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(
      () => dispatch({ type: 'IMPRINT_SETTLED' }),
      reduced ? 300 : IMPRINT_SETTLE_MS,
    )
    return () => window.clearTimeout(timer)
  }, [state.accepting])

  const value = useMemo(
    () => ({ state, dispatch, checksComplete, checksCompletedCount }),
    [state, checksComplete, checksCompletedCount],
  )

  return <CustodyContext.Provider value={value}>{children}</CustodyContext.Provider>
}

export function useCustody(): CustodyContextValue {
  const ctx = useContext(CustodyContext)
  if (!ctx) throw new Error('useCustody must be used inside CustodyProvider')
  return ctx
}
