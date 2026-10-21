# VueTorrent

> This project is forked from [VueTorrent/VueTorrent](https://github.com/VueTorrent/VueTorrent) and maintained in [xchenya/VueTorrent](https://github.com/xchenya/VueTorrent).
> Thanks to the original authors and all contributors. Original attribution and licensing are retained.

[简体中文](README.md) | **English**

A sleek qBittorrent WebUI built with Vue.js, with a clean interface and a mobile-friendly experience.

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

[Repository](https://github.com/xchenya/VueTorrent) · [Releases](https://github.com/xchenya/VueTorrent/releases) · [Pull Requests](https://github.com/xchenya/VueTorrent/pulls) · [Actions](https://github.com/xchenya/VueTorrent/actions)

[Fork changes](#fork-changes) · [Customizing defaults](#customizing-defaults) · [Installation](#installation) · [Development](#development) · [Screenshots](#screenshots)

## Fork Changes

This fork builds on VueTorrent with the following adjustments:

| Item | Current setting and details |
| --- | --- |
| **Default language** | Simplified Chinese (`zh-Hans`), with English as the fallback for missing translations |
| **Page size** | **30 torrents** per page by default |
| **Centralized defaults** | [src/config/defaults.ts](src/config/defaults.ts) supplies shared defaults for initialization and reset |
| **Bilingual documentation** | Chinese README by default, with this English version retained; repository, release, and contribution links point to this fork |
| **Development guide** | [AGENTS.md](AGENTS.md) covers project structure, conventions, validation, and fork publishing boundaries |

### Customizing Defaults

Edit [src/config/defaults.ts](src/config/defaults.ts), run `npm run build`, and deploy the generated `vuetorrent/` directory.

<details>
<summary>Expand the default configuration index</summary>

| Configuration | Defaults you can customize |
| --- | --- |
| `localeDefaults` | UI language and fallback language for missing translations |
| `createVueTorrentDefaults()` | Page size, theme, refresh intervals, units, title, detail tab, and other UI preferences |
| `createDashboardDefaults()` | Default list, grid, or table view |
| `createSidebarDefaults()` | Sidebar position, widget order and visibility, and filters |
| `createTorrentFilterDefaults()` | Initial filters and sort order |
| `torrentPropertyDefaults` | Torrent property visibility and order; keep `order` values consecutive and unique |
| `defaultDateFormat`, `defaultDurationFormat`, `defaultHistorySize` | Date format, duration format, and history size |

qBittorrent server settings such as download paths and speed limits are not configured here.

</details>

> [!NOTE]
> The new language and page size apply on first use or after resetting UI preferences. Saved browser and optional backend settings still take precedence and are preserved during upgrades.
> Existing users can select Simplified Chinese and 30 torrents per page directly in the UI settings.

## Screenshots

<details>
<summary>View desktop and mobile screenshots (light / dark)</summary>

- Desktop: light mode

<p>
  <img src="docs/screenshots/screenshot-desktop.webp" width="800" alt="Desktop interface (light mode)" />
</p>

- Desktop: dark mode

<p>
  <img src="docs/screenshots/screenshot-desktop-dark-mode.webp" width="800" alt="Desktop interface (dark mode)" />
</p>

- Mobile: light mode

<p>
  <img src="docs/screenshots/screenshot-mobile.webp" width="400" alt="Mobile dashboard (light mode)" />
  <img src="docs/screenshots/screenshot-mobile-navbar.webp" width="400" alt="Mobile navbar (light mode)" />
</p>

- Mobile: dark mode

<p>
  <img src="docs/screenshots/screenshot-mobile-dark-mode.webp" width="400" alt="Mobile dashboard (dark mode)" />
  <img src="docs/screenshots/screenshot-mobile-navbar-dark-mode.webp" width="400" alt="Mobile navbar (dark mode)" />
</p>

</details>

## Local Demo

Run this project's demo with mocked data, without connecting to qBittorrent. In the cloned project directory, run:

```bash
npm ci
npm run build-demo
npm run preview-demo
```

Open the preview URL printed in the terminal.

> [!NOTE]
> Demo mode uses mocked data. It does not connect to a real qBittorrent instance, download torrents, or change a real downloader's settings.

## Installation

### Using a Release Archive

Download an available build from [this project's Releases page](https://github.com/xchenya/VueTorrent/releases). If no release archive is available yet, build from source as described below.

Extract the archive and place the entire `vuetorrent` directory somewhere qBittorrent can access. In qBittorrent Settings → WebUI, enable “Use alternative Web UI” and set the files location to the absolute path of that directory.

The selected directory should contain `public/` and `version.txt`: select `vuetorrent`, not its `public` subdirectory. For a container deployment, use a path accessible inside the container.

### Building from Source

Use Node.js and npm versions compatible with the project dependencies. See [package.json](package.json) for the declared npm version and [AGENTS.md](AGENTS.md) for development conventions.

```bash
git clone https://github.com/xchenya/VueTorrent.git
cd VueTorrent
npm ci
npm run build
```

Deploy the generated `vuetorrent/` directory as described above.

## Development

1. Clone this repository and enter the project directory.
2. Run `npm ci` to install the locked dependencies.
3. On first setup, copy `.env.sample` to `.env`; preserve any existing configuration.
4. Run `npm start` and open the development URL printed in the terminal. The default port is `3000`.

For UI development, enable mocked data in `.env`:

```dotenv
VITE_USE_MOCK_PROVIDER=true
VITE_FAKE_TORRENTS_COUNT=5
```

To connect to a real test downloader, use:

```dotenv
VITE_USE_MOCK_PROVIDER=false
VITE_QBITTORRENT_TARGET=http://localhost:8080
```

- Log in with the credentials for that qBittorrent instance. For a newly created container, consult its startup logs for initial login information.
- If Host header validation blocks the development proxy, adjust the corresponding setting only on the test instance.
- Optional: run `docker compose up -d` to start the repository's qBittorrent test container, after checking that ports `8080` and `6881` are available.

Common validation commands:

```bash
npm run lint
npm run lint:fix
npm test
npm run build
```

`lint:fix` modifies files. See [AGENTS.md](AGENTS.md) for the directory map, API conventions, and validation requirements.

## Features

- **Torrent management**: add, remove, pause, resume, and rename torrents; select files to download; inspect torrent information, trackers, peers, content, tags, and categories; search for torrents directly from the WebUI.
- **System information**: view download/upload speeds, session download/upload totals, free space, transfer graphs, and commonly used settings.
- **Mobile and PWA support**: a mobile-friendly interface that can be installed as a progressive web app.
- **Customizable dashboard**: choose which properties are shown for active and completed torrents.
- **Version support**: ongoing optimization for newer qBittorrent versions.
- **Optional backend**: [vuetorrent-backend](https://github.com/VueTorrent/vuetorrent-backend) is a separate external project that can store settings on the server. It is optional and is not required to use VueTorrent.
- **Enhanced Edition support**: supports relevant preferences from [qBittorrent Enhanced Edition](https://github.com/c0re100/qBittorrent-Enhanced-Edition).

### Keyboard Shortcuts

Mac key bindings are supported: use <kbd>Cmd</kbd> instead of <kbd>Ctrl</kbd> in the table below.

| Action | Shortcut |
| --- | --- |
| Dismiss a dialog or return to the dashboard | <kbd>Escape</kbd> |
| Select all torrents on the dashboard | <kbd>Ctrl</kbd> + <kbd>A</kbd> |
| Focus torrent search; press again for browser search | <kbd>Ctrl</kbd> + <kbd>F</kbd> |
| With no dialog open, unfocus search; press again to clear selection | <kbd>Escape</kbd> |
| Delete selected torrents | <kbd>Delete</kbd>; on Mac, <kbd>Fn</kbd> + <kbd>Backspace</kbd> |
| Enable multi-select | Hold <kbd>Ctrl</kbd> and click a torrent card |
| Select all torrents between the previous selection and the clicked item | Hold <kbd>Shift</kbd> and click a torrent card |

## Important Information

VueTorrent is a **WebUI** that uses qBittorrent's WebAPI: a visual interface for the downloader. It does not replace the qBittorrent engine or change how automation tools such as the *arr stack interact with the qBittorrent API.

## Contributing

Bug fixes, feature improvements, documentation, and localization changes for this fork are welcome.

- Create a working branch from this project's `master` branch and submit your PR to [xchenya/VueTorrent](https://github.com/xchenya/VueTorrent/pulls).
- Explain the reason for the change, its scope, reproduction steps, and validation results in the PR.
- Follow the development conventions in [AGENTS.md](AGENTS.md) and the [Code of Conduct](.github/CODE_OF_CONDUCT.md).
- Keep each PR focused on one goal, and run tests, builds, and lint checks appropriate to the change.

## Help and Feedback

- [Project repository](https://github.com/xchenya/VueTorrent)
- [Installation](#installation)
- [Development](#development)
- [Project Pull Requests](https://github.com/xchenya/VueTorrent/pulls)

Issues and Discussions are currently disabled for this fork. Start with the README, [development conventions](AGENTS.md), and existing PRs; submit code or documentation improvements to this repository.

## Funding

Donations are entirely optional. The repository's existing [funding configuration](.github/FUNDING.yml) is inherited from the original project and supports its maintainers.

## Acknowledgments and License

Thanks to the original maintainers and all contributors, including:

- [@m4ximuel](https://github.com/m4ximuel)
- [@Larsluph](https://github.com/Larsluph)

This fork is maintained by [@xchenya](https://github.com/xchenya) and continues to use the [GPL-3.0 license](LICENSE).
