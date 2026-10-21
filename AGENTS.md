# AGENTS.md

> 原始项目：[VueTorrent/VueTorrent](https://github.com/VueTorrent/VueTorrent)
> 当前 fork：[xchenya/VueTorrent](https://github.com/xchenya/VueTorrent)
> 默认开发分支：`master`。

本文面向在本仓库工作的 AI 编程助手，适用于仓库根目录及其子目录；若子目录存在更具体的 `AGENTS.md`，同时遵循其局部约定。用户当前明确要求优先于本文中的默认工作方式。

## 1. 协作与 fork 边界

- 默认用中文沟通。修改代码前先简要说明问题、依据、影响范围和实现方案；信息充分时直接继续，不为常规实现细节反复确认。
- 先阅读相关源码、相邻测试和配置，优先最小改动；不顺带重构、升级依赖、修改默认行为或批量格式化无关文件。
- 当前工作目标是 `xchenya/VueTorrent`。执行 Git 操作前检查工作区、分支及 remote，保留用户未提交的改动。
- “更新本 fork 的 `master`”与“同步上游”是不同操作。没有同步任务时，不主动从 `VueTorrent/VueTorrent` merge、rebase 或覆盖本地改动；也不自动添加上游同步工作流。
- 提交、PR 和合并按用户授权在本 fork 内进行，目标分支以实际仓库为准，不把 `master` 擅自改名为 `main`，不默认向上游提交 PR。
- 保留原作者署名、项目来源和 `LICENSE`。调整链接时逐项区分本 fork 的入口、上游文档、第三方依赖和发布地址，不全局替换 `VueTorrent`。
- 遇到无法验证的环境或接口问题，说明证据和限制，先做最小验证，不把推测写成事实。

## 2. 项目与源码入口

VueTorrent 是 qBittorrent 的替代 WebUI，以静态前端通过 qBittorrent WebAPI 工作。`vuetorrent-backend` 是可选的独立服务，本仓库不实现 qBittorrent 下载引擎或该后端。

主要技术：Vue 3、TypeScript、Vite、Vuetify、Pinia、Vue Router、Vue I18n、Axios、SCSS；测试使用 Vitest、Vue Test Utils 和 jsdom。
依赖版本以 `package.json` 和 `package-lock.json` 为准，不以 README 徽章推断。编写本文时，仓库依赖已使用 Vuetify 4、Vite 8、Pinia 4。

| 路径 | 职责与修改入口 |
| --- | --- |
| `src/main.ts`、`src/App.vue` | 应用初始化、插件注册、认证后同步、全局对话框与布局 |
| `src/pages/`、`src/pages/index.ts` | 页面与路由定义 |
| `src/components/` | 按 Dashboard、Dialogs、Settings、TorrentDetail 等划分的界面组件；通用组件在 `Core/` |
| `src/stores/` | Pinia 状态及业务动作；`app.ts` 管理认证与版本，`maindata.ts` 管理增量同步，`torrents.ts` 管理种子与操作 |
| `src/stores/vuetorrent.ts` | WebUI 偏好、主题、显示选项和持久化设置 |
| `src/services/qbit/` | `IProvider.ts` 接口、`QbitProvider.ts` 真实 API、`MockProvider.ts` 模拟实现、`index.ts` 实现选择 |
| `src/services/backend.ts`、`src/composables/BackendSync.ts` | 可选后端及设置同步 |
| `src/composables/`、`src/helpers/` | 可复用组合逻辑、定时器、数据构建及纯工具函数 |
| `src/types/qbit/`、`src/constants/qbit/` | qBittorrent API 模型、请求、响应和常量 |
| `src/types/vuetorrent/`、`src/constants/vuetorrent/` | 前端数据模型、显示属性和常量 |
| `src/locales/`、`src/plugins/i18n.ts` | 翻译数据和国际化配置 |
| `src/plugins/`、`src/themes/`、`src/styles/` | 路由与其他插件、主题定义、公共样式 |
| `public/`、`docs/` | 静态资源，以及截图和图标；`docs/` 不是独立文档应用 |
| `tests/setup.ts`、`src/**/*.spec.ts` | 测试初始化及与实现相邻的单元/组件测试 |
| `vite.config.ts`、`postbuild.cjs`、`.github/workflows/` | 开发代理、构建、PWA、测试配置及 CI/发布 |

## 3. 安装、开发与构建

- 使用 npm，保留 `package-lock.json`；`packageManager` 当前声明 `npm@11.6.2`。不要额外引入 yarn/pnpm 锁文件。
- 当前没有固定的 Node `engines` 版本，CI 使用 `node-version: 'latest'`。选择符合锁定依赖运行要求的 Node，排障时记录实际 Node/npm 版本，不凭空声称最低支持版本。
- 干净环境使用 `npm ci`。仅在确实修改依赖时更新锁文件，不为解决网络失败随意升级依赖。

| 命令 | 用途 |
| --- | --- |
| `npm ci` | 按锁文件安装依赖 |
| `npm run dev` 或 `npm start` | 启动 Vite；配置端口为 `3000`，监听 `0.0.0.0` |
| `npm run check-build` | `vue-tsc` 类型检查 |
| `npm run lint` | ESLint 检查，当前配置主要覆盖 `src/` |
| `npm run lint:fix` | 自动修复；会写文件，执行后检查是否产生无关差异 |
| `npm test` | 单次执行 Vitest |
| `npm test -- src/helpers/path.spec.ts` | 示例：只执行指定测试 |
| `npm run coverage` | 覆盖率报告，输出到 `tests/unit/coverage/` |
| `npm run build` | 类型检查与正式构建，并由 npm 自动执行 `postbuild` |
| `npm run build-demo` | 类型检查与模拟数据 demo 构建 |
| `npm run preview` / `npm run preview-demo` | 预览对应构建产物；不能代替真实后端联调 |

首次配置时将 `.env.sample` 复制为 `.env`，已有 `.env` 则保留原配置。变量含义：

```dotenv
VITE_QBITTORRENT_TARGET=http://localhost:8080
VITE_USE_MOCK_PROVIDER=true
VITE_FAKE_TORRENTS_COUNT=5
```

- `.env.sample` 中 mock 默认是 `false`；以上示例主动开启 mock，适合界面开发和隔离验证。
- 开发模式仅在 `VITE_USE_MOCK_PROVIDER` 为字符串 `true` 时选择 mock；`demo` 模式始终选择 mock。正式生产构建不能靠这个开发变量切换到 mock。
- 真实联调时关闭 mock，将 `VITE_QBITTORRENT_TARGET` 指向测试用 qBittorrent；开发服务器把 `/api` 和 `/backend` 代理到该目标。
- 可选的 `docker-compose.yml` 提供本地 qBittorrent 测试环境，映射 `8080` 和 `6881`，数据在 `./docker/`。先检查现有容器和端口，不覆盖用户已有实例。
- `.env` 与 `VITE_*` 变量不能用来存放需要保密的前端凭据；不要把 Cookie、API key、密码或 tracker passkey 写入源码、日志、截图和测试 fixture。

**构建目录不是 `dist/`：**

- 正式静态资源输出为 `vuetorrent/public/`。
- `npm run build` 后的 `postbuild.cjs` 在 `vuetorrent/version.txt` 写入版本；直接运行 `vite build` 不包含这个 npm 后处理。
- demo 输出为 `vuetorrent-demo/`。源码中的 `public/` 是输入资源目录。
- 不提交 `node_modules/`、构建产物、覆盖率、`.env` 或本地 `docker/` 数据；发布产物分支由发布流程管理。

## 4. 实现约定

### Vue、样式与类型

- 沿用 Vue 单文件组件、`<script setup lang="ts">` 和 Composition API；复用已有 Vuetify 组件及 `Core/` 组件。
- `@/` 映射到 `src/`，跨目录导入优先使用现有别名约定；遵循 ESLint 的导入排序和扩展名规则。
- 遵循 `.prettierrc.json`：2 空格、单引号、无分号、180 列、ES5 尾逗号。独立函数使用函数声明，回调沿用项目习惯。
- TypeScript 为 strict；优先复用具体类型，API 字段同步维护对应 models、payloads 和 responses。不要用随意的类型断言掩盖不匹配。
- 复用主题色、间距和现有响应式布局。修改界面时检查桌面/移动端、浅色/深色、长文本和禁用/加载状态。
- 保留 Dashboard 的 Grid、List、Table 三种视图一致性，以及选中状态、筛选、键盘快捷键和触屏操作。

### API 与状态

- qBittorrent 请求通过 `@/services/qbit` 和对应 store；不要在组件内另建散落的 API 请求绕过 Provider。
- 新增 Provider 能力时同步修改 `IProvider.ts`、`QbitProvider.ts`、`MockProvider.ts` 和相关类型，使真实模式与 demo 均可工作。
- 真实 Provider 使用相对 `baseURL: 'api/v2'`，POST 默认按表单编码。保留已有参数序列化、文件上传和响应约定，不能统一强改成 JSON。
- 保留 qBittorrent 版本分支：例如 5.x 使用 start/stop，旧版本使用 resume/pause。复用 `app` store 的能力检测；版本比较优先使用已有 `compareVersions`，不要新增字符串字典序比较。
- 修改同步时保留 `rid`、全量更新、增量合并和 `*_removed` 删除语义；不要把部分响应当作完整对象覆盖。
- 不在每个组件重复启动轮询；沿用 `maindata` 和 `useTimer` 生命周期，保留退出登录时停轮询及 403 失效处理。
- 设置新增或改名时检查默认值、store 返回值、`$reset`、持久化、导入导出及 `BackendSync` 的白名单/黑名单；保证已有用户配置可继续读取。
- 可选后端不可用时仍须支持基本 WebUI 功能，不能让 `/backend` 的失败阻塞认证或种子列表。
- 删除操作必须保留“仅删除任务”与“同时删除文件”的区别，正确传递选中 hash 与 `deleteFiles`；不要在未授权的真实实例上进行删除、移动文件、关机等验证。

### 国际化与部署兼容

- 用户可见文案使用现有 i18n key 和 `useI18nUtils()` / `t()`，不在组件里硬编码中文或英文。
- 上游通过 Tolgee 维护翻译；见 `.github/CONTRIBUTING.md`。本 fork 新增功能需要新文案时，至少补齐 `en.json` 和 `zh-Hans.json`，遵循现有 key 结构及占位符，其余语言可使用现有英文 fallback。
- 不为一个功能批量重写其他语言。`translations.yml` 和发布流程会重新导入 Tolgee 数据，启用这些流程前须处理本 fork 新增 key 的保留问题。
- 路由使用 hash history，Vite `base` 为 `./`。保留子路径部署下 API、静态资源、magnet 链接和 PWA 的路径行为，不擅自改成 history 路由或写死根路径。
- 涉及 PWA 时检查 `vite.config.ts`、`index.html`、`public/globalErrorHandler.js`，区分开发环境与构建预览；PWA 在当前开发配置中关闭。

## 5. 验证与交付

- 先做与改动直接相关的验证。纯文档修改核对路径、命令和 diff 即可，不必安装依赖或新增测试。
- 业务逻辑或缺陷修复优先补充能复现问题的邻近 `*.spec.ts`，不要编写仅重复实现的测试。现有配置使用 jsdom 和 `tests/setup.ts`。
- 代码改动的常规验收命令为 `npm test`、`npm run build`、`npm run lint`，与 `test.yml` 一致。正式 build 已包含类型检查，不必机械重复执行 `check-build`。
- 涉及 Provider、环境切换或构建时补验 `npm run build-demo`；UI 改动按影响范围进行实际界面检查。mock 验证不能声称真实 qBittorrent 联调通过。
- 遇到依赖下载受限、Node 不兼容、缺少浏览器/后端或既有失败时，报告具体阻塞、已做验证和未做项目，不修改无关配置来掩盖失败。
- 完成时简要说明：修改内容与原因、验证结果、剩余限制；涉及提交时给出本 fork 的提交或 PR 链接。提交信息沿用 `feat:`、`fix:`、`docs:`、`chore:` 等 Conventional Commits 风格。

## 6. fork 发布注意事项

当前仓库保留上游发布配置，不能假定 fork 已具备上游的 secrets、外部仓库或镜像仓库权限：

- `.github/workflows/build-release.yml` 监听 `master` push，使用 `GH_PAT`、`TOLGEE_TOKEN`，包含 nightly tag、产物分支、镜像和 demo 发布。
- 其中镜像目标仍是 `ghcr.io/VueTorrent/vuetorrent-lsio-mod`，demo 目标仍是 `VueTorrent/demo`。只有发布任务明确要求时才调整或启用对应流程，不以测试为由向上游目标推送。
- `src/services/Github.ts` 当前从上游查询最新版；`docker-compose.yml` 也使用上游 Docker mod。若任务涉及本 fork 的更新/分发，需要一起检查这些入口，不能仅改 README 后声称已完成独立发布。
- 版本和 CHANGELOG 由 Release Please 配置协作管理；普通功能修复不顺带手工改版本、生成 release 或修改发布凭据。
- 本文与代码不一致时先核对当前源码及配置，并在同一任务中修正对应说明；不要为了迎合文档而修改正确实现。
