import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

export type NotionBlock = any

export async function fetchPageBlocks(pageId: string) {
  const blocks: NotionBlock[] = []
  let cursor: string | undefined = undefined

  while (true) {
    const response = await notion.blocks.children.list({
      block_id: pageId,
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
  const page = await notion.pages.retrieve({ page_id: pageId }) as any
  return page
}