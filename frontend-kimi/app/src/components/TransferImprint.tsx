import { RECEIVER, SENDER, SHIPMENT } from '@/data/shipment'

interface TransferImprintProps {
  acceptedAt: string | null
  settling: boolean
}

/**
 * Transfer Imprint — the permanent record embedded into a sheet on acceptance.
 * Rendered exactly once per sheet. Never removable, never editable.
 */
export function TransferImprint({ acceptedAt, settling }: TransferImprintProps) {
  return (
    <section
      className={settling ? 'imprint imprint--settling' : 'imprint'}
      aria-label="Transfer Imprint"
    >
      <h4 className="label imprint__title">Transfer Imprint — Permanent</h4>
      <dl className="imprint__grid">
        <div>
          <dt>From</dt>
          <dd>{SENDER.name}</dd>
        </div>
        <div>
          <dt>To</dt>
          <dd>{RECEIVER.name}</dd>
        </div>
        <div>
          <dt>Accepted by</dt>
          <dd>{RECEIVER.operator}</dd>
        </div>
        <div>
          <dt>Recorded</dt>
          <dd>{acceptedAt ?? '—'}</dd>
        </div>
        <div>
          <dt>Load / Seal</dt>
          <dd>
            {SHIPMENT.load} · {SHIPMENT.seal}
          </dd>
        </div>
        <div>
          <dt>Units / Condition</dt>
          <dd>
            {SHIPMENT.unitsConfirmed} / {SHIPMENT.unitsExpected} · {SHIPMENT.conditionLabel}
          </dd>
        </div>
      </dl>
    </section>
  )
}
