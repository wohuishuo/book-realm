import { readdir, readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const featureDir = resolve(process.argv[2] ?? 'docs/specs/features')
const errors = []
for (const name of (await readdir(featureDir)).filter((file) => file.endsWith('.feature'))) {
  const text = await readFile(join(featureDir, name), 'utf8')
  const header = text.slice(0, text.indexOf('Feature:'))
  if (!/@prd-\d{3}/i.test(header)) errors.push(name + ': missing PRD tag')
  if ([...header.matchAll(/@platform-([\w-]+)/g)].length !== 1) errors.push(name + ': requires exactly one @platform-* tag')
  if ([...header.matchAll(/@level-([\w-]+)/g)].length !== 1) errors.push(name + ': requires exactly one @level-* tag')
  if (/@api\b/.test(header) && !/@level-integration\b/.test(header)) errors.push(name + ': @api must be @level-integration')
  if (/@manual\b/.test(header) && !/@level-manual\b/.test(header)) errors.push(name + ': @manual must be @level-manual')
  if (/@api\b/.test(header) && !/@platform-api\b/.test(header)) errors.push(name + ': API execution must declare @platform-api')
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1) }
console.log('BDD platform and evidence-level metadata are valid.')
