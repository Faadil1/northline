import { useCustody } from '@/state/CustodyContext'
import type { Role } from '@/types/custody'

const ROLES: Array<{ role: Role; label: string }> = [
  { role: 'receiver', label: 'Receiver' },
  { role: 'dispatcher', label: 'Dispatcher' },
  { role: 'customer', label: 'Customer' },
]

/** RoleSwitcher — demonstration only. Not part of the product. */
export function RoleSwitcher() {
  const { state, dispatch } = useCustody()

  return (
    <div
      className="role-switcher"
      role="group"
      aria-label="Demo role switcher (demonstration only)"
    >
      {ROLES.map(({ role, label }) => (
        <button
          key={role}
          type="button"
          className="role-switcher__btn"
          aria-pressed={state.role === role}
          onClick={() => dispatch({ type: 'SET_ROLE', role })}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
