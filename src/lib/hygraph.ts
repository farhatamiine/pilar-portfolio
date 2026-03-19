const HYGRAPH_ENDPOINT = process.env.HYGRAPH_ENDPOINT!
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN!
const HYGRAPH_SITE_SETTING_ID = process.env.HYGRAPH_SITE_SETTING_ID!

async function gql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(HYGRAPH_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${HYGRAPH_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  })
  const json = await res.json()
  if (json.errors) throw new Error(`Hygraph error: ${JSON.stringify(json.errors)}`)
  return json.data
}

export interface HygraphImage {
  url: string
  width: number
  height: number
}

export interface RichTextContent {
  raw: unknown
  html?: string
}

export interface ProjectSummary {
  id: string
  title: string
  slug: string
  year: number
  subtitle: string | null
  shortDescription: string | null
  featuredImage: HygraphImage | null
  order: number
}

export interface Project extends ProjectSummary {
  description: RichTextContent | null
  coverImage: HygraphImage | null
  gallery: HygraphImage[]
  featured: boolean
  hasTwoStages: boolean
  stageTwoContent: RichTextContent | null
  externalLink: string | null
}

export interface SiteMeta {
  bio: RichTextContent | null
  profilePhoto: HygraphImage | null
  instagramUrl: string | null
  email: string | null
}

export type ExhibitionType = 'SOLO' | 'COLLECTIVE' | 'RESIDENCY' | 'PUBLICATION'

export interface Exhibition {
  title: string
  venue: string | null
  city: string | null
  country: string | null
  year: number
  type: ExhibitionType
}

const IMAGE_FIELDS = `url width height`

export async function getAllProjects(locale: string): Promise<ProjectSummary[]> {
  const data = await gql<{ projects: ProjectSummary[] }>(`
    query GetAllProjects($locale: Locale!) {
      projects(
        where: { status_project: PUBLISHED }
        orderBy: order_ASC
        locales: [$locale]
      ) {
        id title slug year subtitle shortDescription order
        featuredImage { ${IMAGE_FIELDS} }
      }
    }
  `, { locale })
  return data.projects
}

export async function getProjectBySlug(slug: string, locale: string): Promise<Project> {
  const data = await gql<{ project: Project }>(`
    query GetProjectBySlug($slug: String!, $locale: Locale!) {
      project(where: { slug: $slug }, locales: [$locale]) {
        id title slug year subtitle shortDescription order featured
        hasTwoStages externalLink
        description { raw html }
        stageTwoContent { raw html }
        featuredImage { ${IMAGE_FIELDS} }
        coverImage { ${IMAGE_FIELDS} }
        gallery { ${IMAGE_FIELDS} }
      }
    }
  `, { slug, locale })
  return data.project
}

export async function getSiteMeta(locale: string): Promise<SiteMeta> {
  const data = await gql<{ siteSetting: SiteMeta }>(`
    query GetSiteMeta($id: ID!, $locale: Locale!) {
      siteSetting(where: { id: $id }, locales: [$locale]) {
        bio { raw html }
        profilePhoto { ${IMAGE_FIELDS} }
        instagramUrl
        email
      }
    }
  `, { id: HYGRAPH_SITE_SETTING_ID, locale })
  return data.siteSetting
}

export async function getExhibitions(locale: string): Promise<Exhibition[]> {
  const data = await gql<{ exhibitions: Exhibition[] }>(`
    query GetExhibitions($locale: Locale!) {
      exhibitions(orderBy: year_DESC, locales: [$locale]) {
        title venue city country year type
      }
    }
  `, { locale })
  return data.exhibitions
}
