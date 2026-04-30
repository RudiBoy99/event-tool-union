import { useNavigate, useSearchParams } from 'react-router-dom'

export function useStepNavigation(totalSteps = 7) {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const step = Math.min(Math.max(Number(params.get('step') ?? 1), 1), totalSteps)

  const go = (n: number) => {
    const next = Math.min(Math.max(n, 1), totalSteps)
    const newParams = new URLSearchParams(params)
    newParams.set('step', String(next))
    setParams(newParams)
  }

  const back = () => {
    if (step > 1) {
      go(step - 1)
    } else {
      navigate('/')
    }
  }

  return {
    step,
    next: () => go(step + 1),
    back,
    goTo: go,
  }
}
