import { useEffect, useState } from 'react'

/**
 * Detects demo mode via query parameter.
 * Public mode (default): ?demo=1 → false (demo controls hidden)
 * Internal demo mode: ?demo=1 → true (demo controls visible)
 */
export function useDemoMode(): boolean {
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const demoParam = params.get('demo')
    setIsDemoMode(demoParam === '1')
  }, [])

  return isDemoMode
}
