/**
 * @jest-environment node
 */
import { POST } from '@/app/api/contact/route'

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ data: { id: 'test' }, error: null }),
    },
  })),
}))

beforeEach(() => {
  process.env.RESEND_FROM_EMAIL = 'noreply@test.com'
  process.env.CONTACT_EMAIL = 'pilar@test.com'
  process.env.RESEND_API_KEY = 'test-key'
})

test('returns 400 when required fields are missing', async () => {
  const req = new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: '', email: '', message: '' }),
  })
  const res = await POST(req)
  expect(res.status).toBe(400)
})

test('returns 400 for invalid email format', async () => {
  const req = new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', email: 'notanemail', message: 'Hello' }),
  })
  const res = await POST(req)
  expect(res.status).toBe(400)
})

test('returns 200 and success:true for valid submission', async () => {
  const req = new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test User', email: 'test@example.com', message: 'Hello Pilar' }),
  })
  const res = await POST(req)
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.success).toBe(true)
})
