import { readFile } from 'node:fs/promises'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const catalogPath = resolve(root, 'plugins.json')
const catalog = JSON.parse(await readFile(catalogPath, 'utf8'))
const failures = []

function fail(message) {
  failures.push(message)
}

function requiredString(value, path) {
  if (typeof value !== 'string' || value.trim() === '') fail(`${path} must be a non-empty string`)
}

async function fetchJson(url) {
  const authorization = process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}
  const response = await fetch(url, {
    headers: { accept: 'application/vnd.github+json', 'user-agent': 'wanbinyu-harness-toolbox', ...authorization },
  })
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
  return response.json()
}

function encodeContentPath(path) {
  return path.split('/').map(segment => encodeURIComponent(segment)).join('/')
}

async function fetchRepoText(owner, repo, ref, path) {
  const file = await fetchJson(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeContentPath(path)}?ref=${encodeURIComponent(ref)}`)
  if (Array.isArray(file) || file.type !== 'file' || typeof file.content !== 'string') {
    throw new Error(`${path} is not a repository file`)
  }
  if (file.encoding !== 'base64') throw new Error(`${path} uses unsupported encoding ${file.encoding}`)
  return Buffer.from(file.content, 'base64').toString('utf8')
}

function releaseTag(url) {
  const match = new URL(url).pathname.match(/\/releases\/tag\/([^/]+)$/)
  if (match === null) throw new Error(`release URL has no tag: ${url}`)
  return decodeURIComponent(match[1])
}

function releaseAsset(release, url, label) {
  const name = basename(new URL(url).pathname)
  const asset = (release.assets ?? []).find(candidate => candidate.name === name)
  if (asset === undefined) fail(`${label} ${name} is missing from ${release.tag_name}`)
  return asset
}

if (catalog.schemaVersion !== 2) fail(`schemaVersion must be 2, got ${String(catalog.schemaVersion)}`)
if (!Array.isArray(catalog.projects) || catalog.projects.length === 0) fail('projects must be a non-empty array')

for (const [index, project] of (catalog.projects ?? []).entries()) {
  const prefix = `projects[${index}]`
  requiredString(project.name, `${prefix}.name`)
  requiredString(project.url, `${prefix}.url`)
  requiredString(project.category, `${prefix}.category`)
  requiredString(project.latestVersion, `${prefix}.latestVersion`)
  requiredString(project.lastVerified, `${prefix}.lastVerified`)
  requiredString(project.verificationStatus, `${prefix}.verificationStatus`)

  let repository
  try {
    const match = new URL(project.url).pathname.match(/^\/([^/]+)\/([^/]+?)(?:\.git)?$/)
    if (match === null) throw new Error('repository URL must look like https://github.com/owner/repository')
    const [, owner, repo] = match
    repository = await fetchJson(`https://api.github.com/repos/${owner}/${repo}`)
    const ref = repository.default_branch

    if (project.category === 'plugin') {
      requiredString(project.packageVersion, `${prefix}.packageVersion`)
      requiredString(project.releaseUrl, `${prefix}.releaseUrl`)
      requiredString(project.packageUrl, `${prefix}.packageUrl`)
      if (project.bundleManifest !== 'package.json:dsh.bundle.patch') {
        fail(`${project.name}: bundleManifest must be package.json:dsh.bundle.patch`)
      }
      if (project.patchFile !== 'cordis.patch.yml') {
        fail(`${project.name}: patchFile must be cordis.patch.yml`)
      }
      const packageText = await fetchRepoText(owner, repo, ref, 'package.json')
      const packageJson = JSON.parse(packageText)
      if (packageJson.version !== project.latestVersion) {
        fail(`${project.name}: catalog version ${project.latestVersion} != package version ${packageJson.version}`)
      }
      if (project.bundlePackage !== undefined) {
        if (packageJson.name !== project.bundlePackage) {
          fail(`${project.name}: bundlePackage ${project.bundlePackage} != package name ${packageJson.name}`)
        }
        const pluginPackage = JSON.parse(await fetchRepoText(owner, repo, ref, `packages/${project.name}/package.json`))
        if (pluginPackage.version !== project.packageVersion) {
          fail(`${project.name}: packageVersion ${project.packageVersion} != plugin package version ${pluginPackage.version}`)
        }
      } else if (packageJson.version !== project.packageVersion) {
        fail(`${project.name}: packageVersion ${project.packageVersion} != package version ${packageJson.version}`)
      }
      if (packageJson.dsh?.bundle?.patch !== './cordis.patch.yml') {
        fail(`${project.name}: package.json does not declare ./cordis.patch.yml`)
      }
      const patchText = await fetchRepoText(owner, repo, ref, 'cordis.patch.yml')
      if (!patchText.includes('insert:')) fail(`${project.name}: cordis.patch.yml has no insert section`)
      const readme = await fetchRepoText(owner, repo, ref, 'README.md')
      if (!/dsh plugin .* add /i.test(readme)) fail(`${project.name}: README.md has no dsh plugin install command`)
      if (!/0\.1\.[01]-rc/i.test(readme)) fail(`${project.name}: README.md has no Harness compatibility statement`)
      const release = await fetchJson(`https://api.github.com/repos/${owner}/${repo}/releases/latest`)
      if (release.tag_name !== `v${project.latestVersion}`) {
        fail(`${project.name}: catalog version ${project.latestVersion} != latest release ${release.tag_name}`)
      }
      if (!release.html_url || project.releaseUrl !== release.html_url) {
        fail(`${project.name}: releaseUrl does not point to the latest release`)
      }
      const packageAsset = basename(new URL(project.packageUrl).pathname)
      const assetNames = new Set((release.assets ?? []).map(asset => asset.name))
      if (!assetNames.has(packageAsset)) fail(`${project.name}: package asset ${packageAsset} is missing from latest release`)
      if (!project.install.includes(project.packageUrl)) fail(`${project.name}: install command is not pinned to packageUrl`)
    } else if (project.category === 'tool') {
      requiredString(project.releaseUrl, `${prefix}.releaseUrl`)
      requiredString(project.installerUrl, `${prefix}.installerUrl`)
      requiredString(project.installerChecksumUrl, `${prefix}.installerChecksumUrl`)
      requiredString(project.portableUrl, `${prefix}.portableUrl`)
      requiredString(project.portableChecksumUrl, `${prefix}.portableChecksumUrl`)
      const expectedTag = releaseTag(project.releaseUrl)
      const release = await fetchJson(`https://api.github.com/repos/${owner}/${repo}/releases/tags/${encodeURIComponent(expectedTag)}`)
      const latestRelease = await fetchJson(`https://api.github.com/repos/${owner}/${repo}/releases/latest`)
      if (release.tag_name !== `v${project.latestVersion}`) {
        fail(`${project.name}: catalog version ${project.latestVersion} != release ${release.tag_name}`)
      }
      if (latestRelease.tag_name !== expectedTag) {
        fail(`${project.name}: catalog release ${expectedTag} != latest release ${latestRelease.tag_name}`)
      }
      if (!release.html_url || project.releaseUrl !== release.html_url) {
        fail(`${project.name}: releaseUrl does not point to the latest release`)
      }
      releaseAsset(release, project.installerUrl, `${project.name}: installer asset`)
      releaseAsset(release, project.installerChecksumUrl, `${project.name}: installer checksum`)
      releaseAsset(release, project.portableUrl, `${project.name}: portable asset`)
      releaseAsset(release, project.portableChecksumUrl, `${project.name}: portable checksum`)
      for (const [downloadIndex, download] of (project.experimentalDownloads ?? []).entries()) {
        const downloadPrefix = `${prefix}.experimentalDownloads[${downloadIndex}]`
        requiredString(download.platform, `${downloadPrefix}.platform`)
        requiredString(download.version, `${downloadPrefix}.version`)
        requiredString(download.releaseUrl, `${downloadPrefix}.releaseUrl`)
        requiredString(download.assetUrl, `${downloadPrefix}.assetUrl`)
        requiredString(download.checksumUrl, `${downloadPrefix}.checksumUrl`)
        requiredString(download.requires, `${downloadPrefix}.requires`)
        const tag = releaseTag(download.releaseUrl)
        const channelRelease = await fetchJson(`https://api.github.com/repos/${owner}/${repo}/releases/tags/${encodeURIComponent(tag)}`)
        releaseAsset(channelRelease, download.assetUrl, `${project.name}: ${download.platform} asset`)
        releaseAsset(channelRelease, download.checksumUrl, `${project.name}: ${download.platform} checksum`)
      }
    } else {
      fail(`${project.name}: unsupported category ${project.category}`)
    }
  } catch (error) {
    fail(`${project.name}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

if (failures.length > 0) {
  console.error(`Catalog verification failed (${failures.length} issue${failures.length === 1 ? '' : 's'}):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exitCode = 1
} else {
  console.log(`Catalog verification passed: ${catalog.projects.length} project(s)`)
}
