import { SHIPMENT } from '@/data/shipment'
import { useCustody } from '@/state/CustodyContext'
import type { VerificationChecks } from '@/types/custody'

const CHECK_ITEMS: Array<{ key: keyof Omit<VerificationChecks, 'condition'>; label: string }> = [
  { key: 'loadId', label: `Load ID ${SHIPMENT.load} confirmed` },
  { key: 'sealId', label: `Seal ${SHIPMENT.seal} confirmed` },
  {
    key: 'units',
    label: `Units ${SHIPMENT.unitsConfirmed} / ${SHIPMENT.unitsExpected} confirmed`,
  },
  { key: 'photo', label: 'Photo evidence attached' },
]

/**
 * VerificationChecklist — the five required checks.
 * ACCEPT CUSTODY stays disabled until all five pass.
 * Interactive only while Sheet 02 is OPEN.
 */
export function VerificationChecklist() {
  const { state, dispatch, checksCompletedCount } = useCustody()
  const interactive = state.sheet02 === 'open' && !state.accepting

  return (
    <div className="checklist" role="group" aria-labelledby="checklist-title">
      <div className="checklist__head">
        <span className="label label--section" id="checklist-title">
          Receiving verification
        </span>
        <span className="checklist__count" aria-live="polite">
          {checksCompletedCount} of 5 complete
        </span>
      </div>

      {CHECK_ITEMS.slice(0, 2).map(({ key, label }) => (
        <CheckRow key={key} itemKey={key} label={label} disabled={!interactive} />
      ))}

      <CheckRow itemKey="units" label={CHECK_ITEMS[2].label} disabled={!interactive} />

      {/* Condition is a selection, not a bare checkbox */}
      <div className="check check--condition" role="radiogroup" aria-label="Condition at receipt">
        <input
          type="checkbox"
          checked={state.checks.condition}
          readOnly
          disabled
          aria-hidden="true"
          tabIndex={-1}
        />
        <span className="check__text" id="condition-label">
          Condition selected:
        </span>
        <div className="condition-options" aria-labelledby="condition-label">
          {(['good', 'damaged', 'shortage'] as const).map((value) => (
            <label key={value} className="condition-option">
              <input
                type="radio"
                name="condition"
                value={value}
                checked={state.condition === value}
                disabled={!interactive}
                onChange={() => dispatch({ type: 'SET_CONDITION', condition: value })}
              />
              <span>{value}</span>
            </label>
          ))}
        </div>
      </div>

      <CheckRow itemKey="photo" label={CHECK_ITEMS[3].label} disabled={!interactive} />
      {state.checks.photo && (
        <div className="photo-proof">
          <div className="photo-proof__thumb" aria-hidden="true" />
          <div className="photo-proof__meta">
            <strong>load-LD-4821-receipt.jpg</strong>
            <br />
            Attached · {new Date().toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </div>
        </div>
      )}
    </div>
  )

  function CheckRow({
    itemKey,
    label,
    disabled,
  }: {
    itemKey: keyof Omit<VerificationChecks, 'condition'>
    label: string
    disabled: boolean
  }) {
    return (
      <label className="check">
        <input
          type="checkbox"
          checked={state.checks[itemKey]}
          disabled={disabled}
          onChange={() => dispatch({ type: 'TOGGLE_CHECK', key: itemKey })}
        />
        <span className="check__text">{label}</span>
      </label>
    )
  }
}
