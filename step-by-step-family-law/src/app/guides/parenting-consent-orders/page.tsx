'use client'

import { useEffect, useState } from 'react'
import Renderer from '@/components/notion/Renderer'
import { fetchPageBlocks } from '@/lib/notion'
import { AlertCircle } from 'lucide-react'

const NOTION_PAGE_ID = '23d711874f8b4a928a2a6bee5667b35d'

export default function ParentingConsentOrdersPage() {
  const [blocks, setBlocks] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const b = await fetchPageBlocks(NOTION_PAGE_ID)
        setBlocks(b)
      } catch (e: any) {
        setError(e?.message || 'Failed to load content')
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">How to Apply for Parenting Consent Orders</h1>
        <p className="text-sm text-gray-600 mb-8">
          Live content pulled from Notion. Ensure NOTION_TOKEN is set and the Notion page is shared with the integration.
        </p>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800">{error}</p>
                <p className="text-xs text-yellow-700 mt-2">
                  Tip: In Notion, share the page with your integration and set Vercel env var NOTION_TOKEN.
                </p>
              </div>
            </div>
          </div>
        )}

        {!blocks && !error && (
          <p className="text-gray-600">Loading content...</p>
        )}

        {blocks && <Renderer blocks={blocks} />}
      </div>
    </div>
  )
}