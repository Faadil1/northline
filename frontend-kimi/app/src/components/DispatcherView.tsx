import { CurrentCustodianSummary } from '@/components/CurrentCustodianSummary'
import { PassportDocument } from '@/components/PassportDocument'
import { EXPIRY_DEADLINE, RECEIVER, SENDER } from '@/data/shipment'
import { useCustody } from '@/state/CustodyContext'

/**
 * Dispatcher Exception View — monitors the handoff, triggers expiry (demo),
 * and owns exception assignment. Custody facts stay visible at all times.
 */
export function DispatcherView({ isDemoMode }: { isDemoMode: boolean }) {
  const { state, dispatch } = useCustody()

  const statusLabel =
    state.sheet02 === 'open'
      ? 'Open / awaiting acceptance'
      : state.sheet02 === 'locked'
        ? 'Accepted — Sheet 02 locked'
        : 'Expired — not confirmed'

  return (
    <div className="dispatcher-grid">
      <div>
        <span className="label label--section" style={{ display: 'block', marginBottom: 12 }}>
          Handoff monitor — Sheet 02
        </span>
        <PassportDocument />
      </div>

      <div className="surface-grid__rail">
        <CurrentCustodianSummary />

        <div className="monitor" aria-label="Handoff status">
          <div className="monitor__row">
            <span className="monitor__key">Handoff status</span>
            <span className={`monitor__val monitor__val--${state.sheet02}`}>{statusLabel}</span>
          </div>
          <div className="monitor__row">
            <span className="monitor__key">Sender</span>
            <span className="monitor__val">{SENDER.name}</span>
          </div>
          <div className="monitor__row">
            <span className="monitor__key">Receiver</span>
            <span className="monitor__val">{RECEIVER.name}</span>
          </div>
          <div className="monitor__row">
            <span className="monitor__key">Response due</span>
            <span className="monitor__val">
              {state.sheet02 === 'open' ? EXPIRY_DEADLINE : '—'}
            </span>
          </div>
          {state.sheet02 === 'expired' && (
            <div className="monitor__row">
              <span className="monitor__key">Exception owner</span>
              <span className="monitor__val">{state.exceptionOwner ?? 'Unassigned'}</span>
            </div>
          )}
        </div>

        {isDemoMode && state.sheet02 === 'open' && (
          <div
            className="rail-block"
            style={{ border: '1px dashed var(--line-strong)', background: 'var(--surface-panel)' }}
            aria-label="Demo controls (not part of the product)"
          >
            <h3 className="label label--section demo-zone__label">Timeout simulation (demo)</h3>
            <p style={{ margin: '0 0 10px' }}>
              If {RECEIVER.name} does not respond by {EXPIRY_DEADLINE}, the handoff request
              expires. Expiry never moves custody.
            </p>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => dispatch({ type: 'EXPIRE_HANDOFF' })}
            >
              Simulate handoff expiry
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
