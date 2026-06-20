import { spawnSync } from 'node:child_process'
import { join } from 'node:path'

const runner = join('node_modules', '@cucumber', 'cucumber', 'bin', 'cucumber.js')
const result = spawnSync(
  process.execPath,
  [
    runner,
    'tests/fixtures/no-http.feature',
    '--import', 'tests/bdd/platform-api.mjs',
    '--import', 'tests/fixtures/no-http-steps.mjs',
    '--format', 'progress'
  ],
  { encoding: 'utf8' }
)
const output = String(result.stdout ?? '') + String(result.stderr ?? '') + String(result.error?.message ?? '')
if (result.status === 0 || !output.includes('API scenario produced no real HTTP calls')) {
  console.error('No-HTTP Cucumber mutation was not rejected.')
  process.exit(1)
}
console.log('Mutation caught: passing text steps without real HTTP calls are rejected.')
