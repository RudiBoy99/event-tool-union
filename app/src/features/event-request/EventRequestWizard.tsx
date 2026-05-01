import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence } from 'framer-motion'
import { eventRequestSchema, emptyEventRequest, type EventRequestData } from './schema'
import { useStepNavigation } from './hooks/useStepNavigation'
import { useLeadTracking, resetLeadId } from './hooks/useLeadTracking'
import { ContactStep } from './steps/ContactStep'
import { LocationStep } from './steps/LocationStep'
import { DateDurationStep } from './steps/DateDurationStep'
import { EventTypeStep } from './steps/EventTypeStep'
import { AttendeesSportStep } from './steps/AttendeesSportStep'
import { ExtrasStep } from './steps/ExtrasStep'
import { ReviewSubmitStep } from './steps/ReviewSubmitStep'
import { ConfirmationScreen } from './steps/ConfirmationScreen'

// Map first invalid field path to the wizard step that owns it
const FIELD_TO_STEP: Array<{ match: (path: string) => boolean; step: number }> = [
  { match: (p) => p.startsWith('contact'),    step: 1 },
  { match: (p) => p === 'eventType',          step: 2 },
  { match: (p) => p.startsWith('attendees') || p.startsWith('sports'), step: 3 },
  { match: (p) => p === 'location',           step: 4 },
  { match: (p) => p.startsWith('dateTime'),   step: 5 },
  { match: (p) => p.startsWith('gastro') || p.startsWith('rooms') || p.startsWith('extras'), step: 6 },
]

function firstInvalidStep(errors: Record<string, unknown>): number | null {
  const paths = Object.keys(errors)
  for (const p of paths) {
    const m = FIELD_TO_STEP.find((r) => r.match(p))
    if (m) return m.step
  }
  return null
}

export function EventRequestWizard() {
  const methods = useForm<EventRequestData>({
    resolver: zodResolver(eventRequestSchema),
    mode: 'onBlur',
    defaultValues: emptyEventRequest,
  })
  const nav = useStepNavigation(8)
  const { trackLead } = useLeadTracking(methods.getValues)

  const onStepNext = (currentStep: number) => async () => {
    await trackLead(currentStep)
    nav.next()
  }

  const submitFromReview = async (): Promise<void> => {
    const ok = await methods.trigger()
    if (!ok) {
      const errors = methods.formState.errors as Record<string, unknown>
      const target = firstInvalidStep(errors)
      // Surface a structured error so the review step can render a banner
      const fields = Object.keys(errors).flatMap((k) => {
        const sub = (errors as any)[k]
        if (sub && typeof sub === 'object' && !sub.message) {
          return Object.keys(sub).map((nested) => `${k}.${nested}`)
        }
        return [k]
      })
      const err = new Error('VALIDATION_FAILED') as Error & { fields: string[]; targetStep: number | null }
      err.fields = fields
      err.targetStep = target
      throw err
    }
    const data = methods.getValues()
    await trackLead(7)
    console.log('EVENT REQUEST SUBMITTED:', data)
    resetLeadId()
    nav.goTo(8)
  }

  return (
    <FormProvider {...methods}>
      <AnimatePresence mode="wait">
        {nav.step === 1 && <ContactStep key="1" step={1} onBack={nav.back} onNext={onStepNext(1)} />}
        {nav.step === 2 && <EventTypeStep key="2" step={2} onBack={nav.back} onNext={onStepNext(2)} />}
        {nav.step === 3 && <AttendeesSportStep key="3" step={3} onBack={nav.back} onNext={onStepNext(3)} />}
        {nav.step === 4 && <LocationStep key="4" step={4} onBack={nav.back} onNext={onStepNext(4)} />}
        {nav.step === 5 && <DateDurationStep key="5" step={5} onBack={nav.back} onNext={onStepNext(5)} />}
        {nav.step === 6 && <ExtrasStep key="6" step={6} onBack={nav.back} onNext={onStepNext(6)} />}
        {nav.step === 7 && (
          <ReviewSubmitStep
            key="7"
            step={7}
            onBack={nav.back}
            onSubmit={submitFromReview}
            onJumpToStep={(s) => nav.goTo(s)}
          />
        )}
        {nav.step === 8 && <ConfirmationScreen key="8" onNew={() => nav.goTo(1)} />}
      </AnimatePresence>
    </FormProvider>
  )
}
