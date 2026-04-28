// ─── Strapi v5 REST client ────────────────────────────────────────────────────

import { marked } from 'marked'

// Configure marked: no GFM tables/task lists (artist CMS doesn't use them),
// but keep line break handling natural.
marked.setOptions({ gfm: true, breaks: false })

// ─── Internal fetch wrapper ───────────────────────────────────────────────────

async function strapi<T>(path: string): Promise<T> {
  const res = await fetch(`${process.env.STRAPI_URL}/api${path}`, {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`Strapi error ${res.status}: ${path}`)
  return res.json()
}

/** Convert an array of relation names to Strapi populate params: populate[0]=a&populate[1]=b */
function populateParam(fields: string[]): string {
  return fields.map((f, i) => `populate[${i}]=${encodeURIComponent(f)}`).join('&')
}

/**
 * Fetch a collection with locale, falling back to no-locale when the requested
 * locale has no content (all CMS content currently stored as "en").
 */
async function strapiWithLocaleFallback(path: string): Promise<{ data: unknown[] }> {
  const data = await strapi<{ data: unknown[] }>(path)
  if ((data.data ?? []).length > 0) return data
  // Strip the locale=XX param and retry — gets content in whatever locale it was created
  const fallbackPath = path.replace(/[?&]locale=[^&]*/g, (m) =>
    m.startsWith('?') ? '?' : ''
  ).replace(/\?&/, '?').replace(/&&/, '&').replace(/[?&]$/, '')
  return strapi<{ data: unknown[] }>(fallbackPath)
}

// ─── Rich text ────────────────────────────────────────────────────────────────

type BlockChild = {
  type: string
  text?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
  children?: BlockChild[]
}

type StrapiBlock =
  | { type: 'paragraph'; children: BlockChild[] }
  | { type: 'heading'; level: number; children: BlockChild[] }
  | { type: 'list'; format: 'ordered' | 'unordered'; children: BlockChild[] }
  | { type: 'list-item'; children: BlockChild[] }
  | { type: 'quote'; children: BlockChild[] }
  | { type: 'image'; image: { url: string; alternativeText?: string; width?: number; height?: number } }
  | { type: string; children?: BlockChild[] }

function renderChildren(children: BlockChild[] = []): string {
  return children.map(child => {
    let text = child.text ?? renderChildren(child.children)
    if (child.bold) text = `<strong>${text}</strong>`
    if (child.italic) text = `<em>${text}</em>`
    if (child.underline) text = `<u>${text}</u>`
    if (child.strikethrough) text = `<s>${text}</s>`
    if (child.code) text = `<code>${text}</code>`
    return text
  }).join('')
}

function blocksToHtml(blocks: StrapiBlock[]): string {
  if (!Array.isArray(blocks)) return ''
  return blocks.map(block => {
    switch (block.type) {
      case 'paragraph':
        return `<p>${renderChildren(block.children)}</p>`
      case 'heading': {
        const level = (block as { type: 'heading'; level: number; children: BlockChild[] }).level ?? 2
        const inner = renderChildren((block as { type: 'heading'; level: number; children: BlockChild[] }).children)
        return `<h${level}>${inner}</h${level}>`
      }
      case 'list': {
        const b = block as { type: 'list'; format: 'ordered' | 'unordered'; children: BlockChild[] }
        const tag = b.format === 'ordered' ? 'ol' : 'ul'
        const items = b.children.map(item =>
          `<li>${renderChildren(item.children)}</li>`
        ).join('')
        return `<${tag}>${items}</${tag}>`
      }
      case 'quote': {
        const b = block as { type: 'quote'; children: BlockChild[] }
        return `<blockquote>${renderChildren(b.children)}</blockquote>`
      }
      case 'image': {
        const b = block as { type: 'image'; image: { url: string; alternativeText?: string; width?: number; height?: number } }
        const src = resolveUrl(b.image.url)
        const alt = b.image.alternativeText ?? ''
        return `<img src="${src}" alt="${alt}" />`
      }
      default: {
        const b = block as { type: string; children?: BlockChild[] }
        return b.children ? `<p>${renderChildren(b.children)}</p>` : ''
      }
    }
  }).join('\n')
}

// ─── Media helpers ────────────────────────────────────────────────────────────

function resolveUrl(url: string): string {
  if (!url) return ''
  return url.startsWith('/') ? `${process.env.STRAPI_URL}${url}` : url
}

function mapMedia(attrs: Record<string, unknown> | null | undefined): HygraphImage | null {
  if (!attrs || !attrs.url) return null
  return {
    url: resolveUrl(attrs.url as string),
    width: (attrs.width as number) ?? 0,
    height: (attrs.height as number) ?? 0,
    alternativeText: (attrs.alternativeText as string) ?? null,
  }
}

function mapMediaAsset(attrs: Record<string, unknown> | null | undefined): HygraphAsset | null {
  const base = mapMedia(attrs)
  if (!base) return null
  return { ...base, size: (attrs!.size as number) ?? 0 }
}

function mapRichText(value: unknown): RichTextContent | null {
  if (!value) return null
  // Strapi `richtext` field returns a plain string (markdown/html from WYSIWYG).
  // Strapi `blocks` field returns a structured array.
  if (typeof value === 'string') return { html: marked(value) as string }
  if (Array.isArray(value)) {
    const arr = value as StrapiBlock[]
    return { raw: arr, html: blocksToHtml(arr) }
  }
  return null
}

// ─── Shared types ────────────────────────────────────────────────────────────

export interface HygraphImage {
  url: string
  width: number
  height: number
  alternativeText?: string | null
}

export interface HygraphAsset extends HygraphImage {
  size: number
}

export interface RichTextContent {
  html: string
  raw?: StrapiBlock[]
}

// ─── Project ─────────────────────────────────────────────────────────────────

export interface ProjectSummary {
  id: string
  title: string
  slug: string
  year: number
  subtitle: string | null
  shortDescription: string | null
  featuredImage: HygraphImage | null
  order: number | null
  category: { name: string } | null
  featured: boolean | null
}

export interface Project extends ProjectSummary {
  description: RichTextContent | null
  coverImage: HygraphImage | null
  /** CSS object-position value set in Strapi, e.g. "center", "top", "50% 30%" */
  coverFocalPoint: string | null
  gallery: HygraphImage[]
  videoUrl: string | null
  location: string | null
  collaborators: string | null
  client: string | null
  equipment: string | null
  behindTheScenes: HygraphAsset[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProjectSummary(item: any): ProjectSummary {
  return {
    id: String(item.id ?? item.documentId ?? ''),
    title: item.title ?? '',
    slug: item.slug ?? '',
    year: item.year ?? 0,
    subtitle: item.subtitle ?? null,
    shortDescription: item.shortDescription ?? null,
    featuredImage: mapMedia(item.featuredImage),
    order: item.order ?? null,
    category: null,
    featured: item.featured ?? null,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProject(item: any): Project {
  const gallery: HygraphImage[] = Array.isArray(item.gallery)
    ? item.gallery.map((g: Record<string, unknown>) => mapMedia(g)).filter(Boolean) as HygraphImage[]
    : []
  const behindTheScenes: HygraphAsset[] = Array.isArray(item.behindTheScenes)
    ? item.behindTheScenes.map((a: Record<string, unknown>) => mapMediaAsset(a)).filter(Boolean) as HygraphAsset[]
    : []
  return {
    ...mapProjectSummary(item),
    description: mapRichText(item.description),
    coverImage: mapMedia(item.coverImage),
    coverFocalPoint: (item.coverFocalPoint as string) ?? null,
    gallery,
    videoUrl: item.videoUrl ?? null,
    location: item.location ?? null,
    collaborators: item.collaborators ?? null,
    client: item.client ?? null,
    equipment: item.equipment ?? null,
    behindTheScenes,
  }
}

export async function getAllProjects(locale: string): Promise<ProjectSummary[]> {
  const data = await strapiWithLocaleFallback(
    `/projects?locale=${locale}&populate[0]=featuredImage&sort=order:asc&status=published`
  )
  return (data.data ?? []).map(mapProjectSummary)
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const data = await strapi<{ data: { slug: string }[] }>(
    `/projects?fields=slug&status=published`
  )
  return (data.data ?? []).map(p => p.slug).filter(Boolean)
}

export async function getProjectBySlug(slug: string, locale: string): Promise<Project | null> {
  const populate = populateParam(['featuredImage', 'coverImage', 'gallery'])
  const data = await strapiWithLocaleFallback(
    `/projects?locale=${locale}&filters[slug][$eq]=${encodeURIComponent(slug)}&${populate}&status=published`
  )
  const item = (data.data ?? [])[0]
  return item ? mapProject(item) : null
}

// ─── About page ──────────────────────────────────────────────────────────────

export interface AboutPage {
  heading: string | null
  subtitle: string | null
  biography: RichTextContent | null
  shortBio: string | null
  philosophy: string | null
  profileImage: HygraphImage | null
  availability: string | null
}

export async function getAboutPage(locale: string): Promise<AboutPage | null> {
  try {
    let data = await strapi<{ data: unknown }>(
      `/about-page?locale=${locale}&populate[0]=profileImage`
    )
    // Fall back to no-locale if no data for the requested locale
    if (!data.data) {
      data = await strapi<{ data: unknown }>('/about-page?populate[0]=profileImage')
    }
    const item = data.data as Record<string, unknown> | null
    if (!item) return null
    return {
      heading: (item.heading as string) ?? null,
      subtitle: (item.subtitle as string) ?? null,
      biography: mapRichText(item.biography),
      shortBio: (item.shortBio as string) ?? null,
      philosophy: (item.philosophy as string) ?? null,
      profileImage: mapMedia(item.profileImage as Record<string, unknown>),
      availability: (item.availability as string) ?? null,
    }
  } catch {
    return null
  }
}

// ─── Contact info ─────────────────────────────────────────────────────────────

export interface ContactInfo {
  email: string | null
  phone: string | null
  location: string | null
  formHeading: string | null
  formDescription: string | null
  contactFormEnabled: boolean | null
}

export async function getContactInfo(): Promise<ContactInfo | null> {
  try {
    const data = await strapi<{ data: unknown }>('/contact-info')
    const item = data.data as Record<string, unknown> | null
    if (!item) return null
    return {
      email: (item.email as string) ?? null,
      phone: (item.phone as string) ?? null,
      location: (item.location as string) ?? null,
      formHeading: (item.formHeading as string) ?? null,
      formDescription: (item.formDescription as string) ?? null,
      contactFormEnabled: (item.contactFormEnabled as boolean) ?? null,
    }
  } catch {
    return null
  }
}

// ─── Site settings ────────────────────────────────────────────────────────────

export interface SiteSettings {
  siteName: string | null
  tagline: string | null
  footerText: RichTextContent | null
  copyrightText: string | null
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const data = await strapi<{ data: unknown }>('/site-setting')
    const item = data.data as Record<string, unknown> | null
    if (!item) return null
    return {
      siteName: (item.siteName as string) ?? null,
      tagline: (item.tagline as string) ?? null,
      footerText: item.footerText ? { html: item.footerText as string } : null,
      copyrightText: (item.copyrightText as string) ?? null,
    }
  } catch {
    return null
  }
}

// ─── Exhibitions ──────────────────────────────────────────────────────────────

export type ExhibitionType = 'solo' | 'collective'

export interface Exhibition {
  id: string
  title: string
  location: string | null
  year: number
  isCollective: boolean
}

export async function getExhibitions(_locale: string): Promise<Exhibition[]> {
  // No exhibition content type in Strapi yet — the component falls back to mock data.
  return []
}
