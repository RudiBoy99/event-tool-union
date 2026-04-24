import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { EventRequestWizard } from '@/features/event-request/EventRequestWizard'
import { HeroScreen } from '@/features/event-request/steps/HeroScreen'
import { BrandThemeProvider } from '@/features/event-request/theme/BrandThemeContext'

export default function App() {
  return (
    <BrandThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HeroScreen />} />
          <Route path="/request" element={<EventRequestWizard />} />
        </Routes>
      </BrowserRouter>
    </BrandThemeProvider>
  )
}
