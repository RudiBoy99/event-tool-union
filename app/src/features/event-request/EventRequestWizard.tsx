import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence } from 'framer-motion'
import { eventRequestSchema, emptyEventRequest, type EventRequestData } from './schema'
import { useStepNavigation } from './hooks/useStepNavigation'
import { ContactStep } from './steps/ContactStep'
import { LocationStep } from './steps/LocationStep'
import { DateDurationStep } from './steps/DateDurationStep'
import { EventTypeStep } from './steps/EventTypeStep'
import { AttendeesSportStep } from './steps/AttendeesSportStep'
import { ExtrasStep } from './steps/ExtrasStep'
import { ReviewSubmitStep } from './steps/ReviewSubmitStep'
import { ConfirmationScreen } from './steps/ConfirmationScreen'

export function EventRequestWizard() {
  const methods = useForm<EventRequestData>({
    resolver: zodResolver(eventRequestSchema),
    mode: 'onBlur',
    defaultValues: emptyEventRequest,
  })
  const nav = useStepNavigation(7)

  const onSubmit = (data: EventRequestData) => {
    console.log('EVENT REQUEST SUBMITTED:', data)
    nav.goTo(8)
  }

  return (
    <FormProvider {...methods}>
      <AnimatePresence mode="wait">
        {nav.step === 1 && <ContactStep key="1" step={1} onBack={nav.back} onNext={nav.next} />}
        {nav.step === 2 && <LocationStep key="2" step={2} onBack={nav.back} onNext={nav.next} />}
        {nav.step === 3 && <DateDurationStep key="3" step={3} onBack={nav.back} onNext={nav.next} />}
        {nav.step === 4 && <EventTypeStep key="4" step={4} onBack={nav.back} onNext={nav.next} />}
        {nav.step === 5 && <AttendeesSportStep key="5" step={5} onBack={nav.back} onNext={nav.next} />}
        {nav.step === 6 && <ExtrasStep key="6" step={6} onBack={nav.back} onNext={nav.next} />}
        {nav.step === 7 && (
          <ReviewSubmitStep
            key="7"
            step={7}
            onBack={nav.back}
            onSubmit={methods.handleSubmit(onSubmit)}
          />
        )}
        {nav.step === 8 && <ConfirmationScreen key="8" onNew={() => nav.goTo(1)} />}
      </AnimatePresence>
    </FormProvider>
  )
}
