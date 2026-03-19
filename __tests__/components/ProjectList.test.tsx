import { render, screen } from '@testing-library/react'
import { ProjectList } from '@/components/home/ProjectList'
import type { ProjectSummary } from '@/lib/hygraph'

const mockProjects: ProjectSummary[] = [
  { id: '1', title: "Changement d'état", slug: 'changement-detat', year: 2025, subtitle: null, shortDescription: null, featuredImage: null, order: 1 },
  { id: '2', title: 'La Tisseuse', slug: 'la-tisseuse', year: 2025, subtitle: null, shortDescription: null, featuredImage: null, order: 2 },
]

jest.mock('next-intl', () => ({ useLocale: () => 'en' }))
jest.mock('framer-motion', () => ({
  motion: {
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => <span {...props}>{children}</span>,
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}))

test('renders all project titles', () => {
  render(<ProjectList projects={mockProjects} />)
  expect(screen.getByText(/Changement d'état/)).toBeInTheDocument()
  expect(screen.getByText(/La Tisseuse/)).toBeInTheDocument()
})

test('renders zero-padded index numbers', () => {
  render(<ProjectList projects={mockProjects} />)
  expect(screen.getByText('01')).toBeInTheDocument()
  expect(screen.getByText('02')).toBeInTheDocument()
})

test('each project item links to correct locale + slug path', () => {
  render(<ProjectList projects={mockProjects} />)
  const links = screen.getAllByRole('link')
  const slugLink = links.find(l => l.getAttribute('href') === '/en/work/changement-detat')
  expect(slugLink).toBeTruthy()
})
