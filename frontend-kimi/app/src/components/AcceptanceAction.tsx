import { useCustody } from '@/state/CustodyContext'

/**
 * AcceptanceAction — the only way custody moves.
 * Disabled until all five verification checks pass; the reason is always visible.
 */
export function AcceptanceAction() {
  const { state, dispatch, checksComplete, checksCompletedCount } = useCustody()

  if (state.sheet02 !== 'open') return null

  const enabled = checksComplete && !state.accepting
  const reason = state.accepting
    ? 'Recording acceptance. The Transfer Imprint is settling into Sheet 02.'
    : checksComplete
      ? 'All five checks complete. Acceptance is permanent and cannot be undone.'
      : `Complete all five verification checks to accept custody (${checksCompletedCount} of 5).`

  return (
    <div>
      <button
        type="button"
        className={
          state.accepting ? 'btn btn--primary btn--block btn--accepting' : 'btn btn--primary btn--block'
        }
        disabled={!enabled}
        aria-describedby="accept-reason"
        onClick={() => dispatch({ type: 'ACCEPT_CUSTODY' })}
      >
        {state.accepting ? 'Recording acceptance…' : 'Accept custody — complete verification'}
      </button>
      <p
        id="accept-reason"
        style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--ink-mute)' }}
        aria-live="polite"
      >
        {reason}
      </p>
    </div>
  )
}
