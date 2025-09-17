/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchChildPages, extractTitleFromPage, listDatabaseItems, normalizeNotionId, listChildren } from './notion'
import { slugify } from './slug'

const cache: { at: number; items: { id: string; title: string; slug: string }[] } = { at: 0, items: [] }

export async function buildGuideIndex(rootPageId: string) {
  const now = Date.now()
  if (now - cache.at < 5 * 60 * 1000 && cache.items.length > 0) return cache.items

  const pages = await fetchChildPages(rootPageId)
  const dedup = new Map<string, { id: string; title: string; slug: string }>()
  for (const p of pages) {
    const slug = slugify(p.title)
    if (!dedup.has(slug)) dedup.set(slug, { id: normalizeNotionId(p.id), title: p.title, slug })
  }
  cache.items = Array.from(dedup.values())
  cache.at = now
  return cache.items
}

export async function resolveGuideBySlug(rootPageId: string, slug: string) {
  const items = await buildGuideIndex(rootPageId)
  return items.find((x) => x.slug === slug)
}