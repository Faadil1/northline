/**
 * Frozen domain model — Custody Passport (Move MV-2048).
 * Source of truth: frozen specification. Do not add states listed as forbidden:
 * NO ACTIVE CUSTODIAN, FORCE ACCEPTANCE, ACCEPTED BY ADMIN, AUTO ACCEPTED, CUSTODY UNKNOWN.
 */

export type Role = 'receiver' | 'dispatcher' | 'customer'

/** Sheet 02 is the only sheet that can change state. Accepted and expired are mutually exclusive. */
export type Sheet02Status = 'open' | 'locked' | 'expired'

export type Condition = 'good' | 'damaged' | 'shortage' | null

export interface VerificationChecks {
  loadId: boolean
  sealId: boolean
  units: boolean
  condition: boolean
  photo: boolean
}

export interface Organization {
  name: string
  operator: string
}

export interface CustodyState {
  role: Role
  sheet02: Sheet02Status
  checks: VerificationChecks
  condition: Condition
  accepting: boolean
  imprintSettled: boolean
  acceptedAt: string | null
  exceptionOwner: string | null
}

export type CustodyAction =
  | { type: 'SET_ROLE'; role: Role }
  | { type: 'TOGGLE_CHECK'; key: keyof Omit<VerificationChecks, 'condition'> }
  | { type: 'SET_CONDITION'; condition: Exclude<Condition, null> }
  | { type: 'ACCEPT_CUSTODY' }
  | { type: 'IMPRINT_SETTLED' }
  | { type: 'EXPIRE_HANDOFF' }
  | { type: 'ASSIGN_EXCEPTION_OWNER' }
  | { type: 'RESET_DEMO' }
