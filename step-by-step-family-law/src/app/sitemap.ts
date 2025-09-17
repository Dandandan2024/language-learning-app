import { MetadataRoute } from 'next'
import { buildGuideIndex } from '@/lib/notion-map'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://stepbystepfamilylaw.com.au'

  const staticEntries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  const ROOT_PAGE_ID = '500b3fa1c5e24a94b7b5b9e93550496c'
  let guideEntries: MetadataRoute.Sitemap = []
  try {
    const guides = await buildGuideIndex(ROOT_PAGE_ID)
    guideEntries = guides.map((g) => ({
      url: `${baseUrl}/guides/${g.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  } catch {
    guideEntries = []
  }

  return [...staticEntries, ...guideEntries]
}