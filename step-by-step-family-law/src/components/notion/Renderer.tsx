/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { NotionBlock } from '@/lib/notion'

function RichText({ text }: { text: any[] }) {
  return (
    <>
      {text?.map((t, i) => {
        const content = t?.plain_text ?? ''
        const annotations = t?.annotations ?? {}
        const color = annotations.color && annotations.color !== 'default' ? annotations.color : undefined
        const Tag = annotations.bold ? 'strong' : React.Fragment
        const Inner = annotations.italic ? 'em' : React.Fragment
        const code = annotations.code
        const mark = annotations.underline
        const del = annotations.strikethrough

        let el: React.ReactNode = content
        if (code) el = <code>{content}</code>
        if (mark) el = <u>{el}</u>
        if (del) el = <s>{el}</s>

        const span = (
          <span className={color ? `notion-${color}` : undefined}>{el}</span>
        )

        return (
          <Tag key={i as any}>
            <Inner>{span}</Inner>
          </Tag>
        )
      })}
    </>
  )
}

function Children({ blocks }: { blocks?: any[] }) {
  if (!blocks || blocks.length === 0) return null
  return (
    <div className="ml-4">
      {blocks.map((b) => (
        <Block key={b.id} block={b} />
      ))}
    </div>
  )
}

function DBItems({ items }: { items?: any[] }) {
  if (!items || items.length === 0) return null
  return (
    <div className="my-4 border rounded p-3">
      <h4 className="text-sm font-semibold text-gray-800 mb-2">Database Items</h4>
      <ul className="list-disc list-inside space-y-1">
        {items.map((p) => (
          <li key={p.id} className="text-sm">
            {p.properties ? (
              <>
                {/* Try title property */}
                {(() => {
                  const titleProp = Object.values(p.properties).find((x: any) => x?.type === 'title') as any
                  const title = titleProp?.title?.map((t: any) => t.plain_text).join('')
                  return <span>{title || p.id}</span>
                })()}
              </>
            ) : (
              <span>{p.id}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Block({ block }: { block: any }) {
  const { id, type } = block
  const data = block[type]

  switch (type) {
    case 'heading_1':
      return (
        <h1 id={id} className="mt-8">
          <RichText text={data?.rich_text} />
        </h1>
      )
    case 'heading_2':
      return (
        <h2 id={id} className="mt-6">
          <RichText text={data?.rich_text} />
        </h2>
      )
    case 'heading_3':
      return (
        <h3 id={id} className="mt-4">
          <RichText text={data?.rich_text} />
        </h3>
      )
    case 'paragraph':
      return (
        <p>
          <RichText text={data?.rich_text} />
        </p>
      )
    case 'bulleted_list_item':
      return (
        <ul>
          <li>
            <RichText text={data?.rich_text} />
            <Children blocks={block.children} />
          </li>
        </ul>
      )
    case 'numbered_list_item':
      return (
        <ol>
          <li>
            <RichText text={data?.rich_text} />
            <Children blocks={block.children} />
          </li>
        </ol>
      )
    case 'to_do':
      return (
        <div className="flex items-start gap-2">
          <input type="checkbox" defaultChecked={data?.checked} readOnly className="mt-1" />
          <div>
            <RichText text={data?.rich_text} />
            <Children blocks={block.children} />
          </div>
        </div>
      )
    case 'toggle':
      return (
        <details className="my-2">
          <summary>
            <RichText text={data?.rich_text} />
          </summary>
          <Children blocks={block.children} />
        </details>
      )
    case 'callout':
      return (
        <div className="border rounded-md p-4 bg-blue-50 border-blue-200 my-4">
          <div className="flex gap-3">
            {data?.icon?.emoji && <span>{data.icon.emoji}</span>}
            <div>
              <RichText text={data?.rich_text} />
              <Children blocks={block.children} />
            </div>
          </div>
        </div>
      )
    case 'image':
      {
        const src = data?.type === 'external' ? data?.external?.url : data?.file?.url
        const caption = data?.caption?.map((t: any) => t.plain_text).join('')
        return (
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={caption || 'Image'} className="my-4 rounded" />
            {caption && <figcaption className="text-sm text-gray-500">{caption}</figcaption>}
          </figure>
        )
      }
    case 'quote':
      return (
        <blockquote>
          <RichText text={data?.rich_text} />
        </blockquote>
      )
    case 'divider':
      return <hr />
    case 'code':
      return (
        <pre>
          <code>
            {data?.rich_text?.map((t: any) => t?.plain_text).join('')}
          </code>
        </pre>
      )
    case 'column_list':
      return (
        <div className="grid md:grid-cols-2 gap-6 my-4">
          <Children blocks={block.children} />
        </div>
      )
    case 'column':
      return (
        <div>
          <Children blocks={block.children} />
        </div>
      )
    case 'table':
      return (
        <table className="w-full border-collapse border border-gray-300 my-4">
          <tbody>
            <Children blocks={block.children} />
          </tbody>
        </table>
      )
    case 'table_row':
      return (
        <tr>
          {(data?.cells || []).map((cell: any[], idx: number) => (
            <td key={idx} className="border border-gray-300 px-3 py-2">
              <RichText text={cell} />
            </td>
          ))}
        </tr>
      )
    case 'bookmark':
      return (
        <div className="my-3">
          <a className="text-blue-600 underline break-all" href={data?.url} target="_blank" rel="noreferrer">
            {data?.url}
          </a>
          {data?.caption?.length > 0 && (
            <div className="text-sm text-gray-600">
              <RichText text={data.caption} />
            </div>
          )}
        </div>
      )
    case 'table_of_contents':
      return (
        <div className="my-4 p-3 border rounded bg-gray-50 text-sm">
          <em>Table of contents is not auto-generated here.</em>
        </div>
      )
    case 'link_to_page':
      return (
        <div className="my-2 text-sm text-blue-700">
          Linked page
        </div>
      )
    case 'synced_block':
      return (
        <div className="my-2">
          <Children blocks={block.children} />
        </div>
      )
    case 'child_database':
      return <DBItems items={block.database_items} />
    default:
      return (
        <div className="my-2 text-xs text-gray-400">Unsupported block: {type}</div>
      )
  }
}

export default function Renderer({ blocks }: { blocks: NotionBlock[] }) {
  return (
    <div className="prose max-w-none">
      {blocks.map((block: any) => (
        <Block key={block.id} block={block} />
      ))}
    </div>
  )
}