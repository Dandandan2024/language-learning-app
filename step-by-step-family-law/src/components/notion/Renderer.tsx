import React from 'react'
import { NotionBlock } from '@/lib/notion'

function RichText({ text }: { text: any[] }) {
  return (
    <>
      {text?.map((t, i) => {
        const content = t?.plain_text ?? ''
        const annotations = t?.annotations ?? {}
        const Tag = annotations.bold ? 'strong' : React.Fragment
        const Inner = annotations.italic ? 'em' : React.Fragment
        const code = annotations.code
        const mark = annotations.underline
        const del = annotations.strikethrough

        let el: React.ReactNode = content
        if (code) el = <code>{content}</code>
        if (mark) el = <u>{el}</u>
        if (del) el = <s>{el}</s>

        return (
          <Tag key={i as any}>
            <Inner>{el}</Inner>
          </Tag>
        )
      })}
    </>
  )
}

export default function Renderer({ blocks }: { blocks: NotionBlock[] }) {
  return (
    <div className="prose max-w-none">
      {blocks.map((block: any) => {
        const { id, type } = block
        const data = block[type]
        switch (type) {
          case 'heading_1':
            return (
              <h1 key={id}>
                <RichText text={data?.rich_text} />
              </h1>
            )
          case 'heading_2':
            return (
              <h2 key={id}>
                <RichText text={data?.rich_text} />
              </h2>
            )
          case 'heading_3':
            return (
              <h3 key={id}>
                <RichText text={data?.rich_text} />
              </h3>
            )
          case 'paragraph':
            return (
              <p key={id}>
                <RichText text={data?.rich_text} />
              </p>
            )
          case 'bulleted_list_item':
            return (
              <ul key={id}>
                <li>
                  <RichText text={data?.rich_text} />
                </li>
              </ul>
            )
          case 'numbered_list_item':
            return (
              <ol key={id}>
                <li>
                  <RichText text={data?.rich_text} />
                </li>
              </ol>
            )
          case 'quote':
            return (
              <blockquote key={id}>
                <RichText text={data?.rich_text} />
              </blockquote>
            )
          case 'divider':
            return <hr key={id} />
          case 'code':
            return (
              <pre key={id}>
                <code>
                  {data?.rich_text?.map((t: any) => t?.plain_text).join('')}
                </code>
              </pre>
            )
          default:
            return null
        }
      })}
    </div>
  )
}