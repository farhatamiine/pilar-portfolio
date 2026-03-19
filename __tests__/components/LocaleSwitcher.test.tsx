import { render, screen } from '@testing-library/react'
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher'

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}))

jest.mock('next/navigation', () => ({
  usePathname: () => '/en/work/changement-detat',
}))

jest.mock('next/link', () => {
  return function MockLink({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) {
    return <a href={href} className={className}>{children}</a>
  }
})

test('renders both locale labels', () => {
  render(<LocaleSwitcher />)
  expect(screen.getByText('ES')).toBeInTheDocument()
  expect(screen.getByText('EN')).toBeInTheDocument()
})

test('active locale link has text-accent class', () => {
  render(<LocaleSwitcher />)
  const enLink = screen.getByText('EN').closest('a')
  expect(enLink).toHaveClass('text-accent')
})

test('inactive locale links to correct path', () => {
  render(<LocaleSwitcher />)
  const esLink = screen.getByText('ES').closest('a')
  expect(esLink).toHaveAttribute('href', '/es/work/changement-detat')
})
