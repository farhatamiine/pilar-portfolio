import { hygraphLocale, type Locale } from '../../i18n'

const HYGRAPH_ENDPOINT = process.env.HYGRAPH_ENDPOINT!
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN!

/** Convert Next.js locale slug to Hygraph Locale enum (en → en, es → es_AR) */
function toHygraphLocale(locale: string): string {
  return hygraphLocale[locale as Locale] ?? 'en'
}

async function gql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(HYGRAPH_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${HYGRAPH_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  })
  const json = await res.json()
  if (json.errors) throw new Error(`Hygraph error: ${JSON.stringify(json.errors)}`)
  return json.data
}

// ─── Shared types ────────────────────────────────────────────────────────────

export interface HygraphImage {
  url: string
  width: number
  height: number
}

export interface RichTextContent {
  raw: unknown
  html?: string
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
}

export interface Project extends ProjectSummary {
  description: RichTextContent
  coverImage: HygraphImage | null
  gallery: HygraphImage[]
  featured: boolean | null
  externalLink: string | null
  videoUrl: string | null
  location: string | null
  collaborators: string | null
}

const IMAGE_FIELDS = `url width height`

export async function getAllProjects(locale: string): Promise<ProjectSummary[]> {
  const data = await gql<{ projectS: ProjectSummary[] }>(`
    query GetAllProjects($locale: Locale!) {
      projectS(
        where: { status_project: published }
        orderBy: order_ASC
        locales: [$locale]
      ) {
        id title slug year subtitle shortDescription order
        featuredImage { ${IMAGE_FIELDS} }
      }
    }
  `, { locale: toHygraphLocale(locale) })
  return data.projectS ?? []
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const data = await gql<{ projectS: { slug: string }[] }>(`
    query GetAllSlugs {
      projectS(where: { status_project: published }) {
        slug
      }
    }
  `)
  return (data.projectS ?? []).map(p => p.slug)
}

export async function getProjectBySlug(slug: string, locale: string): Promise<Project | null> {
  const data = await gql<{ project: Project | null }>(`
    query GetProjectBySlug($slug: String!, $locale: Locale!) {
      project(where: { slug: $slug }, locales: [$locale]) {
        id title slug year subtitle shortDescription order featured
        externalLink videoUrl location collaborators
        description { raw html }
        featuredImage { ${IMAGE_FIELDS} }
        coverImage { ${IMAGE_FIELDS} }
        gallery { ${IMAGE_FIELDS} }
      }
    }
  `, { slug, locale: toHygraphLocale(locale) })
  return data.project ?? null
}

// ─── About page ──────────────────────────────────────────────────────────────

export interface AboutPage {
  heading: string | null
  subtitle: string | null
  biography: RichTextContent | null
  shortBio: string | null
  philosophy: RichTextContent | null
  profileImage: HygraphImage | null
  availability: string | null
}

export async function getAboutPage(locale: string): Promise<AboutPage | null> {
  const data = await gql<{ aboutPages: AboutPage[] }>(`
    query GetAboutPage($locale: Locale!) {
      aboutPages(first: 1, locales: [$locale]) {
        heading subtitle shortBio availability
        biography { raw html }
        philosophy { raw html }
        profileImage { ${IMAGE_FIELDS} }
      }
    }
  `, { locale: toHygraphLocale(locale) })
  return data.aboutPages?.[0] ?? null
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
  const data = await gql<{ contactInfos: ContactInfo[] }>(`
    query GetContactInfo {
      contactInfos(first: 1) {
        email phone location formHeading formDescription contactFormEnabled
      }
    }
  `)
  return data.contactInfos?.[0] ?? null
}

// ─── Site settings ────────────────────────────────────────────────────────────

export interface SiteSettings {
  siteName: string | null
  tagline: string | null
  footerText: string | null
  copyrightText: string | null
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const data = await gql<{ siteSettings: SiteSettings[] }>(`
    query GetSiteSettings {
      siteSettings(first: 1) {
        siteName tagline footerText copyrightText
      }
    }
  `)
  return data.siteSettings?.[0] ?? null
}

// ─── Exhibitions ──────────────────────────────────────────────────────────────

export type ExhibitionType = 'SOLO' | 'COLLECTIVE' | 'RESIDENCY' | 'PUBLICATION'

export interface Exhibition {
  title: string
  venue: string | null
  city: string | null
  country: string | null
  year: number
  type: ExhibitionType
}

export async function getExhibitions(locale: string): Promise<Exhibition[]> {
  const data = await gql<{ exhibitions: Exhibition[] }>(`
    query GetExhibitions($locale: Locale!) {
      exhibitions(orderBy: year_DESC, locales: [$locale]) {
        title venue city country year
      }
    }
  `, { locale: toHygraphLocale(locale) })
  return data.exhibitions ?? []
}
