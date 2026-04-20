import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { EventRequestWizard } from '@/features/event-request/EventRequestWizard'
import { HeroScreen } from '@/features/event-request/steps/HeroScreen'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeroScreen />} />
        <Route path="/request" element={<EventRequestWizard />} />
      </Routes>
    </BrowserRouter>
  )
}
