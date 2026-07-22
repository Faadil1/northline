import type { ReactNode } from 'react'

interface PassportSheetProps {
  number: number
  status: 'locked' | 'open' | 'expired'
  statusText: string
  kind: string
  settling?: boolean
  children: ReactNode
}

/**
 * PassportSheet — one operational sheet on the shared document spine.
 * One physical handoff = one sheet. Sheets accumulate; they are never cards.
 */
export function PassportSheet({
  number,
  status,
  statusText,
  kind,
  settling = false,
  children,
}: PassportSheetProps) {
  const classes = [
    'sheet',
    `sheet--${status}`,
    settling ? 'sheet--settling' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article className={classes} aria-label={`Sheet ${String(number).padStart(2, '0')} — ${statusText}`}>
      <header className="sheet__band">
        <span className="label label--band sheet__band-kind">{kind}</span>
        <span className="label label--band">
          Sheet {String(number).padStart(2, '0')}
        </span>
      </header>
      <div className="sheet__body">
        <h3 className="label label--state sheet__state">{statusText}</h3>
        {children}
      </div>
    </article>
  )
}
