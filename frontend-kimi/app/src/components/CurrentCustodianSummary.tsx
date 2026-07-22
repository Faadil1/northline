import { RECEIVER, SENDER, SHIPMENT } from '@/data/shipment'
import { useCustody } from '@/state/CustodyContext'

/**
 * CurrentCustodianSummary — who is accountable right now.
 * Sender remains accountable through OPEN and EXPIRED states;
 * custody moves only on recorded acceptance.
 */
export function CurrentCustodianSummary({ compact = false }: { compact?: boolean }) {
  const { state } = useCustody()
  const accepted = state.sheet02 === 'locked'
  const expired = state.sheet02 === 'expired'
  const custodian = accepted ? RECEIVER : SENDER
  const classes = [
    'summary',
    accepted ? 'summary--locked' : expired ? 'summary--expired' : 'summary--open',
    accepted && state.imprintSettled ? 'summary--updated' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section
      className={classes}
      aria-label="Current custodian"
    >
      <p className="label summary__label">Current custodian</p>
      <h2 className="summary__org" style={compact ? { fontSize: 19 } : undefined}>
        {custodian.name}
      </h2>
      <p className="summary__meta">
        {accepted ? (
          <>
            Accepted by {custodian.operator}
            <br />
            {state.acceptedAt}
          </>
        ) : (
          <>
            Operator {custodian.operator}
            <br />
            Accountable until {RECEIVER.name} accepts custody.
          </>
        )}
      </p>
      {!compact && (
        <div className="summary__load" aria-label="Load details">
          <span>Load {SHIPMENT.load}</span>
          <span>Seal {SHIPMENT.seal}</span>
          <span>
            {SHIPMENT.unitsConfirmed} / {SHIPMENT.unitsExpected} units
          </span>
          <span>Condition {SHIPMENT.conditionLabel}</span>
        </div>
      )}
    </section>
  )
}
