import { DashboardDisplayMode } from '@/constants/vuetorrent/DashboardDisplayMode'
import { DashboardProperty } from '@/constants/vuetorrent/DashboardProperty'
import { FilterType } from '@/constants/vuetorrent/FilterType'
import { ThemeMode } from '@/constants/vuetorrent/ThemeMode'
import { TitleOptions } from '@/constants/vuetorrent/TitleOptions'
import { TorrentDetailTab } from '@/constants/vuetorrent/TorrentDetailTab'
import type { TorrentState } from '@/constants/vuetorrent/TorrentState'
import type { TrackerSpecialFilter } from '@/constants/vuetorrent/TrackerSpecialFilter'
import type { Locales } from '@/locales'
import type { SearchSortBy } from '@/types/vuetorrent/SearchData'
import type SidebarWidget from '@/types/vuetorrent/SidebarWidget'
import type Torrent from '@/types/vuetorrent/Torrent'

// 在此修改本 fork 的界面默认值，然后重新构建。
// 已保存的浏览器配置和可选后端配置仍优先，不在升级时覆盖用户设置。
// 仅从枚举叶子模块导入运行时值，避免通过 constants/index 引入 store 循环依赖。
export const localeDefaults: { language: `${Locales}`; fallbackLanguage: `${Locales}` } = {
  language: 'en', // 简体中文：zh-Hans；繁体中文：zh-Hant
  fallbackLanguage: 'en',
}

export const defaultDateFormat = 'YYYY-MM-DD HH:mm:ss'
export const defaultDurationFormat = 'Y[Y] M[M] D[d] H[h] m[m] s[s]'
export const defaultHistorySize = 3

// active 控制默认显示，order 必须保持为 1 到属性总数的连续、不重复序号。
export const torrentPropertyDefaults: Record<DashboardProperty, { active: boolean; order: number }> = {
  [DashboardProperty.ADDED_ON]: { active: true, order: 16 },
  [DashboardProperty.AMOUNT_LEFT]: { active: false, order: 20 },
  [DashboardProperty.AUTO_TMM]: { active: false, order: 53 },
  [DashboardProperty.AVAILABILITY]: { active: true, order: 17 },
  [DashboardProperty.AVG_DOWNLOAD_SPEED]: { active: false, order: 40 },
  [DashboardProperty.AVG_UPLOAD_SPEED]: { active: false, order: 41 },
  [DashboardProperty.BASENAME_CONTENT_PATH]: { active: false, order: 43 },
  [DashboardProperty.BASENAME_DOWNLOAD_PATH]: { active: false, order: 44 },
  [DashboardProperty.BASENAME_SAVE_PATH]: { active: false, order: 45 },
  [DashboardProperty.CATEGORY]: { active: true, order: 14 },
  [DashboardProperty.COMMENT]: { active: false, order: 47 },
  [DashboardProperty.COMPLETED_ON]: { active: false, order: 19 },
  [DashboardProperty.CONTENT_PATH]: { active: false, order: 21 },
  [DashboardProperty.DOWNLOAD_LIMIT]: { active: false, order: 23 },
  [DashboardProperty.DOWNLOAD_PATH]: { active: false, order: 24 },
  [DashboardProperty.DOWNLOAD_SPEED]: { active: true, order: 3 },
  [DashboardProperty.DOWNLOADED]: { active: true, order: 5 },
  [DashboardProperty.DOWNLOADED_SESSION]: { active: false, order: 22 },
  [DashboardProperty.ETA]: { active: true, order: 8 },
  [DashboardProperty.FIRST_LAST_PIECE_PRIORITY]: { active: false, order: 54 },
  [DashboardProperty.FORCED]: { active: false, order: 55 },
  [DashboardProperty.GLOBAL_SPEED]: { active: false, order: 34 },
  [DashboardProperty.GLOBAL_VOLUME]: { active: false, order: 35 },
  [DashboardProperty.HASH]: { active: false, order: 25 },
  [DashboardProperty.HAS_METADATA]: { active: false, order: 48 },
  [DashboardProperty.INACTIVE_SEEDING_TIME_LIMIT]: { active: false, order: 42 },
  [DashboardProperty.INFOHASH_V1]: { active: false, order: 26 },
  [DashboardProperty.INFOHASH_V2]: { active: false, order: 27 },
  [DashboardProperty.LAST_ACTIVITY]: { active: false, order: 18 },
  [DashboardProperty.MAGNET]: { active: false, order: 56 },
  [DashboardProperty.PEERS]: { active: true, order: 9 },
  [DashboardProperty.POPULARITY]: { active: false, order: 50 },
  [DashboardProperty.PRIORITY]: { active: false, order: 36 },
  [DashboardProperty.PRIVATE]: { active: false, order: 49 },
  [DashboardProperty.PROGRESS]: { active: true, order: 2 },
  [DashboardProperty.RATIO]: { active: true, order: 12 },
  [DashboardProperty.RATIO_LIMIT]: { active: false, order: 37 },
  [DashboardProperty.REANNOUNCE]: { active: false, order: 51 },
  [DashboardProperty.ROOT_PATH]: { active: false, order: 52 },
  [DashboardProperty.SAVE_PATH]: { active: false, order: 6 },
  [DashboardProperty.SEEDING_TIME]: { active: false, order: 38 },
  [DashboardProperty.SEEDING_TIME_LIMIT]: { active: false, order: 39 },
  [DashboardProperty.SEEDS]: { active: true, order: 10 },
  [DashboardProperty.SEEN_COMPLETE]: { active: false, order: 28 },
  [DashboardProperty.SEQUENTIAL_DOWNLOADS]: { active: false, order: 57 },
  [DashboardProperty.SIZE]: { active: true, order: 1 },
  [DashboardProperty.STATE]: { active: true, order: 11 },
  [DashboardProperty.SUPER_SEEDING]: { active: false, order: 58 },
  [DashboardProperty.TAGS]: { active: true, order: 15 },
  [DashboardProperty.TIME_ACTIVE]: { active: false, order: 29 },
  [DashboardProperty.TOTAL_SIZE]: { active: false, order: 30 },
  [DashboardProperty.TRACKER]: { active: false, order: 13 },
  [DashboardProperty.TRACKERS_COUNT]: { active: false, order: 31 },
  [DashboardProperty.TRUNCATED_HASH]: { active: false, order: 46 },
  [DashboardProperty.UPLOAD_LIMIT]: { active: false, order: 33 },
  [DashboardProperty.UPLOAD_SPEED]: { active: true, order: 4 },
  [DashboardProperty.UPLOADED]: { active: true, order: 7 },
  [DashboardProperty.UPLOADED_SESSION]: { active: false, order: 32 },
}

