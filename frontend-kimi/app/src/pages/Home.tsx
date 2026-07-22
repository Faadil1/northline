import { useEffect, useRef } from 'react'
import { CurrentCustodianSummary } from '@/components/CurrentCustodianSummary'
import { CustomerPassportMobile } from '@/components/CustomerPassportMobile'
import { DispatcherView } from '@/components/DispatcherView'
import { PassportDocument } from '@/components/PassportDocument'
import { RoleSwitcher } from '@/components/RoleSwitcher'
import { RECEIVER, SENDER, SHIPMENT } from '@/data/shipment'
import { useCustody } from '@/state/CustodyContext'
import { useDemoMode } from '@/hooks/use-demo-mode'

/** Announces custody-relevant state changes to assistive technology. */
function LiveAnnouncer() {
  const { state } = useCustody()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    if (state.sheet02 === 'locked' && state.imprintSettled) {
      ref.current.textContent = `Custody accepted by ${RECEIVER.operator}, ${RECEIVER.name}. Sheet 02 is locked. The Transfer Imprint is permanent.`
    } else if (state.sheet02 === 'expired') {
      ref.current.textContent = `Handoff expired. ${SENDER.name} remains accountable. Exception owner: ${state.exceptionOwner ?? 'unassigned'}.`
    } else {
      ref.current.textContent = ''
    }
  }, [state.sheet02, state.imprintSettled, state.exceptionOwner])

  return <div ref={ref} className="visually-hidden" role="status" aria-live="polite" />
}

function ReceiverSurface({ isDemoMode }: { isDemoMode: boolean }) {
  return (
    <div className="surface-grid">
      <PassportDocument />
      <div className="surface-grid__rail">
        <CurrentCustodianSummary />
        {isDemoMode && (
          <div className="rail-block">
            <h3 className="label label--section">Signature interaction — 8–12 second path</h3>
            <p style={{ margin: 0 }}>
              Tap through verification, then accept custody. The enabled action appears only
              after all five checks are complete; acceptance settles the permanent imprint into
              Sheet 02.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function HomeInner() {
  const { state, dispatch } = useCustody()
  const isDemoMode = useDemoMode()

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__identity">
          <span className="label app-header__title">Custody Passport</span>
          <span className="app-header__sub">
            Move {SHIPMENT.move} · {SHIPMENT.route.join(' → ')} · Customer {SHIPMENT.customer}
          </span>
        </div>
        {isDemoMode && (
          <div className="demo-zone" aria-label="Demo controls (not part of the product)">
            <span className="label demo-zone__label">Demo controls</span>
            <RoleSwitcher />
            <div className="demo-controls">
              <button
                type="button"
                className="btn"
                onClick={() => dispatch({ type: 'RESET_DEMO' })}
              >
                Reset demo
              </button>
              <span className="demo-controls__note">Role switch & reset are demo-only.</span>
            </div>
          </div>
        )}
      </header>

      <main className="app-main">
        {state.role === 'receiver' && <ReceiverSurface isDemoMode={isDemoMode} />}
        {state.role === 'dispatcher' && <DispatcherView isDemoMode={isDemoMode} />}
        {state.role === 'customer' && <CustomerPassportMobile />}
      </main>

      <LiveAnnouncer />
    </div>
  )
}

export default function Home() {
  return <HomeInner />
}
