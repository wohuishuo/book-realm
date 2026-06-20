import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const script = join(root, 'scripts', 'delivery-contract.mjs')
const contract = join(root, 'docs', 'delivery', 'contracts', 'p-18.json')
const result = spawnSync(process.execPath, [script, '--contract', contract, '--workspace', root], { encoding: 'utf8' })
if (result.status === 0 || !result.stderr.includes('repository mismatch')) {
  console.error('Mutation test failed: an Android Compose issue was accepted in book-realm.')
  process.exit(1)
}
console.log('Mutation caught: Android Compose delivery in book-realm is rejected.')
