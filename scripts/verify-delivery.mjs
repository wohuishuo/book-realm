import { readdir, readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const run = (command, args) => spawnSync(command, args, { cwd: root, encoding: 'utf8', shell: false })
const branchResult = run('git', ['branch', '--show-current'])
const branch = process.env.GITHUB_HEAD_REF || branchResult.stdout.trim()
const issue = branch.match(/(?:^|\/)(p-\d+)(?:-|$)/i)?.[1]?.toLowerCase()
if (!issue) {
  if (branch === 'main' && process.env.CI) {
    console.log('DELIVERY SCOPE PASSED: merged main is validated by contract mutation suite.')
    process.exit(0)
  }
  console.error('DELIVERY SCOPE FAILED: branch must contain a Linear issue such as codex/p-26-delivery-contract')
  process.exit(1)
}

const contractDir = join(root, 'docs', 'delivery', 'contracts')
const contractName = (await readdir(contractDir)).find((name) => name.toLowerCase().startsWith(issue + '.'))
if (!contractName) {
  console.error('DELIVERY SCOPE FAILED: no contract found for ' + issue.toUpperCase())
  process.exit(1)
}
const contractPath = join(contractDir, contractName)
const contract = JSON.parse(await readFile(contractPath, 'utf8'))
const changed = new Set()
for (const args of [['diff', '--name-only', 'main...HEAD'], ['diff', '--name-only', '--cached']]) {
  const result = run('git', args)
  for (const name of result.stdout.split(/\r?\n/).filter(Boolean)) changed.add(name.replaceAll('\\', '/'))
}
for (const file of changed) {
  if (!(contract.allowedPaths ?? []).some((prefix) => file === prefix || file.startsWith(prefix))) {
    console.error('DELIVERY SCOPE FAILED: ' + file + ' is outside allowedPaths for ' + contract.issue)
    process.exit(1)
  }
}
const validation = run(process.execPath, [join(root, 'scripts', 'delivery-contract.mjs'), '--contract', contractPath, '--workspace', root])
process.stdout.write(validation.stdout)
process.stderr.write(validation.stderr)
if (validation.status !== 0) process.exit(validation.status ?? 1)
console.log('DELIVERY SCOPE PASSED: ' + changed.size + ' changed files are within contract.')
