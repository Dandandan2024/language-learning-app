import Renderer from '@/components/notion/Renderer'
import { fetchPageBlocks, normalizeNotionId } from '@/lib/notion'

export const dynamic = 'force-dynamic'

export default async function NotionDynamicPage({ params }: { params: { id: string } }) {
  const id = normalizeNotionId(params.id)
  const blocks = await fetchPageBlocks(id)

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Notion Page</h1>
        <Renderer blocks={blocks} />
      </div>
    </div>
  )
}