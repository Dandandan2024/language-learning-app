import Renderer from '@/components/notion/Renderer'
import { fetchPageTreeWithWarnings, normalizeNotionId } from '@/lib/notion'

export const dynamic = 'force-dynamic'
export const revalidate = 300

export default async function NotionDynamicPage({ params }: { params: { id: string } }) {
  const id = normalizeNotionId(params.id)
  const { blocks, warnings } = await fetchPageTreeWithWarnings(id)

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Notion Page</h1>
        {warnings.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800 mb-6">
            Some content could not be retrieved. Please ensure your Notion integration has access to all linked subpages and databases.
          </div>
        )}
        <Renderer blocks={blocks} />
      </div>
    </div>
  )
}