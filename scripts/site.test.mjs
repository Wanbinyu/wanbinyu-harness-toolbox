import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const html = await readFile(resolve(root, 'dist', 'index.html'), 'utf8')
const app = await readFile(resolve(root, 'dist', 'app.js'), 'utf8')
const waves = await readFile(resolve(root, 'dist', 'waves.js'), 'utf8')
const catalog = JSON.parse(await readFile(resolve(root, 'dist', 'plugins.json'), 'utf8'))
const stats = JSON.parse(await readFile(resolve(root, 'dist', 'release-stats.json'), 'utf8'))

test('site is privacy-preserving at runtime', () => {
  const source = `${html}\n${app}\n${waves}`
  assert.doesNotMatch(source, /googletagmanager|google-analytics|_vercel\/insights|plausible\.io/i)
  assert.match(html, /connect-src 'self'/)
  assert.equal(stats.runtimeAnalytics, false)
})

test('every catalog project has build-time release metadata', () => {
  for (const project of catalog.projects) {
    assert.ok(stats.projects[project.name], `${project.name} has no release metadata`)
    assert.ok(Object.keys(stats.projects[project.name].assets).length > 0, `${project.name} has no release assets`)
  }
})

test('launcher downloads stay on GitHub Release assets', () => {
  const launcher = catalog.projects.find(project => project.name === 'dsh-launcher')
  assert.ok(launcher)
  for (const url of [launcher.installerUrl, launcher.portableUrl, ...launcher.experimentalDownloads.map(download => download.assetUrl)]) {
    assert.match(url, /^https:\/\/github\.com\/Wanbinyu\/dsh-launcher\/releases\/download\//)
  }
  const installer = stats.projects['dsh-launcher'].assets['dsh-launcher-setup.exe']
  assert.equal(typeof installer.downloadCount, 'number')
  assert.match(installer.digest, /^sha256:/)
  assert.ok(stats.projects['dsh-launcher'].downloadTotals['dsh-launcher-setup.exe'] >= installer.downloadCount)
})

test('page has accessible structure and responsive hooks', () => {
  const launcher = catalog.projects.find(project => project.name === 'dsh-launcher')
  assert.ok(launcher)

  assert.match(html, /<main id="main">/)
  assert.match(html, /class="skip-link"/)
  assert.match(html, /aria-live="polite"/)
  assert.match(html, /meta name="viewport"/)
  assert.match(html, /id="water-background" aria-hidden="true"/)
  assert.match(html, /<script defer src="\.\/waves\.js"><\/script>/)
  assert.doesNotMatch(html, /id="installer-download" href="#"/)
  assert.match(html, new RegExp(`id="installer-download" href="${launcher.installerUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`))
  assert.match(waves, /prefers-reduced-motion: reduce/)
  assert.doesNotMatch(waves, /fetch\(|XMLHttpRequest|WebSocket/)
})
