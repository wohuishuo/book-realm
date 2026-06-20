import { readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const generated = ['docs/.vitepress/theme/br-tokens.css', 'design-system/generated/BrTokens.kt']
const before = await Promise.all(generated.map((file) => readFile(join(root, file), 'utf8')))
const result = spawnSync(process.execPath, ['scripts/generate-design-tokens.mjs'], { cwd: root, stdio: 'inherit' })
if (result.status !== 0) process.exit(result.status ?? 1)
const after = await Promise.all(generated.map((file) => readFile(join(root, file), 'utf8')))
if (before.some((content, index) => content !== after[index])) {
  console.error('Generated design tokens are stale. Run npm run tokens:generate and commit the result.')
  process.exit(1)
}
console.log('Generated design tokens are current.')
