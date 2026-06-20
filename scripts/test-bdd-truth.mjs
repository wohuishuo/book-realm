import { mkdtemp, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const dir = await mkdtemp(join(tmpdir(), 'br-bdd-mutation-'))
await writeFile(join(dir, 'false-green.feature'), '@prd-999 @api\nFeature: false green\n  Scenario: starts only\n    Given nothing\n')
const result = spawnSync(process.execPath, ['scripts/validate-bdd-truth.mjs', dir], { encoding: 'utf8' })
if (result.status === 0 || !result.stderr.includes('@level-integration')) {
  console.error('BDD mutation was not rejected with an evidence-level error.')
  process.exit(1)
}
console.log('Mutation caught: API scenario without integration evidence level is rejected.')
