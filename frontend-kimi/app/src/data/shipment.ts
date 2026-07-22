import type { Organization } from '@/types/custody'

/** Approved frozen data — do not edit without a spec change. */
export const SHIPMENT = {
  move: 'MV-2048',
  load: 'LD-4821',
  seal: 'S-4812',
  unitsExpected: 42,
  unitsConfirmed: 42,
  conditionLabel: 'GOOD',
  route: ['Charlotte', 'Columbus', 'Toronto'],
  customer: 'Elena Ruiz',
} as const

export const SENDER: Organization = {
  name: 'Charlotte Origin Hub',
  operator: 'Maya Chen',
}

export const RECEIVER: Organization = {
  name: 'Northline Interstate Carrier',
  operator: 'James Wilson',
}

export const EXCEPTION_OWNER = 'Jordan Lee'
export const EXCEPTION_NEXT_ACTION = 'Contact Northline dispatch'
export const EXPIRY_DEADLINE = '4:30 PM'

/** Historical record, permanent. */
export const SHEET_01 = {
  number: 1,
  status: 'LOCKED',
  custodian: SENDER.name,
  acceptedBy: 'Maya Chen',
} as const
