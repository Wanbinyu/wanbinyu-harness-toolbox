# Wanbinyu Harness Toolbox

[简体中文](README.md) | [English](README.en.md)

An independent third-party index of plugins and companion tools for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`).

> [!IMPORTANT]
> This toolbox is maintained independently by [Wanbinyu](https://github.com/Wanbinyu). It is not an official DeepSeek project and is not supported, certified, or security-reviewed by DeepSeek. Refer to each project's README, release history, and license.

## Latest Release

- [Open DSH Toolbox](https://wanbinyu.github.io/wanbinyu-harness-toolbox/)
- The plugin catalog now points to DeepSeek Harness `0.1.2-rc.1` compatible builds, including the rc peer-dependency install fix.
- Windows launcher [`dsh-launcher v0.5.1`](https://github.com/Wanbinyu/dsh-launcher/releases/tag/v0.5.1) adds a multi-publisher plugin and Skills guide, installed-item detection, and opt-in source health checks.

## Plugin Bundles

These projects provide `dsh.bundle.patch` in `package.json` and ship a `cordis.patch.yml`, so they can be installed through a Harness profile's plugin flow:

| Project | Current version | What it provides | Compatibility |
| --- | --- | --- | --- |
| [dsh-billing](https://github.com/Wanbinyu/dsh-billing) | `0.6.5` | Per-provider/model cost accounting, session quota, and a Web cost strip. | Harness `0.1.0-rc.6` through `rc.8`, plus `0.1.1-rc.1` through `rc.2` and `0.1.2-rc.1` |
| [dsh-error-lens](https://github.com/Wanbinyu/dsh-error-lens) | `0.1.6` | Read-only, redacted provider error diagnostics and recovery guidance. | Harness `0.1.0-rc.6` through `rc.8`, plus `0.1.1-rc.1` through `rc.2` and `0.1.2-rc.1` |
| [dsh-concurrency-meter](https://github.com/Wanbinyu/dsh-concurrency-meter) | `0.1.5` | Active request, peak concurrency, result, and provider-group monitoring. | Harness `0.1.0-rc.6` through `rc.8`, plus `0.1.1-rc.1` through `rc.2` and `0.1.2-rc.1` |
| [dsh-provider-probe](https://github.com/Wanbinyu/dsh-provider-probe) | `0.3.5` | Explicit provider connectivity, latency, capability, and failure checks. | Harness `0.1.0-rc.6` through `rc.8`, plus `0.1.1-rc.1` through `rc.2` and `0.1.2-rc.1` |
| [dsh-plugin-git-inspect](https://github.com/Wanbinyu/dsh-plugin-git-inspect) | `0.3.5` | Read-only Git status, diff, summary, commit, history, and refs tools. | Harness `0.1.0-rc.5` through `rc.8`, plus `0.1.1-rc.1` through `rc.2` and `0.1.2-rc.1` |
| [dsh-companion](https://github.com/Wanbinyu/dsh-companion) | `0.1.10` | A local, state-aware desktop companion with task status, actions, and completion feedback. | Harness `0.1.0-rc.6` through `rc.8`, plus `0.1.1-rc.1` through `rc.2` |

Exact, version-pinned Release installation commands are stored in [`plugins.json`](plugins.json), so installs do not change when a default branch moves.

## Companion Tools

| Project | Type | What it provides | Use |
| --- | --- | --- | --- |
| [dsh-launcher](https://github.com/Wanbinyu/dsh-launcher) | Windows background launcher | Install, update, and repair Harness; start the Web profile by double-clicking or using `dsh` and `deepseek`, with tray plugin and Skills recommendations. | Download and run [`dsh-launcher-setup.exe`](https://github.com/Wanbinyu/dsh-launcher/releases/download/v0.5.1/dsh-launcher-setup.exe). |

The launcher is not a Cordis plugin and does not need `cordis.yml` or `dsh.bundle`. Keeping it separate avoids confusing Harness extensions with tools that help start Harness.

## Inclusion And Verification

The machine-readable catalog is [`plugins.json`](plugins.json). Run `npm run verify` to check public repositories, package versions, latest Releases, package assets, bundle manifests, patch files, README installation instructions, and launcher Release assets. For projects classified as bundles, the minimum checks are:

- `package.json` contains `dsh.bundle.patch` and points to a patch file shipped in the repository.
- The patch inserts a plugin package actually provided by the repository and documents its configuration.
- The README states Harness compatibility, runtime requirements, installation steps, and project boundaries.
- The installation path is reproducible, with a clear license and issue tracker.

`lastVerified`, `latestVersion`, `releaseUrl`, and `verificationStatus` help clients judge catalog freshness; they are not an official DeepSeek certification.

A regular plugin can also be installed as a host dependency and composed by the user's own `cordis.patch.yml`. Such a project must be labeled as manual composition instead of claiming support for `dsh plugin ... add`.

## Finding More Projects

You can search the GitHub [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic, but a topic is not proof that a repository is a plugin. Check the bundle manifest, installation path, and README instead of relying on a repository name or star count.

Official discussion entry point: [DeepSeek Harness Discussions](https://github.com/deepseek-ai/deepseek-harness/discussions). Catalog showcase: [Discussion #1045](https://github.com/deepseek-ai/deepseek-harness/discussions/1045).

## Static Toolbox Site

Live site: <https://wanbinyu.github.io/wanbinyu-harness-toolbox/>

`site/` turns this repository's `plugins.json` into a bilingual, responsive download and plugin catalog. GitHub Release download counts and SHA-256 digests are collected at build time. Viewing the site sends no analytics requests and downloads are never proxied; every download button points directly to a pinned GitHub Release asset.

```sh
npm ci
npm run site:build
```

The generated site is written to `dist/`. If anonymous GitHub API access is rate-limited, a local rebuild reuses the last successful release metadata; CI uses `GITHUB_TOKEN` for fresh data. `.github/workflows/pages.yml` verifies the catalog, builds the site, deploys GitHub Pages, and refreshes build-time counts daily.

## License

The catalog is released under the MIT License. Each listed project keeps its own license.

## Language

- [简体中文说明](README.md)
