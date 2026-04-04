import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ---- Types ----------------------------------------------------------------

interface Param {
  name: string
  type: string
  optional: boolean
  description?: string
}

interface Method {
  name: string
  params: Param[]
  returns: string
  description?: string
  async: boolean
  source?: { file: string; line: number; path?: string }
}

interface Property {
  name: string
  type: string
  readonly: boolean
  optional: boolean
  description?: string
}

interface ApiClass {
  name: string
  description?: string
  constructor?: { params: Param[] }
  properties: Property[]
  methods: Method[]
  package: string
  source?: { file: string; line: number; path?: string }
}

interface ApiInterface {
  name: string
  description?: string
  properties: Property[]
  package: string
  source?: { file: string; line: number; path?: string }
}

interface EnumMember {
  name: string
  value: string
}

interface ApiEnum {
  name: string
  description?: string
  members: EnumMember[]
  package: string
  source?: { file: string; line: number; path?: string }
}

interface MainJson {
  meta: { version: string; date: number }
  package: string
  version: string
  packages: string[]
  classes: ApiClass[]
  interfaces: ApiInterface[]
  enums: ApiEnum[]
}

// ---- Helpers ---------------------------------------------------------------

function escapeType(type: string): string {
  // Used inside <code> HTML tags in markdown table cells.
  // & must come first to avoid double-escaping.
  // < and > use HTML entities so the browser renders them correctly.
  // | must be \| so markdown-it's escapedSplit() strips the backslash
  // and keeps | as literal cell content instead of a column separator.
  return type
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\|/g, '\\|')
}

