import { mount } from '@vue/test-utils'
import { createPinia, disposePinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { useDashboardStore } from './dashboard'
import { useHistoryStore } from './history'
import { useSidebarStore } from './sidebar'
import { useTorrentStore } from './torrents'
import { useVueTorrentStore } from './vuetorrent'
import * as defaults from '@/config/defaults'
import { DashboardDisplayMode } from '@/constants/vuetorrent/DashboardDisplayMode'
import { DashboardProperty } from '@/constants/vuetorrent/DashboardProperty'
import { FilterType } from '@/constants/vuetorrent/FilterType'
import { HistoryKey } from '@/constants/vuetorrent/HistoryKey'
import { ThemeMode } from '@/constants/vuetorrent/ThemeMode'
import { jsonSerialize } from '@/helpers/json'
import { defaultLocale, fallbackLocale } from '@/locales'
import i18n from '@/plugins/i18n'
import vuetify from '@/plugins/vuetify'

// These tests exercise actual stores and persistence, without a downloader.
vi.mock('@/services/qbit', () => ({ default: {} }))

const cleanups: (() => void)[] = []

function mountSettings() {
  const pinia = createPinia()
  pinia.use(createPersistedState({ auto: false, key: storeKey => `vuetorrent_${storeKey}`, debug: true }))
  let stores!: {
    ui: ReturnType<typeof useVueTorrentStore>
    dashboard: ReturnType<typeof useDashboardStore>
    sidebar: ReturnType<typeof useSidebarStore>
    torrents: ReturnType<typeof useTorrentStore>
    history: ReturnType<typeof useHistoryStore>
  }
  const wrapper = mount(
    defineComponent({
      setup() {
        stores = {
          ui: useVueTorrentStore(),
          dashboard: useDashboardStore(),
          sidebar: useSidebarStore(),
          torrents: useTorrentStore(),
          history: useHistoryStore(),
        }
        return () => null
      },
    }),
    { global: { plugins: [pinia, i18n, vuetify] } }
  )
  cleanups.push(() => {
    wrapper.unmount()
    disposePinia(pinia)
  })
  return stores
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

afterEach(() => {
  cleanups.splice(0).forEach(cleanup => cleanup())
  vi.restoreAllMocks()
})

describe('centralized settings defaults', () => {
  it('uses the same configuration for new stores and reset, including customized defaults', () => {
    const createUiDefaults = defaults.createVueTorrentDefaults
    vi.spyOn(defaults, 'createVueTorrentDefaults').mockImplementation(() => ({
      ...createUiDefaults(),
      paginationSize: 73,
      refreshInterval: 4321,
      theme: { mode: ThemeMode.DARK, light: 'light-redesigned', dark: 'dark-oled' },
    }))
    vi.spyOn(defaults, 'createDashboardDefaults').mockReturnValue({ displayMode: DashboardDisplayMode.TABLE })
    const stores = mountSettings()
    const initialUi = jsonSerialize(stores.ui.$state)
    const theme = stores.ui.theme

    expect(stores.ui.paginationSize).toBe(73)
    expect(stores.ui.refreshInterval).toBe(4321)
    expect(stores.dashboard.displayMode).toBe(DashboardDisplayMode.TABLE)
    stores.ui.paginationSize = -1
    stores.ui.theme.mode = ThemeMode.LIGHT
    stores.ui.reduceMotion = true
    stores.ui.toggleTorrentSortFavourite('size')
    stores.ui.setTableColumnWidth('dashboard', 'name', 200)
    stores.ui.searchEngineSortBy.push({ key: 'name', order: 'asc' })
    stores.ui.toggleBusyProperty(DashboardProperty.SIZE)
    stores.dashboard.displayMode = DashboardDisplayMode.GRID

    stores.ui.$reset()
    stores.dashboard.$reset()

    expect(jsonSerialize(stores.ui.$state)).toBe(initialUi)
    expect(stores.ui.theme).toBe(theme)
    expect(stores.ui.keepDefaultTransitions).toBe(true)
    expect(stores.ui.isInfiniteScrollActive).toBe(false)
    expect(stores.dashboard.displayMode).toBe(DashboardDisplayMode.TABLE)
  })

  it('keeps mutable defaults isolated across layouts, resets, and store instances', () => {
    const first = mountSettings()
    const initialProperties = defaults.createTorrentPropertyDefaults()
    const oldProperties = first.ui._busyProperties
    const oldWidths = first.ui.tableColumnWidths
    const oldFavourites = first.ui.torrentSortFavourites

    first.ui.toggleBusyProperty(DashboardProperty.SIZE)
    first.ui.setTableColumnWidth('dashboard', 'name', 200)
    first.ui.toggleTorrentSortFavourite('size')
    first.sidebar.toggleWidget('SpeedGraph')
    first.sidebar.toggleFilter('tracker')
    first.torrents.sortCriterias[0].reverse = false

    expect(first.ui._doneProperties).toEqual(initialProperties)
    expect(first.ui._busyGridProperties).toEqual(initialProperties)
    expect(first.ui._doneGridProperties).toEqual(initialProperties)
    expect(first.ui._tableProperties).toEqual(initialProperties)
    expect(defaults.torrentPropertyDefaults).toEqual(initialProperties)

    first.ui.$reset()
    first.sidebar.$reset()
    first.torrents.$reset()
    oldProperties[DashboardProperty.SIZE].order = 999
    oldWidths.dashboard.name = 999
    oldFavourites.add('ratio')

    expect(first.ui._busyProperties).toEqual(initialProperties)
    expect(first.ui.tableColumnWidths).toEqual({})
    expect(first.ui.torrentSortFavourites.size).toBe(0)
    expect(first.sidebar.$state).toEqual(defaults.createSidebarDefaults())
    expect(first.torrents.sortCriterias).toEqual(defaults.createTorrentFilterDefaults().sortCriterias)

    localStorage.clear()
    const second = mountSettings()
    expect(second.ui.$state).toEqual(defaults.createVueTorrentDefaults())
    expect(second.sidebar.$state).toEqual(defaults.createSidebarDefaults())
  })

  it('preserves existing storage keys, saved overrides, and Set serialization', async () => {
    localStorage.setItem(
      'vuetorrent_webuiSettings',
      jsonSerialize({
        language: 'en',
        paginationSize: 42,
        theme: { mode: ThemeMode.DARK, light: 'light-redesigned', dark: 'dark-oled' },
        torrentSortFavourites: new Set(['size']),
        tableColumnWidths: { dashboard: { name: 180 } },
      })
    )
    localStorage.setItem('vuetorrent_dashboard', JSON.stringify({ displayMode: DashboardDisplayMode.TABLE }))
    localStorage.setItem('vuetorrent_sidebarSettings', JSON.stringify({ isDrawerRight: true }))
    localStorage.setItem('vuetorrent_torrents', JSON.stringify({ filterType: FilterType.DISJUNCTIVE, sortCriterias: [{ value: 'name', reverse: false }] }))
    const first = mountSettings()

    expect(first.ui.language).toBe('en')
    expect(first.ui.paginationSize).toBe(42)
    expect(first.ui.theme.dark).toBe('dark-oled')
    expect(first.ui.fileContentInterval).toBe(defaults.createVueTorrentDefaults().fileContentInterval)
    expect(first.ui.torrentSortFavourites).toEqual(new Set(['size']))
    expect(first.dashboard.displayMode).toBe(DashboardDisplayMode.TABLE)
    expect(first.sidebar.isDrawerRight).toBe(true)
    expect(first.torrents.filterType).toBe(FilterType.DISJUNCTIVE)

    first.ui.paginationSize = 50
    first.ui.toggleTorrentSortFavourite('ratio')
    await nextTick()
    const second = mountSettings()
    expect(second.ui.paginationSize).toBe(50)
    expect(second.ui.torrentSortFavourites).toEqual(new Set(['size', 'ratio']))
    expect(second.ui.tableColumnWidths).toEqual({ dashboard: { name: 180 } })
    expect(second.torrents.sortCriterias).toEqual([{ value: 'name', reverse: false }])
  })

  it('keeps backend-style patches reactive and resets every filter preference', async () => {
    const { ui, sidebar, torrents } = mountSettings()
    ui.$patch({ paginationSize: -1, reduceMotion: true, theme: { mode: ThemeMode.DARK } })
    sidebar.$patch({ isDrawerRight: true, filters: [{ name: 'tag', active: false }] })
    torrents.$patch({ textFilter: 'example', categoryFilter: ['test'], tagFilterInclude: ['test'], sortCriterias: [{ value: 'name', reverse: false }] })
    await nextTick()
    expect(ui.isInfiniteScrollActive).toBe(true)
    expect(ui.keepDefaultTransitions).toBe(false)
    expect(ui.theme.mode).toBe(ThemeMode.DARK)
    expect(sidebar.filters).toEqual([{ name: 'tag', active: false }])

    ui.$reset()
    sidebar.$reset()
    torrents.$reset()
    await nextTick()
    expect(ui.$state).toEqual(defaults.createVueTorrentDefaults())
    expect(sidebar.$state).toEqual(defaults.createSidebarDefaults())
    expect(torrents.$state).toEqual(defaults.createTorrentFilterDefaults())
  })

  it('uses configured locales and history size while preserving clear-history behavior', () => {
    const { ui, history } = mountSettings()
    expect(ui.language).toBe(defaultLocale)
    expect(defaultLocale).toBe(defaults.localeDefaults.language)
    expect(fallbackLocale).toBe(defaults.localeDefaults.fallbackLanguage)
    expect(history.historySize).toBe(defaults.defaultHistorySize)
    history.historySize = 7
    const key = Object.values(HistoryKey)[0]
    history.pushValueToHistory(key, 'example')
    history.$reset()
    expect(history.getHistory(key)).toEqual([])
    expect(history.historySize).toBe(7)
  })
})
