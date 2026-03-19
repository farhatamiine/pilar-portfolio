import { render, screen } from '@testing-library/react'
import { RichText } from '@/components/ui/RichText'

test('renders html string content', () => {
  render(<RichText html="<p>Hello <em>world</em></p>" />)
  expect(screen.getByText(/Hello/)).toBeInTheDocument()
})

test('renders nothing when html is null', () => {
  const { container } = render(<RichText html={null} />)
  expect(container.firstChild).toBeNull()
})

test('renders nothing when html is undefined', () => {
  const { container } = render(<RichText html={undefined} />)
  expect(container.firstChild).toBeNull()
})

test('applies custom className', () => {
  const { container } = render(<RichText html="<p>text</p>" className="my-class" />)
  expect(container.firstChild).toHaveClass('my-class')
})
