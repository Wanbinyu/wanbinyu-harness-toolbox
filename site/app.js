const translations = {
  zh: {
    skip: '跳到主要内容', navLauncher: '启动器', navPlugins: '插件', navTrust: '验证',
    eyebrow: '独立维护 · 本地优先 · 可验证', heroTitle: '让 DeepSeek Harness 更容易启动、观察和信任。',
    heroLede: '一个入口，整理启动器、状态插件和只读诊断工具。每个下载都回到可核验的 GitHub Release。',
    exploreLauncher: '下载 Windows 启动器', explorePlugins: '浏览插件',
    independence: '独立社区项目，非 DeepSeek 官方产品，也不代表 DeepSeek 官方提供支持、认证或安全保证。',
    consoleReady: 'Harness Web 已就绪', consoleProjects: '已验证项目', consoleNetwork: '运行时统计', consoleNone: '无', consoleSource: '下载来源',
    trustPinnedTitle: '固定版本', trustPinnedBody: '不会从默认分支安装未知内容', trustHashTitle: 'SHA-256', trustHashBody: '安装器提供独立校验文件',
    trustPrivateTitle: '隐私优先', trustPrivateBody: '网站无遥测、无广告、无第三方字体', trustCompatTitle: '兼容记录', trustCompatBody: '明确记录已验证的 Harness 版本',
    launcherEyebrow: '推荐入口', launcherTitle: '从 Windows 启动器开始', launcherLead: '双击或输入短命令启动 Harness Web；托盘负责状态、日志、重启和退出。',
    launcherFeatureOne: '后台启动并等待服务就绪', launcherFeatureTwo: '托盘管理状态、日志与进程', launcherFeatureThree: '诊断报告默认脱敏',
    downloadInstaller: '下载安装版', assetDownloads: '次 GitHub 安装包累计下载', downloadPortable: '便携版 EXE', cumulativeDownloadsShort: '次累计下载', downloadsShort: '次下载', checksum: 'SHA-256', checksumFile: '校验文件',
    downloadNote: '安装包尚未使用商业代码签名，Windows 首次运行可能显示 SmartScreen。下载量是文件请求数，不代表独立用户或安装数。',
    androidTitle: 'Android 实验版', androidSummary: '仅用于连接可信私有网络中的 Windows 主机', experimental: '实验性',
    androidWarning: 'APK 不能独立运行 DeepSeek Harness，必须连接一台已经运行 Harness 的 Windows 电脑；不要用于公网、公共 Wi-Fi 或访客网络。',
    downloadAndroid: '下载 Android APK', readSafety: '先阅读安全说明',
    pluginsEyebrow: '按需组合', pluginsTitle: '为 Harness 加上可观察性', pluginsLead: '每个插件独立发布、固定版本安装，并标明最近验证日期。', viewCatalog: '查看目录源码',
    compatibleWith: '兼容', copy: '复制', copied: '已复制安装命令', copyFailed: '请手动复制安装命令', details: '详情', verified: '验证于', plugin: '插件',
    methodEyebrow: '目录不是认证', methodTitle: '“已验证”意味着什么？', methodBody: 'Toolbox 会核对公开仓库、包版本、Release 资产、bundle 清单、patch 文件、安装说明和兼容范围。它提供可重复的检查证据，但不代替源码审计，也不构成 DeepSeek 官方认证。',
    methodOne: '安装地址固定到明确版本，不跟随默认分支漂移。', methodTwo: '网站在构建时读取 GitHub 元数据，浏览页面时不调用统计接口。', methodThree: '下载按钮直接指向你的 GitHub Release，因此计入对应资产下载量。',
    footerBody: '面向 DeepSeek Harness 的独立第三方插件与配套工具索引。', unavailable: '暂不可用', dataError: '目录加载失败，请前往 GitHub 查看。',
  },
  en: {
    skip: 'Skip to main content', navLauncher: 'Launcher', navPlugins: 'Plugins', navTrust: 'Verification',
    eyebrow: 'Independent · Local-first · Verifiable', heroTitle: 'Make DeepSeek Harness easier to launch, observe, and trust.',
    heroLede: 'One place for the launcher, status plugins, and read-only diagnostics. Every download leads back to a verifiable GitHub Release.',
    exploreLauncher: 'Download for Windows', explorePlugins: 'Browse plugins',
    independence: 'An independent community project. Not an official DeepSeek product and not supported, certified, or endorsed by DeepSeek.',
    consoleReady: 'Harness Web is ready', consoleProjects: 'Verified projects', consoleNetwork: 'Runtime analytics', consoleNone: 'None', consoleSource: 'Download source',
    trustPinnedTitle: 'Pinned versions', trustPinnedBody: 'Never install unknown default-branch content', trustHashTitle: 'SHA-256', trustHashBody: 'Separate checksum files for installers',
    trustPrivateTitle: 'Privacy first', trustPrivateBody: 'No telemetry, ads, or third-party fonts', trustCompatTitle: 'Compatibility', trustCompatBody: 'Tested Harness versions are recorded',
    launcherEyebrow: 'Recommended entry point', launcherTitle: 'Start with the Windows launcher', launcherLead: 'Double-click or use a short command to start Harness Web; the tray manages status, logs, restarts, and exit.',
    launcherFeatureOne: 'Starts in the background and waits until ready', launcherFeatureTwo: 'Tray controls status, logs, and processes', launcherFeatureThree: 'Diagnostic reports are redacted by default',
    downloadInstaller: 'Download installer', assetDownloads: 'cumulative GitHub installer downloads', downloadPortable: 'Portable EXE', cumulativeDownloadsShort: 'cumulative downloads', downloadsShort: 'downloads', checksum: 'SHA-256', checksumFile: 'Checksum file',
    downloadNote: 'The installer is not commercially code-signed, so Windows may show SmartScreen on first run. Download counts are file requests, not unique users or installations.',
    androidTitle: 'Experimental Android client', androidSummary: 'Connects only to a Windows host on a trusted private network', experimental: 'Experimental',
    androidWarning: 'The APK cannot run DeepSeek Harness by itself. It requires a Windows PC already running Harness and must not be used on the public internet, public Wi-Fi, or guest networks.',
    downloadAndroid: 'Download Android APK', readSafety: 'Read safety notes first',
    pluginsEyebrow: 'Compose what you need', pluginsTitle: 'Add observability to Harness', pluginsLead: 'Each plugin ships independently, installs from a pinned version, and records its latest verification date.', viewCatalog: 'View catalog source',
    compatibleWith: 'Compatible', copy: 'Copy', copied: 'Install command copied', copyFailed: 'Copy the install command manually', details: 'Details', verified: 'Verified', plugin: 'Plugin',
    methodEyebrow: 'A catalog is not certification', methodTitle: 'What does “verified” mean?', methodBody: 'Toolbox checks public repositories, package versions, Release assets, bundle manifests, patch files, installation docs, and compatibility ranges. It provides reproducible evidence, but does not replace a source audit or constitute DeepSeek certification.',
    methodOne: 'Install URLs are pinned to explicit versions instead of drifting with a default branch.', methodTwo: 'GitHub metadata is collected at build time; viewing this page sends no analytics requests.', methodThree: 'Download buttons point directly to your GitHub Releases, so they count toward the matching asset.',
    footerBody: 'An independent index of third-party plugins and companion tools for DeepSeek Harness.', unavailable: 'Unavailable', dataError: 'Catalog failed to load. Please use GitHub instead.',
  },
}