function fixBranding(text: string): string {
  return text
    .replace(/@fluxerjs\//g, '@erinjs/')
    .replace(/\bFluxerError\b/g, 'ErinError')
    .replace(/\bFluxer\b/g, 'erin.js')
}

function renderPropertiesTable(properties: Property[]): string {
  if (properties.length === 0) return '_None_\n'
  const header = '| Name | Type | Readonly | Optional | Description |'
  const divider = '| --- | --- | --- | --- | --- |'
  const rows = properties.map(p =>
    `| \`${p.name}\` | <code>${escapeType(p.type)}</code> | ${p.readonly ? 'Yes' : 'No'} | ${p.optional ? 'Yes' : 'No'} | ${fixBranding(p.description ?? '')} |`
  )
  return [header, divider, ...rows].join('\n') + '\n'
}

function renderParamsTable(params: Param[]): string {
  if (params.length === 0) return '_None_\n'
  const header = '| Name | Type | Optional | Description |'
  const divider = '| --- | --- | --- | --- |'
  const rows = params.map(p =>
    `| \`${p.name}\` | <code>${escapeType(p.type)}</code> | ${p.optional ? 'Yes' : 'No'} | ${fixBranding(p.description ?? '')} |`
  )
  return [header, divider, ...rows].join('\n') + '\n'
}

function renderMethod(method: Method): string {
  const asyncTag = method.async ? ' `async`' : ''
  const parts = [`### \`${method.name}()\`${asyncTag}\n`]
  if (method.description) parts.push(`${fixBranding(method.description)}\n`)
  parts.push(`**Returns:** <code>${escapeType(method.returns)}</code>\n`)
  parts.push('**Parameters:**\n')
  parts.push(renderParamsTable(method.params))
  return parts.join('\n')
}

// ---- Generators ------------------------------------------------------------

function generateClassPage(cls: ApiClass): string {
  const parts: string[] = [`# ${fixBranding(cls.name)}\n`]
  if (cls.package) parts.push(`**Package:** \`${cls.package.replace('@fluxerjs/', '@erinjs/')}\`\n`)
  if (cls.description) parts.push(`${fixBranding(cls.description)}\n`)

  if (cls.constructor && cls.constructor.params?.length > 0) {
    parts.push('## Constructor\n')
    parts.push(renderParamsTable(cls.constructor.params))
  }

  parts.push('## Properties\n')
  parts.push(renderPropertiesTable(cls.properties))

  if (cls.methods.length > 0) {
    parts.push('## Methods\n')
    parts.push(cls.methods.map(renderMethod).join('\n---\n\n'))
  }

  return parts.join('\n')
}

function generateInterfacePage(iface: ApiInterface): string {
  const parts: string[] = [`# ${fixBranding(iface.name)}\n`]
  if (iface.package) parts.push(`**Package:** \`${iface.package.replace('@fluxerjs/', '@erinjs/')}\`\n`)
  if (iface.description) parts.push(`${fixBranding(iface.description)}\n`)
  parts.push('## Properties\n')
  parts.push(renderPropertiesTable(iface.properties))
  return parts.join('\n')
}

function generateEnumPage(en: ApiEnum): string {
  const parts: string[] = [`# ${fixBranding(en.name)}\n`]
  if (en.package) parts.push(`**Package:** \`${en.package.replace('@fluxerjs/', '@erinjs/')}\`\n`)
  if (en.description) parts.push(`${fixBranding(en.description)}\n`)
  parts.push('## Members\n')
  const header = '| Name | Value |'
  const divider = '| --- | --- |'
  const rows = en.members.map(m => `| \`${m.name}\` | \`${m.value}\` |`)
  parts.push([header, divider, ...rows].join('\n') + '\n')
  return parts.join('\n')
}

function generateIndex(names: string[], section: string, basePath: string): string {
  const links = names.map(name => `- [${fixBranding(name)}](${basePath}/${name})`).join('\n')
  return `# ${section}\n\n${links}\n`
}

// ---- Filename deduplication (case-insensitive, for cross-platform Rollup compat) ---

function makeUniqueSlug(name: string, seen: Map<string, number>): string {
  const key = name.toLowerCase()
  const count = seen.get(key) ?? 0
  seen.set(key, count + 1)
  return count === 0 ? name : `${name}-${count + 1}`
}

// ---- Main ------------------------------------------------------------------

const inputPath = process.argv[2]
if (!inputPath) {
  console.error('Usage: generate-api.ts <path-to-main.json>')
  process.exit(1)
}

const data: MainJson = JSON.parse(readFileSync(inputPath, 'utf8'))
const apiDir = join(__dirname, '../v/latest/api')

const classesDir = join(apiDir, 'classes')
const interfacesDir = join(apiDir, 'interfaces')
const enumsDir = join(apiDir, 'enums')
// Clean stale files from previous runs before writing fresh output
rmSync(apiDir, { recursive: true, force: true })
mkdirSync(classesDir, { recursive: true })
mkdirSync(interfacesDir, { recursive: true })
mkdirSync(enumsDir, { recursive: true })

const classSeen = new Map<string, number>()
const classSlugs: Array<{ name: string; slug: string }> = []
for (const cls of data.classes) {
  const slug = makeUniqueSlug(cls.name, classSeen)
  classSlugs.push({ name: cls.name, slug })
  writeFileSync(join(classesDir, `${slug}.md`), generateClassPage(cls), 'utf8')
}
writeFileSync(
  join(classesDir, 'index.md'),
  generateIndex(classSlugs.map(c => c.slug), 'Classes', '/v/latest/api/classes'),
  'utf8'
)

const ifaceSeen = new Map<string, number>()
const ifaceSlugs: Array<{ name: string; slug: string }> = []
for (const iface of data.interfaces) {
  const slug = makeUniqueSlug(iface.name, ifaceSeen)
  ifaceSlugs.push({ name: iface.name, slug })
  writeFileSync(join(interfacesDir, `${slug}.md`), generateInterfacePage(iface), 'utf8')
}
writeFileSync(
  join(interfacesDir, 'index.md'),
  generateIndex(ifaceSlugs.map(i => i.slug), 'Interfaces', '/v/latest/api/interfaces'),
  'utf8'
)

const enumSeen = new Map<string, number>()
const enumSlugs: Array<{ name: string; slug: string }> = []
for (const en of data.enums) {
  const slug = makeUniqueSlug(en.name, enumSeen)
  enumSlugs.push({ name: en.name, slug })
  writeFileSync(join(enumsDir, `${slug}.md`), generateEnumPage(en), 'utf8')
}
writeFileSync(
  join(enumsDir, 'index.md'),
  generateIndex(enumSlugs.map(e => e.slug), 'Enums', '/v/latest/api/enums'),
  'utf8'
)

console.log(`Generated ${data.classes.length} classes, ${data.interfaces.length} interfaces, ${data.enums.length} enums`)
