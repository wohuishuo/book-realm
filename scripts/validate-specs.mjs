import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const dirs = ['docs/product/prd', 'docs/architecture/adr']
const errors = []

for (const dir of dirs) {
  for (const name of await readdir(join(root, dir))) {
    if (!name.endsWith('.md') || name === 'index.md') continue
    const text = await readFile(join(root, dir, name), 'utf8')
    for (const field of ['status:', 'owner:']) {
      if (!text.includes(field)) errors.push(`${dir}/${name}: missing ${field}`)
    }
  }
}

const features = await readdir(join(root, 'docs/specs/features'))
for (const name of features.filter((file) => file.endsWith('.feature'))) {
  const text = await readFile(join(root, 'docs/specs/features', name), 'utf8')
  if (!/@prd-\d{3}/i.test(text)) errors.push(`docs/specs/features/${name}: missing @prd-NNN tag`)
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log('Specification metadata and traceability are valid.')
