import { CurrentCustodianSummary } from '@/components/CurrentCustodianSummary'
import { RECEIVER, SHEET_01, SHIPMENT } from '@/data/shipment'
import { useCustody } from '@/state/CustodyContext'

/**
 * CustomerPassportMobile — the customer's mobile view.
 * Priority order: current custodian first, then named receiver and acceptance
 * time, then load/seal/units/condition, then permanent prior sheets.
 * No location tracking. No delivery analytics.
 */
export function CustomerPassportMobile() {
  const { state } = useCustody()
  const accepted = state.sheet02 === 'locked'

  return (
    <div className="customer-wrap">
      <span className="label label--section" style={{ display: 'block', marginBottom: 12 }}>
        Customer passport — {SHIPMENT.customer}
      </span>

      <div className="customer-doc">
        {/* 1. Current accountable organization */}
        <CurrentCustodianSummary compact />

        {/* 2-3. Load detail + condition (inside summary on desktop; repeated here for mobile priority) */}
        <div className="summary__load" style={{ marginBottom: 18 }} aria-label="Load details">
          <span>Load {SHIPMENT.load}</span>
          <span>Seal {SHIPMENT.seal}</span>
          <span>
            {SHIPMENT.unitsConfirmed} / {SHIPMENT.unitsExpected} units
          </span>
          <span>Condition {SHIPMENT.conditionLabel}</span>
        </div>

        {/* 4. Permanent prior sheets */}
        <p className="label history__title">Permanent history</p>

        <div className="history__item">
          <p className="label history__sheet" style={{ margin: 0 }}>
            Sheet 01 — Locked
          </p>
          <p className="history__meta" style={{ margin: '2px 0 0' }}>
            {SHEET_01.custodian}
            <br />
            Accepted by {SHEET_01.acceptedBy}
          </p>
        </div>

        {accepted && (
          <div className="history__item history__item--imprint">
            <p className="label history__sheet" style={{ margin: 0 }}>
              Sheet 02 — Locked
            </p>
            <p className="history__meta" style={{ margin: '2px 0 0' }}>
              {RECEIVER.name}
            </p>
            <p className="history__imprint-line" style={{ margin: '2px 0 0' }}>
              Transfer Imprint recorded
            </p>
          </div>
        )}

        {state.sheet02 === 'open' && (
          <div className="history__item">
            <p className="label history__sheet" style={{ margin: 0 }}>
              Sheet 02 — Open / Incomplete
            </p>
            <p className="history__meta" style={{ margin: '2px 0 0' }}>
              Awaiting acceptance by {RECEIVER.name}
            </p>
          </div>
        )}

        {state.sheet02 === 'expired' && (
          <div className="history__item" style={{ borderLeftColor: 'var(--red-line)' }}>
            <p className="label history__sheet" style={{ margin: 0, color: 'var(--red-deep)' }}>
              Sheet 02 — Expired
            </p>
            <p className="history__meta" style={{ margin: '2px 0 0' }}>
              Handoff not confirmed. Your shipment remains with its current custodian.
            </p>
          </div>
        )}
      </div>

      <div className="rail-block customer-priority">
        <h3 className="label label--section">Customer view priority</h3>
        <ol>
          <li>Current accountable organization</li>
          <li>Named receiver and acceptance time</li>
          <li>Load, seal, units and condition</li>
          <li>Permanent prior sheets</li>
        </ol>
        <p>No location tracking or delivery analytics.</p>
      </div>
    </div>
  )
}
