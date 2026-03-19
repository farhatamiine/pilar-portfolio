import { getAllProjects, getProjectBySlug, getSiteMeta, getExhibitions } from '@/lib/hygraph'
import type { ProjectSummary, Project, SiteMeta, Exhibition } from '@/lib/hygraph'

global.fetch = jest.fn()

const mockFetch = (data: unknown) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    json: async () => ({ data }),
  })
}

beforeEach(() => {
  jest.clearAllMocks()
  process.env.HYGRAPH_ENDPOINT = 'https://mock.hygraph.com'
  process.env.HYGRAPH_TOKEN = 'mock-token'
  process.env.HYGRAPH_SITE_SETTING_ID = 'mock-id'
})

describe('getAllProjects', () => {
  it('returns ProjectSummary[] with required fields', async () => {
    const mockProject: ProjectSummary = {
      id: '1', title: 'Test', slug: 'test', year: 2025,
      subtitle: null, shortDescription: null, featuredImage: null, order: 1,
    }
    mockFetch({ projects: [mockProject] })
    const result = await getAllProjects('fr')
    expect(Array.isArray(result)).toBe(true)
    expect(result[0]).toMatchObject({ slug: 'test', year: 2025, order: 1 })
  })
})

describe('getProjectBySlug', () => {
  it('returns Project with hasTwoStages and description', async () => {
    const mockProject: Project = {
      id: '1', title: 'Test', slug: 'test', year: 2025,
      subtitle: null, shortDescription: null, featuredImage: null, order: 1,
      description: { raw: {}, html: '<p>Hello</p>' },
      coverImage: null, gallery: [], featured: false,
      hasTwoStages: false, stageTwoContent: null, externalLink: null,
    }
    mockFetch({ project: mockProject })
    const result = await getProjectBySlug('test', 'fr')
    expect(result).toHaveProperty('hasTwoStages', false)
    expect(result.description?.html).toBe('<p>Hello</p>')
  })
})

describe('getSiteMeta', () => {
  it('returns SiteMeta with bio and instagramUrl', async () => {
    const mockMeta: SiteMeta = {
      bio: { raw: {}, html: '<p>Bio</p>' },
      profilePhoto: null,
      instagramUrl: 'https://instagram.com/pilar',
      email: 'pilar@example.com',
    }
    mockFetch({ siteSetting: mockMeta })
    const result = await getSiteMeta('fr')
    expect(result.instagramUrl).toBe('https://instagram.com/pilar')
  })
})

describe('getExhibitions', () => {
  it('returns Exhibition[] with type field', async () => {
    const mockExhibitions: Exhibition[] = [
      { title: 'Solo', venue: 'Galerie X', city: 'Paris', country: 'France', year: 2024, type: 'SOLO' },
    ]
    mockFetch({ exhibitions: mockExhibitions })
    const result = await getExhibitions('fr')
    expect(result[0].type).toBe('SOLO')
  })
})
