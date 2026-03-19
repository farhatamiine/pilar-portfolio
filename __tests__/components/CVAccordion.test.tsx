import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CVAccordion } from '@/components/about/CVAccordion'
import type { Exhibition } from '@/lib/hygraph'

const mockExhibitions: Exhibition[] = [
  { title: 'Solo Show Paris', venue: 'Galerie X', city: 'Paris', country: 'France', year: 2024, type: 'SOLO' },
  { title: 'Group Berlin', venue: 'Museum Y', city: 'Berlin', country: 'Germany', year: 2023, type: 'COLLECTIVE' },
  { title: 'NY Residency', venue: 'Studio Z', city: 'New York', country: 'USA', year: 2022, type: 'RESIDENCY' },
]

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))
jest.mock('framer-motion', () => ({
  motion: {
    span: ({ children, ...p }: React.HTMLAttributes<HTMLSpanElement>) => <span {...p}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

test('renders section toggle buttons for each type present', () => {
  render(<CVAccordion exhibitions={mockExhibitions} />)
  expect(screen.getByRole('button', { name: /solo/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /collective/i })).toBeInTheDocument()
})

test('solo section is open by default and shows entries', () => {
  render(<CVAccordion exhibitions={mockExhibitions} />)
  expect(screen.getByText('Solo Show Paris')).toBeInTheDocument()
})

test('clicking a closed section opens it', async () => {
  const user = userEvent.setup()
  render(<CVAccordion exhibitions={mockExhibitions} />)
  await user.click(screen.getByRole('button', { name: /collective/i }))
  expect(screen.getByText('Group Berlin')).toBeInTheDocument()
})

test('types with no entries are not rendered', () => {
  render(<CVAccordion exhibitions={mockExhibitions} />)
  expect(screen.queryByRole('button', { name: /publication/i })).toBeNull()
})
