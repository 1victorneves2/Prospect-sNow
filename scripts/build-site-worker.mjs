import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
const assets = {}
function collect(dir, prefix = '') {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    const name = `${prefix}/${entry.name}`
    if (entry.isDirectory()) collect(file, name)
    else {
      const type = name.endsWith('.html')
        ? 'text/html; charset=utf-8'
        : name.endsWith('.js')
          ? 'text/javascript; charset=utf-8'
          : name.endsWith('.css')
            ? 'text/css; charset=utf-8'
            : 'application/octet-stream'
      assets[name] = { type, data: readFileSync(file).toString('base64') }
    }
  }
}
collect('apps/web/dist')
mkdirSync('dist/server', { recursive: true })
writeFileSync(
  'dist/server/index.js',
  `const __ASSETS__ = ${JSON.stringify(assets)};\n${readFileSync('site-worker/index.mjs', 'utf8')}`,
)
