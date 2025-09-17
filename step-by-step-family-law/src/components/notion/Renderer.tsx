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
    default:
      return null
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