// 每次创建独立副本，防止用户调整一个视图后污染其他视图或重置值。
export function createTorrentPropertyDefaults(): Record<string, { active: boolean; order: number }> {
  return Object.fromEntries(Object.entries(torrentPropertyDefaults).map(([key, value]) => [key, { ...value }]))
}

export function createVueTorrentDefaults() {
  return {
    language: localeDefaults.language,
    theme: {
      mode: ThemeMode.SYSTEM, // LIGHT / DARK / SYSTEM
      light: 'light-legacy', // light-legacy / light-redesigned
      dark: 'dark-legacy', // dark-legacy / dark-redesigned / dark-oled
    },
    showSpeedInTitle: false,
    /** @deprecated Retained for compatibility with saved settings. */
    deleteWithFiles: false,
    uiTitleType: TitleOptions.DEFAULT,
    uiTitleCustom: '',
    hideChipIfUnset: false,
    enableRatioColors: true,
    enableHashColors: true,
    paginationSize: 15, // -1 表示无限滚动
    dateFormat: defaultDateFormat,
    durationFormat: defaultDurationFormat,
    isShutdownButtonVisible: false,
    useBitSpeed: false,
    expandContent: true,
    useBinarySize: false,
    refreshInterval: 2000, // 毫秒
    fileContentInterval: 5000, // 毫秒
    useIdForRssLinks: false,
    hideColoredChip: false,
    displayGraphLimits: true,
    useEmojiState: true,
    fetchExternalIpInfo: false,
    reduceMotion: false,
    enableRawValueTooltips: true,
    thousandSeparator: ' ',
    defaultTorrentDetailTab: TorrentDetailTab.LAST_OPENED,
    searchEngineSortBy: [] as SearchSortBy[],
    tableColumnWidths: {} as Record<string, Record<string, number>>,
    torrentSortFavourites: new Set<string>(),
    logoutUrl: '',
    _busyProperties: createTorrentPropertyDefaults(),
    _doneProperties: createTorrentPropertyDefaults(),
    _busyGridProperties: createTorrentPropertyDefaults(),
    _doneGridProperties: createTorrentPropertyDefaults(),
    _tableProperties: createTorrentPropertyDefaults(),
  }
}

export function createDashboardDefaults() {
  return {
    displayMode: DashboardDisplayMode.LIST, // LIST / GRID / TABLE
  }
}

export function createSidebarDefaults() {
  return {
    isDrawerRight: false,
    sidebarWidgets: [
      { name: 'CurrentSpeed', active: true },
      { name: 'SpeedGraph', active: true },
      { name: 'TransferStats', active: true },
      { name: 'FreeSpace', active: true },
      { name: 'PerformanceStats', active: true },
      { name: 'ConnectionStats', active: true },
      { name: 'Filters', active: true },
    ] as SidebarWidget[],
    filters: [
      { name: 'state', active: true },
      { name: 'category', active: true },
      { name: 'tag', active: true },
      { name: 'tracker', active: true },
    ] as { name: 'state' | 'category' | 'tag' | 'tracker'; active: boolean }[],
  }
}

export function createTorrentFilterDefaults() {
  return {
    filterType: FilterType.CONJUNCTIVE,
    isTextFilterActive: true,
    textFilter: '',
    isStatusFilterActive: true,
    statusFilter: [] as TorrentState[],
    isCategoryFilterActive: true,
    categoryFilter: [] as string[],
    isTagFilterActive: true,
    tagFilterInclude: [] as (string | null)[],
    tagFilterExclude: [] as (string | null)[],
    tagFilterType: FilterType.DISJUNCTIVE,
    isTrackerFilterActive: true,
    trackerFilterInclude: [] as (string | TrackerSpecialFilter)[],
    trackerFilterExclude: [] as (string | TrackerSpecialFilter)[],
    trackerFilterType: FilterType.DISJUNCTIVE,
    sortCriterias: [{ value: 'added_on', reverse: true }] as { value: keyof Torrent; reverse: boolean }[],
  }
}
