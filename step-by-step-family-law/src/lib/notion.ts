import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

export type NotionBlock = any

export function normalizeNotionId(id: string): string {
  // Accept both hyphenated and non-hyphenated; convert to hyphenated UUID
  const clean = id.replace(/[^a-fA-F0-9]/g, '')
  if (clean.length !== 32) return id
  return `${clean.substring(0, 8)}-${clean.substring(8, 12)}-${clean.substring(12, 16)}-${clean.substring(16, 20)}-${clean.substring(20)}`
}

export async function fetchPageBlocks(pageOrBlockId: string) {
  const id = normalizeNotionId(pageOrBlockId)
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

export async function fetchPageMeta(pageId: string) {
  const id = normalizeNotionId(pageId)
  const page = await notion.pages.retrieve({ page_id: id }) as any
  return page
}