import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

interface GuideTable {
  headers: string[]
  rows: string[][]
  codeColumns?: number[]
}

interface GuideSection {
  title?: string
  description?: string
  code?: string
  language?: string
  table?: GuideTable
  tip?: string
  alternateCode?: { label: string; code: string; language?: string }
  discordJsCompat?: boolean | string
}

interface Guide {
  id: string
  slug: string
  title: string
  description: string
  category: string
  sections: GuideSection[]
}

const inputPath = process.argv[2]
if (!inputPath) {
  console.error('Usage: migrate-guides.ts <path-to-guides.json>')
  process.exit(1)
}

const guides: Guide[] = JSON.parse(readFileSync(inputPath, 'utf8'))
const outDir = join(__dirname, '../docs/v/latest/guides')
mkdirSync(outDir, { recursive: true })

function escapeMarkdown(str: string): string {
  return str
    .replace(/@fluxerjs\//g, '@erinjs/')
    .replace(/fluxerjs/gi, 'erinjs')
    .replace(/Fluxer\.js/g, 'erin.js')
    .replace(/Fluxer SDK/g, 'erin.js SDK')
    .replace(/Fluxer API/g, 'erin.js API')
    .replace(/FluxerError/g, 'ErinError')
    .replace(/\bFluxer\b/g, 'erin.js')
    .replace(/FLUXER_BOT_TOKEN/g, 'ERIN_BOT_TOKEN')
    .replace(/FLUXER_SUPPRESS_DEPRECATION/g, 'ERIN_SUPPRESS_DEPRECATION')
}

function renderTable(table: GuideTable): string {
  const codeColumns = table.codeColumns ?? []
  const header = `| ${table.headers.join(' | ')} |`
  const divider = `| ${table.headers.map(() => '---').join(' | ')} |`
  const rows = table.rows.map(row =>
    `| ${row.map((cell, i) => (codeColumns.includes(i) ? `\`${cell}\`` : cell)).join(' | ')} |`
  )
  return [header, divider, ...rows].join('\n')
}

function renderSection(section: GuideSection): string {
  const parts: string[] = []

  if (section.title) {
    parts.push(`## ${escapeMarkdown(section.title)}\n`)
  }

  if (section.discordJsCompat) {
    const rawLink = typeof section.discordJsCompat === 'string' ? section.discordJsCompat : ''
    // Remap old /docs/classes/ and /docs/typedefs/ paths to new VitePress structure
    const link = rawLink
      .replace(/^\/docs\/classes\//, '/v/latest/api/classes/')
      .replace(/^\/docs\/typedefs\//, '/v/latest/api/interfaces/')
    if (link) {
      parts.push(`::: info Discord.js Compatible\nSee [API reference](${link}) for full details.\n:::\n`)
    } else {
      parts.push(`::: info Discord.js Compatible\nThis API follows Discord.js conventions.\n:::\n`)
    }
  }

  if (section.description) {
    parts.push(`${escapeMarkdown(section.description)}\n`)
  }

  if (section.tip) {
    parts.push(`::: tip\n${escapeMarkdown(section.tip)}\n:::\n`)
  }

  if (section.table) {
    parts.push(renderTable(section.table) + '\n')
  }

  if (section.code) {
    const lang = section.language ?? 'javascript'
    const codeFixed = escapeMarkdown(section.code)

    if (section.alternateCode) {
      const altLang = section.alternateCode.language ?? 'javascript'
      const altCode = escapeMarkdown(section.alternateCode.code)
      parts.push(
        `::: code-group\n\`\`\`${lang} [Default]\n${codeFixed}\n\`\`\`\n\`\`\`${altLang} [${section.alternateCode.label}]\n${altCode}\n\`\`\`\n:::\n`
      )
    } else {
      parts.push(`\`\`\`${lang}\n${codeFixed}\n\`\`\`\n`)
    }
  }

  return parts.join('\n')
}

for (const guide of guides) {
  const lines: string[] = [
    `# ${escapeMarkdown(guide.title)}\n`,
    `${escapeMarkdown(guide.description)}\n`,
    ...guide.sections.map(renderSection),
  ]

  const content = lines.join('\n')
  const outPath = join(outDir, `${guide.slug}.md`)
  writeFileSync(outPath, content, 'utf8')
  console.log(`wrote ${outPath}`)
}

console.log(`\nMigrated ${guides.length} guides to ${outDir}`)
