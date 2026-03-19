/**
 * @jest-environment node
 */
import { POST } from '@/app/api/revalidate/route'

const mockRevalidatePath = jest.fn()
jest.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

beforeEach(() => {
  jest.clearAllMocks()
  process.env.REVALIDATE_SECRET = 'test-secret'
})

test('returns 401 for incorrect secret', async () => {
  const req = new Request('http://localhost/api/revalidate?secret=wrong-secret')
  const res = await POST(req)
  expect(res.status).toBe(401)
  expect(mockRevalidatePath).not.toHaveBeenCalled()
})

test('revalidates all locale paths for a slug when secret is correct', async () => {
  const req = new Request('http://localhost/api/revalidate?secret=test-secret&slug=la-tisseuse')
  const res = await POST(req)
  expect(res.status).toBe(200)
  expect(mockRevalidatePath).toHaveBeenCalledWith('/fr/work/la-tisseuse')
  expect(mockRevalidatePath).toHaveBeenCalledWith('/es/work/la-tisseuse')
  expect(mockRevalidatePath).toHaveBeenCalledWith('/en/work/la-tisseuse')
  expect(mockRevalidatePath).toHaveBeenCalledWith('/fr')
  expect(mockRevalidatePath).toHaveBeenCalledWith('/es')
  expect(mockRevalidatePath).toHaveBeenCalledWith('/en')
})

test('revalidates entire layout when no slug given', async () => {
  const req = new Request('http://localhost/api/revalidate?secret=test-secret')
  const res = await POST(req)
  expect(res.status).toBe(200)
  expect(mockRevalidatePath).toHaveBeenCalledWith('/', 'layout')
})
