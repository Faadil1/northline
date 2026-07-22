import { describe, expect, it } from 'vitest'
import { initialState, reducer } from './CustodyContext'
import type { CustodyState } from '@/types/custody'

const FULL_CHECKS = {
  loadId: true,
  sealId: true,
  units: true,
  condition: true,
  photo: true,
} as const

function accept(state: CustodyState): CustodyState {
  return reducer(state, { type: 'ACCEPT_CUSTODY' })
}

describe('custody reducer', () => {
  it('1. initial state has Charlotte (sender) as custodian — sheet02 open, no acceptance', () => {
    expect(initialState.sheet02).toBe('open')
    expect(initialState.acceptedAt).toBeNull()
  })

  it('2. requesting handoff (initial state) keeps sender accountable — no custodian change action exists pre-acceptance', () => {
    const s = reducer(initialState, { type: 'TOGGLE_CHECK', key: 'loadId' })
    expect(s.sheet02).toBe('open')
  })

  it('3. incomplete checklist rejects acceptance', () => {
    const partial: CustodyState = { ...initialState, checks: { ...FULL_CHECKS, photo: false } }
    const result = accept(partial)
    expect(result.accepting).toBe(false)
    expect(result.sheet02).toBe('open')
  })

  it('4. five completed checks permit acceptance', () => {
    const ready: CustodyState = { ...initialState, checks: { ...FULL_CHECKS } }
    const result = accept(ready)
    expect(result.accepting).toBe(true)
  })

  it('5. acceptance creates exactly one imprint (imprintSettled true, acceptedAt set once)', () => {
    let state: CustodyState = { ...initialState, checks: { ...FULL_CHECKS } }
    state = accept(state)
    state = reducer(state, { type: 'IMPRINT_SETTLED' })
    expect(state.imprintSettled).toBe(true)
    expect(state.acceptedAt).not.toBeNull()
    expect(state.sheet02).toBe('locked')
  })

  it('6. acceptance changes custodian branch to locked (Northline becomes active custodian)', () => {
    let state: CustodyState = { ...initialState, checks: { ...FULL_CHECKS } }
    state = accept(state)
    state = reducer(state, { type: 'IMPRINT_SETTLED' })
    expect(state.sheet02).toBe('locked')
  })

  it('7. repeated acceptance does not duplicate imprint', () => {
    let state: CustodyState = { ...initialState, checks: { ...FULL_CHECKS } }
    state = accept(state)
    state = reducer(state, { type: 'IMPRINT_SETTLED' })
    const acceptedAtFirst = state.acceptedAt
    const again = accept(state) // sheet02 is now 'locked', guard must reject
    expect(again).toBe(state)
    expect(again.acceptedAt).toBe(acceptedAtFirst)
  })

  it('8. expiry keeps sender as custodian (sheet02 expired, not locked)', () => {
    const state = reducer(initialState, { type: 'EXPIRE_HANDOFF' })
    expect(state.sheet02).toBe('expired')
  })

  it('9. expiry prevents accepted state coexistence — ACCEPT_CUSTODY is a no-op after expiry', () => {
    let state: CustodyState = { ...initialState, checks: { ...FULL_CHECKS } }
    state = reducer(state, { type: 'EXPIRE_HANDOFF' })
    // even with all checks true, expired sheet cannot accept
    const attempted = accept(state)
    expect(attempted).toBe(state)
    expect(attempted.sheet02).toBe('expired')
  })

  it('9b. EXPIRE_HANDOFF after locked is a no-op (accepted and expired mutually exclusive)', () => {
    let state: CustodyState = { ...initialState, checks: { ...FULL_CHECKS } }
    state = accept(state)
    state = reducer(state, { type: 'IMPRINT_SETTLED' })
    const attempted = reducer(state, { type: 'EXPIRE_HANDOFF' })
    expect(attempted).toBe(state)
    expect(attempted.sheet02).toBe('locked')
  })

  it('10. exception assignment keeps custody unchanged (sheet02 stays expired)', () => {
    let state = reducer(initialState, { type: 'EXPIRE_HANDOFF' })
    state = reducer(state, { type: 'ASSIGN_EXCEPTION_OWNER' })
    expect(state.exceptionOwner).toBe('Jordan Lee')
    expect(state.sheet02).toBe('expired')
  })

  it('11. reset restores deterministic initial state (preserving role)', () => {
    let state: CustodyState = { ...initialState, role: 'dispatcher', checks: { ...FULL_CHECKS } }
    state = reducer(state, { type: 'EXPIRE_HANDOFF' })
    state = reducer(state, { type: 'RESET_DEMO' })
    expect(state).toEqual({ ...initialState, role: 'dispatcher' })
  })

  it('12. forbidden states are unreachable — sheet02 only ever open | locked | expired', () => {
    const allowed = new Set(['open', 'locked', 'expired'])
    let state = initialState
    const actions: Array<Parameters<typeof reducer>[1]> = [
      { type: 'TOGGLE_CHECK', key: 'loadId' },
      { type: 'SET_CONDITION', condition: 'good' },
      { type: 'ACCEPT_CUSTODY' },
      { type: 'IMPRINT_SETTLED' },
      { type: 'EXPIRE_HANDOFF' },
      { type: 'ASSIGN_EXCEPTION_OWNER' },
    ]
    for (const action of actions) {
      state = reducer(state, action)
      expect(allowed.has(state.sheet02)).toBe(true)
    }
  })

  it('manager-style action cannot fabricate acceptance: no action sets acceptedAt except IMPRINT_SETTLED after ACCEPT_CUSTODY', () => {
    const state = reducer(initialState, { type: 'ASSIGN_EXCEPTION_OWNER' })
    expect(state.acceptedAt).toBeNull()
    expect(state.sheet02).toBe('open')
  })
})
