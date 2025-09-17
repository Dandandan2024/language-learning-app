const { Client } = require('@notionhq/client')

const notion = new Client({ auth: process.env.NOTION_TOKEN })

const ROOT_PAGE_ID = '500b3fa1c5e24a94b7b5b9e93550496c'

async function checkPropertyContent() {
  try {
    console.log('Checking Notion content for property guides...')
    
    // Get child pages
    const response = await notion.blocks.children.list({
      block_id: ROOT_PAGE_ID,
      page_size: 100
    })
    
    console.log('\n=== Child Pages ===')
    for (const block of response.results) {
      if (block.type === 'child_page') {
        console.log(`- ${block.child_page.title}`)
      } else if (block.type === 'child_database') {
        console.log(`- [DATABASE] ${block.id}`)
        
        // Get database items
        try {
          const dbResponse = await notion.databases.query({
            database_id: block.id
          })
          console.log('  Database items:')
          for (const item of dbResponse.results) {
            const title = extractTitleFromPage(item)
            console.log(`    - ${title}`)
          }
        } catch (e) {
          console.log(`  Error accessing database: ${e.message}`)
        }
      }
    }
    
    // Look for property-related content
    console.log('\n=== Searching for Property Content ===')
    const allBlocks = response.results
    for (const block of allBlocks) {
      if (block.type === 'child_page' && 
          block.child_page.title.toLowerCase().includes('property')) {
        console.log(`Found property page: ${block.child_page.title}`)
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

function extractTitleFromPage(page) {
  const props = page?.properties || {}
  const titleProp = Object.values(props).find((p) => p?.type === 'title')
  const title = titleProp?.title?.map((t) => t.plain_text).join('')
  return title || 'Untitled'
}

checkPropertyContent()