const screenshots = {
  'dsh-billing': './assets/dsh-billing-ui.png',
  'dsh-error-lens': './assets/dsh-error-lens.png',
  'dsh-concurrency-meter': './assets/dsh-concurrency-meter.png',
  'dsh-provider-probe': './assets/dsh-provider-probe.png',
  'dsh-companion': './assets/companion-overview.png',
}

const state = {
  language: localStorage.getItem('toolbox-language') === 'en' ? 'en' : 'zh',
  catalog: null,
  stats: null,
}

const text = key => translations[state.language][key] ?? key
const assetName = url => decodeURIComponent(new URL(url).pathname.split('/').at(-1))
const formatCount = value => typeof value === 'number' ? new Intl.NumberFormat(state.language === 'zh' ? 'zh-CN' : 'en-US').format(value) : '—'
const formatSize = value => typeof value === 'number' ? `${(value / 1024 / 1024).toFixed(1)} MB` : '—'

function applyLanguage() {
  document.documentElement.lang = state.language === 'zh' ? 'zh-CN' : 'en'
  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = text(element.dataset.i18n)
  })
  document.querySelectorAll('[data-language]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.language === state.language))
  })
  if (state.catalog !== null) renderCatalog()
}

function releaseAsset(projectName, url) {
  return state.stats?.projects?.[projectName]?.assets?.[assetName(url)] ?? null
}

