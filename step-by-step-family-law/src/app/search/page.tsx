import { buildGuideIndex } from '@/lib/notion-map'
import Link from 'next/link'

export const revalidate = 300

function SearchClient({ guides }: { guides: { title: string; slug: string }[] }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <input
        type="text"
        placeholder="Search guides..."
        className="w-full border border-gray-300 rounded-md px-3 py-2"
        onChange={(e) => {
          const q = e.target.value.toLowerCase()
          document.querySelectorAll<HTMLAnchorElement>('[data-guide]')?.forEach((el) => {
            const t = el.getAttribute('data-title')?.toLowerCase() || ''
            el.parentElement!.classList.toggle('hidden', q.length > 0 && !t.includes(q))
          })
        }}
      />
      <ul className="mt-6 space-y-2">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link data-guide data-title={g.title} href={`/guides/${g.slug}`} className="text-blue-600 hover:text-blue-800 underline">
              {g.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

const ROOT_PAGE_ID = '500b3fa1c5e24a94b7b5b9e93550496c'

export default async function SearchPage() {
  let guides: { title: string; slug: string }[] = []
  try {
    const idx = await buildGuideIndex(ROOT_PAGE_ID)
    guides = idx.map(({ title, slug }) => ({ title, slug }))
  } catch {
    guides = []
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Search Guides</h1>
        <p className="text-gray-600 mt-2">Find step-by-step guides powered by your Notion workspace.</p>
      </div>
      <SearchClient guides={guides} />
    </div>
  )
}