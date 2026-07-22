import { AcceptanceAction } from '@/components/AcceptanceAction'
import { ExceptionAssignment } from '@/components/ExceptionAssignment'
import { ExceptionRecord } from '@/components/ExceptionRecord'
import { PassportSheet } from '@/components/PassportSheet'
import { TransferImprint } from '@/components/TransferImprint'
import { VerificationChecklist } from '@/components/VerificationChecklist'
import { RECEIVER, SENDER, SHEET_01, SHIPMENT } from '@/data/shipment'
import { useCustody } from '@/state/CustodyContext'

/**
 * PassportDocument — the cumulative custody-transfer document.
 * Sheet 01 is permanent history. Sheet 02 carries the active handoff.
 */
export function PassportDocument() {
  const { state } = useCustody()

  return (
    <div className="passport">
      <div className="passport__dochead">
        <span className="label label--section" style={{ color: 'var(--ink-mute)' }}>
          Custody Passport — Move {SHIPMENT.move}
        </span>
        <h1>
          {SHIPMENT.route.join(' → ')}
        </h1>
        <p>
          Load {SHIPMENT.load} · Seal {SHIPMENT.seal} · Customer {SHIPMENT.customer}. Each
          physical handoff occupies one sheet. A handoff is not complete until the receiving
          party confirms the load and its condition.
        </p>
      </div>

      {/* Sheet 01 — permanent history; relabelled once Sheet 02 settles to reflect it is now historical */}
      <PassportSheet
        number={1}
        status="locked"
        statusText={state.sheet02 === 'locked' ? 'Historical — locked' : 'Sheet 01 — Locked'}
        kind={state.sheet02 === 'locked' ? 'Origin custody record' : 'Origin record'}
      >
        <div className="party" style={{ marginBottom: 0 }}>
          <p className="label party__role">Custodian of record</p>
          <p className="party__name" style={{ margin: 0 }}>
            {SHEET_01.custodian}
          </p>
          <p className="party__org" style={{ margin: 0 }}>
            Accepted by {SHEET_01.acceptedBy}
          </p>
        </div>
      </PassportSheet>

      {/* Sheet 02 — the active handoff */}
      {state.sheet02 === 'open' && (
        <PassportSheet
          number={2}
          status="open"
          statusText="Sheet 02 — Open / Incomplete"
          kind="Acceptance / Interactive"
          settling={state.accepting}
        >
          <p className="sheet__lede">
            {SENDER.name} remains accountable until {RECEIVER.name} accepts custody.
          </p>
          <div className="party">
            <p className="label party__role">Receiving operator</p>
            <p className="party__name" style={{ margin: 0 }}>
              {RECEIVER.operator}
            </p>
            <p className="party__org" style={{ margin: 0 }}>
              {RECEIVER.name}
            </p>
          </div>
          <VerificationChecklist />
          <AcceptanceAction />
        </PassportSheet>
      )}

      {state.sheet02 === 'locked' && (
        <PassportSheet number={2} status="locked" statusText="Sheet 02 — Locked" kind="Transfer record">
          <TransferImprint acceptedAt={state.acceptedAt} settling />
          <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-soft)' }}>
            {RECEIVER.name} is the active custodian. {SENDER.name} remains visible as the
            historical custodian.
          </p>
        </PassportSheet>
      )}

      {state.sheet02 === 'expired' && (
        <PassportSheet number={2} status="expired" statusText="Sheet 02 — Expired" kind="Expired handoff / Interactive">
          <ExceptionRecord />
          <ExceptionAssignment />
        </PassportSheet>
      )}
    </div>
  )
}
