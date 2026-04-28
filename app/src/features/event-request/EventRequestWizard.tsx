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

export function EventRequestWizard() {
  const methods = useForm<EventRequestData>({
    resolver: zodResolver(eventRequestSchema),
    mode: 'onBlur',
    defaultValues: emptyEventRequest,
  })
  const nav = useStepNavigation(7)
  const { trackLead } = useLeadTracking(methods.getValues)

  const onStepNext = (currentStep: number) => async () => {
    await trackLead(currentStep)
    nav.next()
  }

  const onSubmit = async (data: EventRequestData) => {
    await trackLead(7)
    console.log('EVENT REQUEST SUBMITTED:', data)
    resetLeadId()  // fresh ID for next session
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
            onSubmit={methods.handleSubmit(onSubmit)}
          />
        )}
        {nav.step === 8 && <ConfirmationScreen key="8" onNew={() => nav.goTo(1)} />}
      </AnimatePresence>
    </FormProvider>
  )
}
