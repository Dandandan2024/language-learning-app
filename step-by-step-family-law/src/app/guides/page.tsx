import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { buildGuideIndex } from '@/lib/notion-map'

const ROOT_PAGE_ID = '500b3fa1c5e24a94b7b5b9e93550496c'

export const revalidate = 300

export default async function GuidesPage() {
  let guides: { id: string; title: string; slug: string }[] = []
  let hadError = false
  try {
    guides = await buildGuideIndex(ROOT_PAGE_ID)
  } catch {
    hadError = true
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Step-by-Step Family Law Guides
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
              Live guides powered by your Notion workspace.
            </p>
            {hadError && (
              <p className="mt-2 text-sm text-yellow-800 bg-yellow-50 inline-block px-3 py-1 rounded">
                Some content could not be loaded. Ensure the Notion integration has access to all subpages/databases.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {guides.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {guides.map((g) => (
                <Link key={g.id} href={`/guides/${g.slug}`} className="block rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900">{g.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">Step-by-step instructions and resources.</p>
                  <span className="mt-4 inline-flex items-center text-blue-600 text-sm">
                    Open guide <ArrowRight className="h-4 w-4 ml-1" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p>No live guides available yet.</p>
              <p className="text-sm mt-1">Once Notion access is granted, guides will appear here automatically.</p>
              <p className="text-sm mt-3">
                You can still browse Notion directly under <Link href="/guides/notion" className="text-blue-600 underline">Guides → Notion Index</Link>.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}