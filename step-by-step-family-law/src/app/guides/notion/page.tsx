import Link from 'next/link'
import { fetchChildPages, normalizeNotionId } from '@/lib/notion'

const ROOT_PAGE_ID = '500b3fa1c5e24a94b7b5b9e93550496c'

export const dynamic = 'force-static'

export default async function NotionIndexPage() {
  const pages = await fetchChildPages(ROOT_PAGE_ID)
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Notion Site Index</h1>
        <p className="text-sm text-gray-600 mb-6">Listing child pages from your Notion site. Click to view.</p>
        <ul className="space-y-3">
          {pages.map((p) => (
            <li key={p.id}>
              <Link className="text-blue-600 hover:text-blue-800 underline" href={`/guides/notion/${normalizeNotionId(p.id)}`}>
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}