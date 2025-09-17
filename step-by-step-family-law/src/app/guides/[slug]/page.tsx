import { resolveGuideBySlug } from '@/lib/notion-map'
import { fetchPageTree } from '@/lib/notion'
import Renderer from '@/components/notion/Renderer'
import { notFound } from 'next/navigation'

const ROOT_PAGE_ID = '500b3fa1c5e24a94b7b5b9e93550496c'

export const revalidate = 300

export default async function GuideBySlugPage({ params }: { params: { slug: string } }) {
  const found = await resolveGuideBySlug(ROOT_PAGE_ID, params.slug)
  if (!found) return notFound()

  const blocks = await fetchPageTree(found.id)

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{found.title}</h1>
        <Renderer blocks={blocks} />
      </div>
    </div>
  )
}