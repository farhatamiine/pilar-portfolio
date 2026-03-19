import { render, screen } from '@testing-library/react'
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher'

jest.mock('next-intl', () => ({
  usePathname: () => '/work/changement-detat',
  useLocale: () => 'fr',
}))

jest.mock('next/link', () => {
  return function MockLink({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) {
    return <a href={href} className={className}>{children}</a>
  }
})

test('renders all three locale labels', () => {
  render(<LocaleSwitcher />)
  expect(screen.getByText('FR')).toBeInTheDocument()
  expect(screen.getByText('ES')).toBeInTheDocument()
  expect(screen.getByText('EN')).toBeInTheDocument()
})

test('active locale link has text-accent class', () => {
  render(<LocaleSwitcher />)
  const frLink = screen.getByText('FR').closest('a')
  expect(frLink).toHaveClass('text-accent')
})

test('inactive locales link to correct paths', () => {
  render(<LocaleSwitcher />)
  const esLink = screen.getByText('ES').closest('a')
  expect(esLink).toHaveAttribute('href', '/es/work/changement-detat')
})
