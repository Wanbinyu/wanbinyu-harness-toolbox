# 把 DeepSeek Harness 的启动、插件与验证放到一个入口：DSH Toolbox 今日上线

2026 年 8 月 26 日，我发布了新版 `dsh-launcher v0.4.0`，同时上线了一个新的工具入口：**Wanbinyu DSH Toolbox**。

访问地址：<https://wanbinyu.github.io/wanbinyu-harness-toolbox/>

如果你正在 Windows 上尝试 DeepSeek Harness，可能遇到过这些问题：第一次安装需要准备哪些环境？启动之后去哪里看状态？插件如何选择和安装？下载的文件是不是对应明确版本？

DSH Toolbox 想做的事情很简单：把启动器、插件、实验工具和可核验的下载信息整理到一个页面，让第一次使用和后续维护都少走一些弯路。

> DSH Toolbox、dsh-launcher 及页面收录的 Wanbinyu 项目均为独立社区项目，不是 DeepSeek 官方产品，也不代表 DeepSeek 官方提供支持、认证或安全保证。

## 今天发布了什么

### 1. dsh-launcher v0.4.0：从“启动”走向“一键安装与维护”

新版 Windows 启动器不再假定用户已经准备好完整环境。第一次启动时，它会检查 Node.js `22.19.0+`、npm、`winget` 和现有 Harness：

- 没有 Node.js 时，在用户明确确认后通过 Windows Package Manager 安装 Node.js LTS。
- 从 npm 安装并校验官方 `@deepseek-ai/dsh` 包，不要求通过 GitHub 获取 Harness。
- 使用独立的用户级受管目录，不覆盖源码目录、全局安装或现有 Web profile。
- 提供安装进度、实时输出、取消操作和可继续处理的错误信息。
- 托盘新增 Harness 安装、更新、修复、打开目录和卸载入口。
- 卸载受管 Harness 时，保留插件、会话、工作区以及 `%USERPROFILE%\.dsh` 数据。

启动器仍提供安装版和便携版。Windows 安装包的历代 GitHub Release 请求量目前已经超过 350 次；这个数字是文件请求次数，不等于独立用户数或实际安装数。

[查看 v0.4.0 Release](https://github.com/Wanbinyu/dsh-launcher/releases/tag/v0.4.0)

### 2. DSH Toolbox：一个公开、双语、可验证的下载入口

新的 Toolbox 网站集中展示：

- Windows 安装版与便携版启动器；
- Android 实验客户端；
- 费用统计、错误诊断、并发监控、供应商探测、只读 Git 检查和状态伙伴等 6 个插件；
- 明确版本、兼容范围、安装命令、Release 下载量、文件大小和 SHA-256 摘要。

下载按钮直接指向固定版本的 GitHub Release，不经过网盘或中转服务器，因此下载仍会计入相应 GitHub 资产。页面中的统计数据在 GitHub Actions 构建时读取，浏览网页时不会调用统计接口。

网站没有广告、遥测、第三方字体、Google Analytics 或其他跟踪请求。今天加入的交互水波背景也完全在浏览器本地渲染；移动端会降低负载，系统开启“减少动态效果”时会自动关闭动画。

[打开 DSH Toolbox](https://wanbinyu.github.io/wanbinyu-harness-toolbox/)

### 3. Android 实验版：把手机作为可信私有网络中的访问端

Android 包是一个独立实验频道，不会影响 Windows 正式版的版本判断。它不能在手机上独立运行 DeepSeek Harness，必须连接到一台已经运行 Harness 的 Windows 电脑，并且只应在可信私有网络中使用。

请不要把它用于公网、公共 Wi-Fi 或访客网络。下载前建议先阅读 Release 中的限制和安全说明。

[查看 Android v0.1.2 实验版](https://github.com/Wanbinyu/dsh-launcher/releases/tag/android-v0.1.2)

## “已验证”不等于“官方认证”

Toolbox 的“已验证”表示目录自动核对了公开仓库、包版本、Release 资产、bundle 清单、patch 文件、安装说明和兼容范围，并把安装地址固定到明确版本。

它提供的是可重复检查的证据，不代替完整源码审计，也不构成 DeepSeek 官方认证。用户仍应阅读各项目的 README、Release 说明和许可证，并根据自己的环境决定是否安装。

## 接下来

Toolbox 会随 `main` 分支自动部署，并每天刷新一次构建时下载数据。接下来我会继续完善启动器的安装体验、插件兼容记录和移动端展示，也欢迎通过 GitHub Issues 反馈真实安装问题或提出插件需求。

- [访问 DSH Toolbox](https://wanbinyu.github.io/wanbinyu-harness-toolbox/)
- [查看工具箱源码与核验规则](https://github.com/Wanbinyu/wanbinyu-harness-toolbox)
- [提交问题或建议](https://github.com/Wanbinyu/wanbinyu-harness-toolbox/issues)

如果它帮你减少了一次环境配置、版本确认或插件排查，也欢迎把这个入口分享给其他正在尝试 DeepSeek Harness 的用户。
