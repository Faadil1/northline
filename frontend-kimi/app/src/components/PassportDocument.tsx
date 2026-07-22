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
  const { state, checksComplete } = useCustody()

  return (
    <div className="passport">
      <div className="passport__dochead">
        <span className="label label--section">
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
        <div className="party party--history">
          <p className="label party__role">Custodian of record</p>
          <p className="party__name">
            {SHEET_01.custodian}
          </p>
          <p className="party__org">
            Accepted by {SHEET_01.acceptedBy}
          </p>
        </div>
      </PassportSheet>

      {/* Sheet 02 — the active handoff */}
      {state.sheet02 === 'open' && (
        <PassportSheet
          number={2}
          status="open"
          statusText={checksComplete ? 'Sheet 02 — Ready' : 'Sheet 02 — Open / Incomplete'}
          kind="Acceptance / Interactive"
          settling={state.accepting}
          ready={checksComplete && !state.accepting}
          accepting={state.accepting}
        >
          <div className="party party--current-custodian party--current-custodian--open">
            <p className="label party__role">Current custodian</p>
            <p className="party__name">
              {SENDER.name}
            </p>
            <p className="party__org">
              Accountable until {RECEIVER.name} accepts
            </p>
          </div>
          <p className="sheet__lede">
            {checksComplete
              ? 'All evidence confirmed. Ready for acceptance.'
              : 'Verification required before handoff can be accepted.'}
          </p>
          <div className="party">
            <p className="label party__role">Receiving operator</p>
            <p className="party__name">
              {RECEIVER.operator}
            </p>
            <p className="party__org">
              {RECEIVER.name}
            </p>
          </div>
          {checksComplete && !state.accepting && (
            <div className="imprint--reserved" aria-label="Imprint bed — reserved for acceptance">
              <p className="imprint--reserved__label">Transfer Imprint — will appear here</p>
            </div>
          )}
          <VerificationChecklist />
          <AcceptanceAction />
        </PassportSheet>
      )}

      {state.sheet02 === 'locked' && (
        <PassportSheet number={2} status="locked" statusText="Sheet 02 — Locked" kind="Transfer record">
          <div className="party party--current-custodian party--current-custodian--locked">
            <p className="label party__role">Current custodian</p>
            <p className="party__name">
              {RECEIVER.name}
            </p>
            <p className="party__org">
              Accepted by {RECEIVER.operator}
            </p>
          </div>
          <TransferImprint acceptedAt={state.acceptedAt} settling />
          <p className="sheet__note">
            {SENDER.name} remains visible as the historical custodian.
          </p>
        </PassportSheet>
      )}

      {state.sheet02 === 'expired' && (
        <PassportSheet number={2} status="expired" statusText="Sheet 02 — Expired" kind="Expired handoff / Interactive" assigned={!!state.exceptionOwner}>
          <div className="party party--current-custodian party--current-custodian--expired">
            <p className="label party__role">Current custodian</p>
            <p className="party__name">
              {SENDER.name}
            </p>
            <p className="party__org">
              Handoff not confirmed · remains accountable
            </p>
          </div>
          <div className="imprint--void" aria-label="Imprint void — no acceptance occurred">
            <p className="imprint--void__label">No Transfer Imprint · Handoff not completed</p>
          </div>
          <ExceptionRecord />
          <ExceptionAssignment />
        </PassportSheet>
      )}
    </div>
  )
}
