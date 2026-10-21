# VueTorrent

> 本项目复刻自 [VueTorrent/VueTorrent](https://github.com/VueTorrent/VueTorrent)，在 [xchenya/VueTorrent](https://github.com/xchenya/VueTorrent) 中维护。
> 感谢原作者及所有贡献者，原项目署名与许可证继续保留。

**简体中文** | [English](README.en.md)

基于 Vue.js 构建的 qBittorrent WebUI，提供简洁美观的界面和适配移动端的操作体验。

<p align="center">
  <img src="VueTorrent-logo.png" width="260" alt="VueTorrent" />
</p>

![Vue](https://img.shields.io/badge/Vue-3-brightgreen) ![Vuetify](https://img.shields.io/badge/Vuetify-4-brightgreen)
![qBittorrent](https://img.shields.io/badge/qBittorrent-4.4%2B-brightgreen)

[![Stars](https://img.shields.io/github/stars/xchenya/VueTorrent)](https://github.com/xchenya/VueTorrent/stargazers)
[![Forks](https://img.shields.io/github/forks/xchenya/VueTorrent)](https://github.com/xchenya/VueTorrent/forks)
[![Pull requests](https://img.shields.io/github/issues-pr/xchenya/VueTorrent)](https://github.com/xchenya/VueTorrent/pulls)
[![License](https://img.shields.io/github/license/xchenya/VueTorrent)](LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor_Covenant-2.1-4baaaa.svg)](.github/CODE_OF_CONDUCT.md)

[项目仓库](https://github.com/xchenya/VueTorrent) · [发布版本](https://github.com/xchenya/VueTorrent/releases) · [Pull Requests](https://github.com/xchenya/VueTorrent/pulls) · [Actions](https://github.com/xchenya/VueTorrent/actions)

[本项目修改](#本项目修改) · [调整默认设置](#调整默认设置) · [安装](#安装) · [开发](#开发) · [界面截图](#界面截图)

## 本项目修改

本 fork 在 VueTorrent 原项目基础上维护，主要调整如下：

| 项目 | 当前设置与说明 |
| --- | --- |
| **默认语言** | 简体中文（`zh-Hans`），缺失翻译回退到英文 |
| **每页条数** | 默认 **30 条** |
| **统一默认配置** | 集中维护在 [src/config/defaults.ts](src/config/defaults.ts)，初始化与恢复默认共用配置 |
| **双语文档** | 默认使用中文 README，同时保留 [English](README.en.md)；仓库、发布和贡献入口指向本 fork |
| **自动发布** | 更新 `master` 后自动打包到 [最新开发版](https://github.com/xchenya/VueTorrent/releases/tag/latest_nightly)，也支持正式版本与手动构建 |
| **开发约定** | [AGENTS.md](AGENTS.md) 说明项目结构、开发规范、验证方式与 fork 发布边界 |

### 调整默认设置

编辑 [src/config/defaults.ts](src/config/defaults.ts)，执行 `npm run build`，再部署生成的 `vuetorrent/` 目录。

<details>
<summary>展开默认配置索引</summary>

| 配置位置 | 可调整的默认值 |
| --- | --- |
| `localeDefaults` | 界面语言与缺失翻译的回退语言 |
| `createVueTorrentDefaults()` | 每页条数、主题、刷新间隔、显示单位、标题、详情页选项等 |
| `createDashboardDefaults()` | 默认列表、网格或表格视图 |
| `createSidebarDefaults()` | 侧栏位置、组件顺序与显示状态、筛选项 |
| `createTorrentFilterDefaults()` | 默认筛选和排序 |
| `torrentPropertyDefaults` | 种子属性的显示状态与顺序；`order` 应保持连续且不重复 |
| `defaultDateFormat`、`defaultDurationFormat`、`defaultHistorySize` | 日期格式、时长格式和历史记录条数 |

下载目录、限速等 qBittorrent 服务端配置不在此文件中。

</details>

> [!NOTE]
> 新的语言和每页条数用于首次访问或恢复默认设置。浏览器和可选后端中已保存的个人设置仍然优先，升级不会覆盖它们。
> 已有用户若想使用简体中文和每页 30 条，可直接在界面设置中调整这两项。

## 界面截图

<details>
<summary>查看桌面端与移动端截图（浅色 / 深色）</summary>

- 桌面端：浅色模式

<p>
  <img src="docs/screenshots/screenshot-desktop.webp" width="800" alt="桌面端界面（浅色模式）" />
</p>

- 桌面端：深色模式

<p>
  <img src="docs/screenshots/screenshot-desktop-dark-mode.webp" width="800" alt="桌面端界面（深色模式）" />
</p>

- 移动端：浅色模式

<p>
  <img src="docs/screenshots/screenshot-mobile.webp" width="400" alt="移动端仪表盘（浅色模式）" />
  <img src="docs/screenshots/screenshot-mobile-navbar.webp" width="400" alt="移动端导航栏（浅色模式）" />
</p>

- 移动端：深色模式

<p>
  <img src="docs/screenshots/screenshot-mobile-dark-mode.webp" width="400" alt="移动端仪表盘（深色模式）" />
  <img src="docs/screenshots/screenshot-mobile-navbar-dark-mode.webp" width="400" alt="移动端导航栏（深色模式）" />
</p>

</details>

## 本地演示

可以直接运行本项目的模拟数据演示，无需连接 qBittorrent。在克隆后的项目目录执行：

```bash
npm ci
npm run build-demo
npm run preview-demo
```

打开终端输出的预览地址。

> [!NOTE]
> 演示模式使用模拟数据，不会连接真实的 qBittorrent 实例，也不会实际下载种子或修改真实下载器的设置。

## 安装

### 自动打包与发布

工作流：[Build and publish releases](https://github.com/xchenya/VueTorrent/actions/workflows/release.yml)。使用 GitHub 自带的 `GITHUB_TOKEN`，无需配置额外密钥。

| 触发方式 | Releases 中的结果 |
| --- | --- |
| 推送或合并代码到 `master` | 自动更新 `latest_nightly` 开发版（标记为预发布） |
| 推送 `vX.Y.Z` 标签 | 发布对应正式版本；标签须与 `package.json` 版本一致 |
| Actions → Run workflow | 选择 `master` 手动更新开发版；也可选择已有版本标签补跑正式发布 |

测试、lint 和构建通过后，上传 **`vuetorrent.zip`** 与 **`SHA256SUMS.txt`**。开发版滚动更新，已发布的正式版本保留原包。
流程只向本仓库发布，使用仓库内的翻译，不依赖上游 Tolgee，也不发布上游 Docker 镜像或演示站。

首次 fork 若 Actions 显示未启用，先在 Actions 页启用工作流，再手动运行一次。需要打包的提交不要添加 `[skip ci]`。

### 使用发布包

从[本项目的 Releases 页面](https://github.com/xchenya/VueTorrent/releases)下载 **`vuetorrent.zip`**。最新代码构建位于 [latest_nightly](https://github.com/xchenya/VueTorrent/releases/tag/latest_nightly)。

不要下载 GitHub 自动生成的 **Source code (zip / tar.gz)** 作为 WebUI；它们是未编译的源码。首次构建完成前，也可使用下面的源码构建方式。

解压后，将整个 `vuetorrent` 目录放到 qBittorrent 能够访问的位置，在 qBittorrent 的设置 → WebUI 中启用“使用备用 Web 用户界面”，将文件位置设置为该目录的绝对路径。

目标目录内应包含 `public/` 和 `version.txt`，因此应选择 `vuetorrent` 目录，而不是其中的 `public` 子目录。容器部署时填写容器内可访问的路径。

### 从源码构建

准备满足项目依赖要求的 Node.js 和 npm；npm 版本声明见 [package.json](package.json)，开发约定见 [AGENTS.md](AGENTS.md)。

```bash
git clone https://github.com/xchenya/VueTorrent.git
cd VueTorrent
npm ci
npm run build
```

构建完成后，按上述方式部署生成的 `vuetorrent/` 目录。

## 开发

1. 克隆本项目并进入项目目录。
2. 执行 `npm ci` 安装锁定的依赖。
3. 首次配置时将 `.env.sample` 复制为 `.env`，已有配置则保留。
4. 执行 `npm start`，访问终端显示的开发地址，默认端口为 `3000`。

只开发界面时，可以在 `.env` 中启用模拟数据：

```dotenv
VITE_USE_MOCK_PROVIDER=true
VITE_FAKE_TORRENTS_COUNT=5
```

连接真实的测试下载器时，使用：

```dotenv
VITE_USE_MOCK_PROVIDER=false
VITE_QBITTORRENT_TARGET=http://localhost:8080
```

- 使用该 qBittorrent 实例的账号密码登录；新建容器的初始登录信息以容器启动日志为准。
- 如开发代理受到 Host header validation（主机头校验）限制，只调整测试实例的对应设置。
- 可选：执行 `docker compose up -d` 启动仓库提供的 qBittorrent 测试容器，先确认 `8080`、`6881` 端口未被占用。

常用检查命令：

```bash
npm run lint
npm run lint:fix
npm test
npm run build
```

`lint:fix` 会修改文件。更多目录说明、API 约定和验证要求见 [AGENTS.md](AGENTS.md)。

## 功能

- **种子管理**：添加、删除、暂停、恢复和重命名种子；选择需要下载的文件；查看种子信息、Tracker、连接用户、文件内容、标签和分类；直接在 WebUI 中搜索种子。
- **系统信息**：查看下载/上传速度、会话下载/上传量和剩余空间，显示传输图表，并修改常用设置。
- **移动端与 PWA**：适配移动端，可安装为渐进式 Web 应用。
- **可自定义仪表盘**：选择进行中和已完成种子需要显示的属性。
- **版本适配**：针对新版 qBittorrent 持续优化。
- **可选后端**：[vuetorrent-backend](https://github.com/VueTorrent/vuetorrent-backend) 是独立的外部项目，可用于在服务端保存设置；它是可选组件，使用 VueTorrent 不需要强制安装。
- **增强版支持**：支持 [qBittorrent Enhanced Edition](https://github.com/c0re100/qBittorrent-Enhanced-Edition) 的相关设置。

### 键盘快捷键

支持 Mac 键位：将下表中的 <kbd>Ctrl</kbd> 替换为 <kbd>Cmd</kbd>。

| 操作 | 快捷键 |
| --- | --- |
| 关闭对话框或返回仪表盘 | <kbd>Escape</kbd> |
| 在仪表盘全选种子 | <kbd>Ctrl</kbd> + <kbd>A</kbd> |
| 聚焦种子搜索框；再次按下调用浏览器搜索 | <kbd>Ctrl</kbd> + <kbd>F</kbd> |
| 没有对话框时取消搜索框焦点；再次按下取消种子选择 | <kbd>Escape</kbd> |
| 删除已选种子 | <kbd>Delete</kbd>；Mac 使用 <kbd>Fn</kbd> + <kbd>Backspace</kbd> |
| 启用多选 | 按住 <kbd>Ctrl</kbd> 点击种子卡片 |
| 选择上次选中项与当前项之间的所有种子 | 按住 <kbd>Shift</kbd> 点击种子卡片 |

## 重要说明

VueTorrent 是使用 qBittorrent WebAPI 的 **WebUI**，可以理解为下载器的可视化界面。它不会替换 qBittorrent 下载引擎，也不会改变 *arr 等自动化工具通过 qBittorrent API 工作的方式。

## 参与贡献

欢迎提交问题修复、功能改进、文档和本 fork 所需的本地化修改。

- 从本项目的 `master` 分支创建工作分支，将 PR 提交到 [xchenya/VueTorrent](https://github.com/xchenya/VueTorrent/pulls)。
- 在 PR 中说明修改原因、影响范围、复现步骤和验证结果。
- 遵循 [AGENTS.md](AGENTS.md) 中的开发约定，以及[贡献者行为准则](.github/CODE_OF_CONDUCT.md)。
- 每个 PR 聚焦一个目标，并按改动范围执行测试、构建和代码检查。

## 帮助与反馈

- [本项目仓库](https://github.com/xchenya/VueTorrent)
- [安装说明](#安装)
- [开发说明](#开发)
- [本项目 Pull Requests](https://github.com/xchenya/VueTorrent/pulls)

当前 fork 未启用 Issues 和 Discussions。可先查看 README、[开发约定](AGENTS.md)和已有 PR；代码或文档改进请提交到本项目。

## 赞助

捐赠完全自愿。仓库现有的[赞助配置](.github/FUNDING.yml)沿用原项目，支持对象为原项目维护者。

## 致谢与许可证

感谢原项目维护者和所有贡献者，包括：

- [@m4ximuel](https://github.com/m4ximuel)
- [@Larsluph](https://github.com/Larsluph)

本 fork 由 [@xchenya](https://github.com/xchenya) 维护，继续使用 [GPL-3.0 许可证](LICENSE)。
