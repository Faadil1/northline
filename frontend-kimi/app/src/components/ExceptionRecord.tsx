import { EXPIRY_DEADLINE, RECEIVER, SENDER } from '@/data/shipment'
import { useCustody } from '@/state/CustodyContext'

/**
 * ExceptionRecord — the expired-handoff display.
 * Facts only. Custody is unchanged and the record says so.
 */
export function ExceptionRecord() {
  const { state } = useCustody()
  if (state.sheet02 !== 'expired') return null

  return (
    <div className="exception">
      <p className="label label--state exception__headline">Handoff not confirmed</p>
      <ul className="exception__facts">
        <li>
          <strong>{SENDER.name}</strong> remains accountable
        </li>
        <li>
          <strong>{RECEIVER.name}</strong> has not accepted
        </li>
        <li>
          Exception owner:{' '}
          <strong>{state.exceptionOwner ?? 'Unassigned'}</strong>
        </li>
        <li>
          Next action due: <strong>{state.exceptionOwner ? '—' : EXPIRY_DEADLINE}</strong>
        </li>
      </ul>
    </div>
  )
}
