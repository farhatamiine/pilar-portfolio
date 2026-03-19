import { revalidatePath } from 'next/cache'

const LOCALES = ['fr', 'es', 'en'] as const

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (slug) {
    for (const locale of LOCALES) {
      revalidatePath(`/${locale}/work/${slug}`)
      revalidatePath(`/${locale}`)
    }
    return Response.json({ revalidated: true, slug })
  }

  revalidatePath('/', 'layout')
  return Response.json({ revalidated: true, slug: 'all' })
}
