import { readFile, readdir, stat } from 'node:fs/promises'
import { basename, dirname, extname, join, relative, resolve } from 'node:path'

const values = process.argv.slice(2)
const option = (name) => values[values.indexOf(name) + 1]
const contractFile = option('--contract')
const workspaceArg = option('--workspace')
if (!contractFile || !workspaceArg) {
  console.error('Usage: node scripts/delivery-contract.mjs --contract <file> --workspace <repository>')
  process.exit(2)
}

const workspace = resolve(workspaceArg)
const contractPath = resolve(contractFile)
const contract = JSON.parse(await readFile(contractPath, 'utf8'))
const errors = []
const required = ['issue', 'targetRepository', 'platform', 'authoritativeSpecs', 'allowedPaths', 'requiredCommands', 'checks']
for (const key of required) if (!contract[key] || contract[key].length === 0) errors.push('contract missing ' + key)

if (basename(workspace).toLowerCase() !== String(contract.targetRepository).toLowerCase()) {
  errors.push('repository mismatch: expected ' + contract.targetRepository + ', received ' + basename(workspace))
}

const files = []
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (['.git', '.gradle', 'node_modules', 'build', 'dist', 'reports'].includes(entry.name)) continue
    const file = join(dir, entry.name)
    if (entry.isDirectory()) await walk(file)
    else files.push(file)
  }
}
await walk(workspace)
const normalized = (file) => relative(workspace, file).replaceAll('\\', '/')

for (const requiredFile of contract.checks.requiredFiles ?? []) {
  if (!files.some((file) => normalized(file) === requiredFile)) errors.push('required implementation missing: ' + requiredFile)
}

const sourceExtensions = new Set(['.java', '.kt', '.kts', '.js', '.mjs', '.ts', '.tsx', '.jsx', '.vue'])
for (const file of files.filter((item) => sourceExtensions.has(extname(item)))) {
  const path = normalized(file)
  const text = await readFile(file, 'utf8')
  for (const rule of contract.checks.forbiddenPatterns ?? []) {
    const allowed = (rule.allowPaths ?? []).some((prefix) => path.startsWith(prefix))
    if (!allowed && new RegExp(rule.pattern, rule.flags ?? 'g').test(text)) errors.push(path + ': ' + rule.message)
  }
}

for (const spec of contract.authoritativeSpecs) {
  const specificationRoot = resolve(dirname(contractPath), '../../..')
  try { await stat(resolve(specificationRoot, spec)) } catch { errors.push('authoritative spec missing: ' + spec) }
}

if (errors.length) {
  console.error('DELIVERY CONTRACT FAILED\n' + errors.map((error) => '- ' + error).join('\n'))
  process.exit(1)
}
console.log('DELIVERY CONTRACT PASSED: ' + contract.issue + ' -> ' + contract.targetRepository + ' (' + contract.platform + ')')
console.log('Required commands:\n' + contract.requiredCommands.map((command) => '- ' + command).join('\n'))
