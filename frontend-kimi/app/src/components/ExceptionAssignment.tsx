import { EXCEPTION_NEXT_ACTION, EXCEPTION_OWNER, SENDER } from '@/data/shipment'
import { useCustody } from '@/state/CustodyContext'

/**
 * ExceptionAssignment — dispatcher assigns an owner to the exception.
 * Assigning an owner never changes custody.
 */
export function ExceptionAssignment() {
  const { state, dispatch } = useCustody()
  if (state.sheet02 !== 'expired') return null

  if (state.exceptionOwner) {
    return (
      <div className="exception__assigned" role="status">
        <p>
          <strong>Exception owner: {state.exceptionOwner}</strong>
        </p>
        <p>Next action: {EXCEPTION_NEXT_ACTION}.</p>
        <p style={{ color: 'var(--ink-soft)' }}>
          Custody unchanged — {SENDER.name} remains accountable.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="exception__action">
        <button
          type="button"
          className="btn btn--danger btn--block"
          onClick={() => dispatch({ type: 'ASSIGN_EXCEPTION_OWNER' })}
        >
          Assign exception owner
        </button>
      </div>
      <p className="exception__note">
        Assigning an owner routes the exception to {EXCEPTION_OWNER}. It does not move custody
        and it does not confirm the handoff.
      </p>
    </div>
  )
}
