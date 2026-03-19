import { render } from '@testing-library/react'
import { NoiseOverlay } from '@/components/ui/NoiseOverlay'

test('renders without crashing', () => {
  const { container } = render(<NoiseOverlay />)
  expect(container.firstChild).not.toBeNull()
})

test('has aria-hidden for screen readers', () => {
  const { container } = render(<NoiseOverlay />)
  const el = container.firstChild as HTMLElement
  expect(el.getAttribute('aria-hidden')).toBe('true')
})
