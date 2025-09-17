/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

export type NotionBlock = any

export function normalizeNotionId(id: string): string {
  const clean = id.replace(/[^a-fA-F0-9]/g, '')
  if (clean.length !== 32) return id
  return `${clean.substring(0, 8)}-${clean.substring(8, 12)}-${clean.substring(12, 16)}-${clean.substring(16, 20)}-${clean.substring(20)}`
}

async function withRetry<T>(fn: () => Promise<T>, warnings?: string[], label?: string, retries = 3, delayMs = 400): Promise<T> {
  let lastErr: any
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn()
    } catch (e: any) {
      lastErr = e
      if (warnings && e?.code) {
        const msg = `${label || 'notion'}: ${e.code}${e?.message ? ` - ${e.message}` : ''}`
        if (!warnings.includes(msg)) warnings.push(msg)
      }
      if (attempt < retries - 1) await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, attempt)))
    }
  }
  throw lastErr
}

export async function listChildren(blockId: string, warnings?: string[]) {
  const id = normalizeNotionId(blockId)
  const blocks: NotionBlock[] = []
  let cursor: string | undefined = undefined

  while (true) {
    const response = await withRetry(
      () => notion.blocks.children.list({ block_id: id, page_size: 100, start_cursor: cursor }),
      warnings,
      `blocks.children.list(${id})`
    )

    blocks.push(...response.results)

    if (!response.has_more || !response.next_cursor) break
    cursor = response.next_cursor

    // small pacing to avoid rate limits
    await new Promise((r) => setTimeout(r, 120))
  }

  return blocks
}

export async function fetchPageBlocks(pageOrBlockId: string, warnings?: string[]) {
  return listChildren(pageOrBlockId, warnings)
}

export async function fetchSyncedBlockChildren(block: any, warnings?: string[]): Promise<NotionBlock[]> {
  const from = block?.synced_block?.synced_from
  if (from?.block_id) {
    return listChildren(from.block_id, warnings)
  }
  return listChildren(block.id, warnings)
}

export async function listDatabaseItems(databaseId: string, warnings?: string[]) {
  const id = normalizeNotionId(databaseId)
  const pages: any[] = []
  let cursor: string | undefined = undefined
  while (true) {
    const client: any = notion as any
    const res: any = await withRetry(
      () => client.databases.query({ database_id: id, start_cursor: cursor }),
      warnings,
      `databases.query(${id})`
    )
    pages.push(...res.results)
    if (!res.has_more || !res.next_cursor) break
    cursor = res.next_cursor
    await new Promise((r) => setTimeout(r, 120))
  }
  return pages
}

export async function fetchPageTree(pageOrBlockId: string): Promise<NotionBlock[]> {
  const { blocks } = await fetchPageTreeWithWarnings(pageOrBlockId)
  return blocks
}

export async function fetchPageTreeWithWarnings(pageOrBlockId: string): Promise<{ blocks: NotionBlock[]; warnings: string[] }> {
  const warnings: string[] = []
  const rootBlocks = await listChildren(pageOrBlockId, warnings)
  const result: NotionBlock[] = []

  for (const block of rootBlocks) {
    const enriched = { ...block } as any

    if (block.type === 'synced_block') {
      try {
        enriched.children = await fetchSyncedBlockChildren(block, warnings)
      } catch (e: any) {
        warnings.push(`synced_block children error: ${e?.code || e?.message || 'unknown'}`)
        enriched.children = []
      }
      result.push(enriched)
      continue
    }

    if (block.type === 'child_database') {
      try {
        const items = await listDatabaseItems(block.id, warnings)
        enriched.database_items = items
      } catch (e: any) {
        warnings.push(`database items error: ${e?.code || e?.message || 'unknown'}`)
        enriched.database_items = []
      }
      result.push(enriched)
      continue
    }

    if (block.has_children) {
      try {
        const subtree = await fetchPageTreeWithWarnings(block.id)
        enriched.children = subtree.blocks
        // merge warnings
        for (const w of subtree.warnings) if (!warnings.includes(w)) warnings.push(w)
      } catch (e: any) {
        warnings.push(`children error: ${e?.code || e?.message || 'unknown'}`)
        enriched.children = []
      }
    }

    result.push(enriched)
  }

  return { blocks: result, warnings }
}

export async function fetchPageMeta(pageId: string, warnings?: string[]) {
  const id = normalizeNotionId(pageId)
  const page = await withRetry(() => notion.pages.retrieve({ page_id: id }) as any, warnings, `pages.retrieve(${id})`)
  return page
}

export async function fetchChildPages(rootPageId: string) {
  const warnings: string[] = []
  const root = normalizeNotionId(rootPageId)
  const children = await listChildren(root, warnings)
  const childPages: { id: string; title: string }[] = []

  for (const block of children) {
    if (block.type === 'child_page') {
      childPages.push({ id: block.id, title: block.child_page?.title || 'Untitled' })
    }
    if (block.type === 'child_database') {
      try {
        const items = await listDatabaseItems(block.id, warnings)
        for (const page of items) {
          childPages.push({ id: page.id, title: extractTitleFromPage(page) })
        }
      } catch {
        // ignore
      }
    }
  }

  return childPages
}

export function extractTitleFromPage(page: any): string {
  const props = page?.properties || {}
  const titleProp = Object.values(props).find((p: any) => p?.type === 'title') as any
  const title = titleProp?.title?.map((t: any) => t.plain_text).join('')
  return title || 'Untitled'
}