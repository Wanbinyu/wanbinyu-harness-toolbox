import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const site = resolve(root, 'site')
const output = resolve(root, 'dist')
const catalog = JSON.parse(await readFile(resolve(root, 'plugins.json'), 'utf8'))
let cachedStats = null
try {
  cachedStats = JSON.parse(await readFile(resolve(output, 'release-stats.json'), 'utf8'))
} catch {
  // A clean CI build has an authenticated token; local rebuilds may have no cache yet.
}

const headers = {
  accept: 'application/vnd.github+json',
  'user-agent': 'wanbinyu-harness-toolbox-site-builder',
  ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
}

function repositoryFromUrl(url) {
  const match = new URL(url).pathname.match(/^\/([^/]+)\/([^/]+?)(?:\.git)?$/)
  if (match === null) throw new Error(`Unsupported repository URL: ${url}`)
  return { owner: match[1], repo: match[2] }
}

function tagFromReleaseUrl(url) {
  const match = new URL(url).pathname.match(/\/releases\/tag\/([^/]+)$/)
  if (match === null) throw new Error(`Unsupported release URL: ${url}`)
  return decodeURIComponent(match[1])
}

async function fetchRelease(owner, repo, tag) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/tags/${encodeURIComponent(tag)}`, { headers })
  if (!response.ok) throw new Error(`${owner}/${repo}@${tag}: ${response.status} ${response.statusText}`)
  return response.json()
}

function downloadUrls(project) {
  if (project.category === 'plugin') return [project.packageUrl]
  return [
    project.installerUrl,
    project.installerChecksumUrl,
    project.portableUrl,
    project.portableChecksumUrl,
    ...(project.experimentalDownloads ?? []).flatMap(download => [download.assetUrl, download.checksumUrl]),
  ]
}

const projectStats = {}
const staleProjects = []
for (const project of catalog.projects) {
  try {
    const { owner, repo } = repositoryFromUrl(project.url)
    const releaseUrls = [project.releaseUrl, ...(project.experimentalDownloads ?? []).map(download => download.releaseUrl)]
    const releases = new Map()
    for (const releaseUrl of releaseUrls) {
      const tag = tagFromReleaseUrl(releaseUrl)
      if (!releases.has(tag)) releases.set(tag, await fetchRelease(owner, repo, tag))
    }

    const assets = {}
    for (const url of downloadUrls(project)) {
      const name = basename(new URL(url).pathname)
      const asset = [...releases.values()].flatMap(release => release.assets ?? []).find(candidate => candidate.name === name)
      if (asset === undefined) throw new Error(`${project.name}: release asset not found: ${name}`)
      assets[name] = {
        name,
        downloadCount: asset.download_count,
        size: asset.size,
        digest: asset.digest ?? null,
        url: asset.browser_download_url,
      }
    }

    projectStats[project.name] = {
      fetchedAt: new Date().toISOString(),
      releases: [...releases.values()].map(release => ({
        tagName: release.tag_name,
        publishedAt: release.published_at,
        url: release.html_url,
      })),
      assets,
    }
  } catch (error) {
    const cachedProject = cachedStats?.projects?.[project.name]
    if (cachedProject === undefined) throw error
    staleProjects.push(project.name)
    projectStats[project.name] = {
      ...cachedProject,
      fetchedAt: cachedProject.fetchedAt ?? cachedStats.generatedAt,
    }
    console.warn(`${project.name}: using cached release metadata (${error instanceof Error ? error.message : String(error)})`)
  }
}

const stats = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  source: 'GitHub Releases API',
  definition: 'Per-asset file requests; not unique users or installations.',
  runtimeAnalytics: false,
  staleProjects,
  projects: projectStats,
}

const imageSource = resolve(root, 'docs', 'articles', 'images')
const imageOutput = resolve(output, 'assets')
await rm(output, { recursive: true, force: true })
await mkdir(imageOutput, { recursive: true })
await cp(site, output, { recursive: true })
await cp(imageSource, imageOutput, { recursive: true })
await cp(resolve(root, 'plugins.json'), resolve(output, 'plugins.json'))
await writeFile(resolve(output, 'release-stats.json'), `${JSON.stringify(stats, null, 2)}\n`, 'utf8')
await writeFile(resolve(output, '.nojekyll'), '', 'utf8')

console.log(`Site built: ${catalog.projects.length} project(s), ${Object.values(projectStats).reduce((sum, project) => sum + Object.keys(project.assets).length, 0)} release asset(s)`)
