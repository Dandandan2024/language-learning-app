/* eslint-disable @typescript-eslint/no-explicit-any */
import Renderer from '@/components/notion/Renderer'
import { fetchPageBlocks } from '@/lib/notion'

const NOTION_PAGE_ID = '23d711874f8b4a928a2a6bee5667b35d'

export const dynamic = 'force-static'

export default async function ParentingConsentOrdersPage() {
  let blocks: any[] = []
  let error: string | null = null
  try {
    blocks = await fetchPageBlocks(NOTION_PAGE_ID)
  } catch (e: any) {
    error = e?.message || 'Failed to load content'
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">How to Apply for Parenting Consent Orders</h1>
        <p className="text-sm text-gray-600 mb-8">
          Live content pulled from Notion. Ensure NOTION_TOKEN is set and the Notion page is shared with the integration.
        </p>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">{error}</p>
            <p className="text-xs text-yellow-700 mt-2">
              Tip: In Notion, share the page with your integration and set Vercel env var NOTION_TOKEN.
            </p>
          </div>
        )}

        {!error && <Renderer blocks={blocks} />}
      </div>
    </div>
  )
}