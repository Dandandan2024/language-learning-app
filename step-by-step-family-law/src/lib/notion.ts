/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

export type NotionBlock = any

export function normalizeNotionId(id: string): string {
  const clean = id.replace(/[^a-fA-F0-9]/g, '')
  if (clean.length !== 32) return id
  return `${clean.substring(0, 8)}-${clean.substring(8, 12)}-${clean.substring(12, 16)}-${clean.substring(16, 20)}-${clean.substring(20)}`
}

export async function listChildren(blockId: string) {
  const id = normalizeNotionId(blockId)
  const blocks: NotionBlock[] = []
  let cursor: string | undefined = undefined

  while (true) {
    const response = await notion.blocks.children.list({
      block_id: id,
      page_size: 100,
      start_cursor: cursor,
    })

    blocks.push(...response.results)

    if (!response.has_more || !response.next_cursor) break
    cursor = response.next_cursor
  }

  return blocks
}

export async function fetchPageBlocks(pageOrBlockId: string) {
  // Kept for compatibility: non-recursive
  return listChildren(pageOrBlockId)
}

export async function fetchPageTree(pageOrBlockId: string): Promise<NotionBlock[]> {
  const rootBlocks = await listChildren(pageOrBlockId)
  const result: NotionBlock[] = []

  for (const block of rootBlocks) {
    const enriched = { ...block } as any
    if (block.has_children) {
      // Recursively fetch children
      enriched.children = await fetchPageTree(block.id)
    }

    // Some composite types reference external content; we just pass through
    result.push(enriched)
  }

  return result
}

export async function fetchPageMeta(pageId: string) {
  const id = normalizeNotionId(pageId)
  const page = await notion.pages.retrieve({ page_id: id }) as any
  return page
}

export async function fetchChildPages(rootPageId: string) {
  const root = normalizeNotionId(rootPageId)
  const children = await listChildren(root)
  const childPages: { id: string; title: string }[] = []

  for (const block of children) {
    if (block.type === 'child_page') {
      childPages.push({ id: block.id, title: block.child_page?.title || 'Untitled' })
    }
    if (block.has_children) {
      try {
        const nested = await notion.blocks.children.list({ block_id: block.id, page_size: 100 })
        for (const b of nested.results as any[]) {
          if (b.type === 'child_page') {
            childPages.push({ id: b.id, title: b.child_page?.title || 'Untitled' })
          }
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