import { useCallback, useEffect, useRef } from 'react'
import type { EventRequestData } from '../schema'

const STORAGE_KEY = 'union-sport-lead-id'

const STEP_STATUS: Record<number, string> = {
  1: 'KONTAKT',
  2: 'EVENT_TYP',
  3: 'SPORT_GEWAEHLT',
  4: 'STANDORT_GEWAEHLT',
  5: 'DATUM_GEWAEHLT',
  6: 'EXTRAS',
  7: 'SUBMITTED',
}

function getOrCreateLeadId(): string {
  if (typeof window === 'undefined') return ''
  let id = window.localStorage.getItem(STORAGE_KEY)
  if (!id) {
    id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    window.localStorage.setItem(STORAGE_KEY, id)
  }
  return id
}

export function resetLeadId() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}

export function useLeadTracking(getValues: () => EventRequestData) {
  const leadIdRef = useRef<string>('')

  useEffect(() => {
    leadIdRef.current = getOrCreateLeadId()
  }, [])

  const trackLead = useCallback(async (step: number) => {
    if (step < 1 || step > 7) return
    const leadId = leadIdRef.current || getOrCreateLeadId()
    const data = getValues()
    // Don't track without at least an email
    if (!data.contact?.email) return

    try {
      await fetch('/api/track-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          status: STEP_STATUS[step] ?? 'UNKNOWN',
          step,
          data,
        }),
      })
    } catch (err) {
      // silent fail — never block UX on tracking
      console.warn('lead tracking failed', err)
    }
  }, [getValues])

  return { trackLead }
}