function cumulativeDownloads(projectName, url) {
  return state.stats?.projects?.[projectName]?.downloadTotals?.[assetName(url)] ?? releaseAsset(projectName, url)?.downloadCount
}

function renderLauncher(tool) {
  document.querySelector('#launcher-version').textContent = `v${tool.latestVersion}`
  document.querySelector('#launcher-description').textContent = state.language === 'zh' ? tool.descriptionZh : tool.description

  const installer = releaseAsset(tool.name, tool.installerUrl)
  const portable = releaseAsset(tool.name, tool.portableUrl)
  const installerLink = document.querySelector('#installer-download')
  installerLink.href = tool.installerUrl
  document.querySelector('#installer-size').textContent = formatSize(installer?.size)
  document.querySelector('#installer-count').textContent = formatCount(cumulativeDownloads(tool.name, tool.installerUrl))
  document.querySelector('#portable-download').href = tool.portableUrl
  document.querySelector('#portable-count').textContent = formatCount(cumulativeDownloads(tool.name, tool.portableUrl))
  document.querySelector('#installer-checksum').href = tool.installerChecksumUrl
  document.querySelector('#installer-digest').textContent = installer?.digest?.replace('sha256:', '') ?? '—'

  const android = tool.experimentalDownloads?.find(download => download.platform === 'android')
  const androidBlock = document.querySelector('#android-download')
  if (android === undefined) {
    androidBlock.hidden = true
  } else {
    const androidAsset = releaseAsset(tool.name, android.assetUrl)
    document.querySelector('#android-download-link').href = android.assetUrl
    document.querySelector('#android-release-link').href = android.releaseUrl
    document.querySelector('#android-count').textContent = formatCount(androidAsset?.downloadCount)
  }
}

function showToast(message) {
  const toast = document.querySelector('#toast')
  toast.textContent = message
  toast.classList.add('visible')
  clearTimeout(showToast.timeout)
  showToast.timeout = setTimeout(() => toast.classList.remove('visible'), 2200)
}

async function copyInstall(command) {
  try {
    await navigator.clipboard.writeText(command)
    showToast(text('copied'))
  } catch {
    showToast(text('copyFailed'))
  }
}

function renderPlugins(projects) {
  const grid = document.querySelector('#plugin-grid')
  const template = document.querySelector('#plugin-template')
  grid.replaceChildren()
  for (const project of projects) {
    const card = template.content.firstElementChild.cloneNode(true)
    const visual = card.querySelector('.plugin-visual')
    const image = card.querySelector('img')
    if (screenshots[project.name]) {
      image.src = screenshots[project.name]
      image.alt = `${project.name} preview`
    } else {
      image.remove()
      visual.classList.add('no-image')
    }
    card.querySelector('.plugin-kind').textContent = text('plugin')
    card.querySelector('.plugin-version').textContent = `v${project.latestVersion}`
    card.querySelector('h3').textContent = project.name
    card.querySelector('.plugin-description').textContent = state.language === 'zh' ? project.descriptionZh : project.description
    card.querySelector('.compatibility strong').textContent = project.dshCompatibility
    card.querySelector('.install-command code').textContent = project.install
    card.querySelector('.install-command button').addEventListener('click', () => copyInstall(project.install))
    card.querySelector('.verified-date').textContent = `${text('verified')} ${project.lastVerified}`
    card.querySelector('.plugin-footer a').href = project.url
    grid.append(card)
  }
}

function renderCatalog() {
  const projects = state.catalog.projects
  document.querySelector('#project-count').textContent = String(projects.length)
  const launcher = projects.find(project => project.category === 'tool')
  const plugins = projects.filter(project => project.category === 'plugin')
  if (launcher) renderLauncher(launcher)
  renderPlugins(plugins)
  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = text(element.dataset.i18n)
  })
}

document.querySelectorAll('[data-language]').forEach(button => {
  button.addEventListener('click', () => {
    state.language = button.dataset.language
    localStorage.setItem('toolbox-language', state.language)
    applyLanguage()
  })
})

applyLanguage()

try {
  const [catalogResponse, statsResponse] = await Promise.all([
    fetch('./plugins.json'),
    fetch('./release-stats.json'),
  ])
  if (!catalogResponse.ok || !statsResponse.ok) throw new Error('site data unavailable')
  state.catalog = await catalogResponse.json()
  state.stats = await statsResponse.json()
  renderCatalog()
} catch (error) {
  console.error(error)
  document.querySelector('#plugin-grid').textContent = text('dataError')
}
