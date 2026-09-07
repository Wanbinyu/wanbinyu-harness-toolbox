# Wanbinyu Harness 工具箱

[简体中文](README.md) | [English](README.en.md)

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）的独立第三方插件与配套工具索引。

> [!IMPORTANT]
> 本工具箱由 [Wanbinyu](https://github.com/Wanbinyu) 独立维护，不是 DeepSeek 官方项目，也不代表 DeepSeek 官方提供支持、认证或安全保证。收录项目请以各自仓库的 README、版本和许可证为准。

## 最新发布

- [在线打开 DSH Toolbox](https://wanbinyu.github.io/wanbinyu-harness-toolbox/)
- [发布文章：把 DeepSeek Harness 的启动、插件与验证放到一个入口](docs/articles/dsh-toolbox-launch-2026-08-26.md)
- 插件目录已更新至 DeepSeek Harness `0.1.2-rc.1` 适配版本，包含新版 DSH peer 依赖安装兼容修复。
- Windows 启动器已更新至 [`dsh-launcher v0.5.1`](https://github.com/Wanbinyu/dsh-launcher/releases/tag/v0.5.1)，新增跨作者插件与 Skills 推荐、已安装检测和来源健康检查。

## 插件 Bundle

下列项目提供 `package.json` 中的 `dsh.bundle.patch`，并附带 `cordis.patch.yml`，可以通过 Harness profile 的插件流程安装：

| 项目 | 当前版本 | 功能 | 兼容性 |
| --- | --- | --- | --- |
| [dsh-billing](https://github.com/Wanbinyu/dsh-billing) | `0.6.5` | 按 provider/model 统计费用、会话额度和 Web 费用条。 | Harness `0.1.0-rc.6` 至 `rc.8`、`0.1.1-rc.1` 至 `rc.2`、`0.1.2-rc.1` |
| [dsh-error-lens](https://github.com/Wanbinyu/dsh-error-lens) | `0.1.6` | 显示只读、脱敏的供应商错误诊断和处理建议。 | Harness `0.1.0-rc.6` 至 `rc.8`、`0.1.1-rc.1` 至 `rc.2`、`0.1.2-rc.1` |
| [dsh-concurrency-meter](https://github.com/Wanbinyu/dsh-concurrency-meter) | `0.1.5` | 监控活动请求、峰值并发、执行结果和供应商分组。 | Harness `0.1.0-rc.6` 至 `rc.8`、`0.1.1-rc.1` 至 `rc.2`、`0.1.2-rc.1` |
| [dsh-provider-probe](https://github.com/Wanbinyu/dsh-provider-probe) | `0.3.5` | 手动检查供应商连通性、延迟、能力和常见故障。 | Harness `0.1.0-rc.6` 至 `rc.8`、`0.1.1-rc.1` 至 `rc.2`、`0.1.2-rc.1` |
| [dsh-plugin-git-inspect](https://github.com/Wanbinyu/dsh-plugin-git-inspect) | `0.3.5` | 提供只读的 Git 状态、diff、摘要、提交、历史和 refs 工具。 | Harness `0.1.0-rc.5` 至 `rc.8`、`0.1.1-rc.1` 至 `rc.2`、`0.1.2-rc.1` |
| [dsh-companion](https://github.com/Wanbinyu/dsh-companion) | `0.1.11` | 本地状态感知桌面伙伴，显示任务状态、动作和完成反馈。 | Harness `0.1.0-rc.6` 至 `rc.8`、`0.1.1-rc.1` 至 `rc.2`、`0.1.2-rc.1` |

每个插件的精确 Release 安装命令记录在 [`plugins.json`](plugins.json) 中，避免默认分支更新后安装结果发生变化。

## 配套工具

| 项目 | 类型 | 功能 | 使用 |
| --- | --- | --- | --- |
| [dsh-launcher](https://github.com/Wanbinyu/dsh-launcher) | Windows 后台启动器 | 一键安装、更新和修复 Harness；双击或用 `dsh`、`deepseek` 启动 Web，并通过托盘提供插件与 Skills 推荐。 | 下载并运行 [`dsh-launcher-setup.exe`](https://github.com/Wanbinyu/dsh-launcher/releases/download/v0.5.1/dsh-launcher-setup.exe)。 |

启动器不是 Cordis 插件，也不需要 `cordis.yml` 或 `dsh.bundle`。把它单列可以避免将“能扩展 Harness 的插件”和“帮助启动 Harness 的工具”混为一谈。

## 收录与核验标准

目录中的 `plugins.json` 提供机器可读数据。可以运行 `npm run verify` 自动检查公开仓库、包版本、最新 Release、安装包、bundle 清单、patch 文件、README 安装说明和 launcher Release 资产。对于可声明为 bundle 的项目，至少核对以下内容：

- `package.json` 包含 `dsh.bundle.patch`，且指向仓库内的 patch 文件。
- patch 文件能插入仓库实际提供的插件包，并写明所需配置。
- README 写明 Harness 兼容版本、运行时要求、安装方法和项目边界。
- 安装路径可复现，许可证和 Issue 入口清晰。

`lastVerified`、`latestVersion`、`releaseUrl` 和 `verificationStatus` 用于让客户端判断目录信息的新鲜度；它们不是 DeepSeek 官方认证标记。

普通插件也可以由宿主项目安装为依赖，再由用户自己的 `cordis.patch.yml` 手动组合；这种项目应明确标记为手动组合，而不是声称支持 `dsh plugin ... add`。

## 找到更多项目

可以在 GitHub 搜索 [`dsh-plugin`](https://github.com/topics/dsh-plugin) 话题，但话题本身不等于插件资格。收录前请检查 bundle 清单、安装路径和 README，不要只按仓库名称或 star 数判断。

官方讨论入口：[DeepSeek Harness Discussions](https://github.com/deepseek-ai/deepseek-harness/discussions)。本目录的展示帖：[Discussion #1045](https://github.com/deepseek-ai/deepseek-harness/discussions/1045)。

## 静态工具中心

在线地址：<https://wanbinyu.github.io/wanbinyu-harness-toolbox/>

`site/` 使用本仓库的 `plugins.json` 生成双语响应式下载与插件目录。Release 下载量和 SHA-256 摘要在构建时从 GitHub API 获取，浏览页面时不会连接统计服务，也不会代理安装包；下载按钮直接指向固定版本的 GitHub Release 资产。

```sh
npm ci
npm run site:build
```

构建结果位于 `dist/`。匿名 GitHub API 遇到限流时，本地构建会复用上一次成功构建的统计数据；CI 使用 `GITHUB_TOKEN` 获取当前数据。`.github/workflows/pages.yml` 会验证目录、构建网站并部署 GitHub Pages，同时每天刷新一次构建时下载量。

## 许可证

目录采用 MIT 许可证；收录项目分别遵循各自仓库的许可证。

## 语言

- [English README](README.en.md)
