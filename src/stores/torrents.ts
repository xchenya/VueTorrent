import { useArrayFilter, useSorted, whenever } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, MaybeRefOrGetter, ref, shallowRef, toValue, triggerRef } from 'vue'
import { useAppStore } from './app'
import { useTorrentDetailStore } from './torrentDetail'
import { useTrackerStore } from './trackers'
import { useSearchQuery, useTorrentBuilder } from '@/composables'
import { createTorrentFilterDefaults } from '@/config/defaults'
import { comparatorMap, FilterType, TorrentState, TrackerSpecialFilter } from '@/constants/vuetorrent'
import qbit from '@/services/qbit'
import { RawQbitTorrent } from '@/types/qbit/models'
import { AddTorrentPayload } from '@/types/qbit/payloads'
import { Torrent as VtTorrent } from '@/types/vuetorrent'

export const useTorrentStore = defineStore(
  'torrents',
  () => {
    const defaults = createTorrentFilterDefaults()
    const torrentStateNotAnnounced = [
      TorrentState.UNKNOWN,
      TorrentState.ERROR,
      TorrentState.MISSING_FILES,
      TorrentState.DL_STOPPED,
      TorrentState.UL_STOPPED,
      TorrentState.UL_QUEUED,
      TorrentState.DL_QUEUED,
      TorrentState.CHECKING_DISK,
      TorrentState.CHECKING_RESUME_DATA,
      TorrentState.MOVING,
    ]

    const appStore = useAppStore()
    const { buildFromQbit } = useTorrentBuilder()
    const trackerStore = useTrackerStore()

    const _torrents = shallowRef<Map<string, RawQbitTorrent>>(new Map())
    const torrents = computed(() =>
      Array.from(_torrents.value.entries()).map(([hash, v]) =>
        buildFromQbit({
          ...v,
          hash,
        })
      )
    )

    const filterType = ref(defaults.filterType)

    const isTextFilterActive = shallowRef(defaults.isTextFilterActive)
    const textFilter = ref(defaults.textFilter)
    whenever(
      () => textFilter.value.length === 0,
      () => (isTextFilterActive.value = true)
    )

    const isStatusFilterActive = shallowRef(defaults.isStatusFilterActive)
    const statusFilter = ref(defaults.statusFilter)
    const torrentsByStatus = computed(() =>
      torrents.value.reduce(
        (acc, torrent) => {
          if (!acc[torrent.state]) {
            acc[torrent.state] = 0
          }
          acc[torrent.state] += 1
          return acc
        },
        {} as Record<TorrentState, number>
      )
    )
    whenever(
      () => statusFilter.value.length === 0,
      () => (isStatusFilterActive.value = true)
    )

    const isCategoryFilterActive = shallowRef(defaults.isCategoryFilterActive)
    const categoryFilter = ref(defaults.categoryFilter)
    whenever(
      () => categoryFilter.value.length === 0,
      () => (isCategoryFilterActive.value = true)
    )

    const isTagFilterActive = shallowRef(defaults.isTagFilterActive)
    const tagFilterInclude = ref(defaults.tagFilterInclude)
    const tagFilterExclude = ref(defaults.tagFilterExclude)
    const tagFilterType = ref(defaults.tagFilterType)
    whenever(
      () => tagFilterInclude.value.length + tagFilterExclude.value.length === 0,
      () => (isTagFilterActive.value = true)
    )

    const isTrackerFilterActive = shallowRef(defaults.isTrackerFilterActive)
    const trackerFilterInclude = ref(defaults.trackerFilterInclude)
    const trackerFilterExclude = ref(defaults.trackerFilterExclude)
    const trackerFilterType = ref(defaults.trackerFilterType)
    const torrentsByTracker = computed(() =>
      torrents.value.reduce(
        (acc, torrent) => {
          const trackers = trackerStore.torrentHostnameTrackers.get(torrent.hash) ?? []
          if (trackers.length === 0) {
            acc[TrackerSpecialFilter.UNTRACKED] = (acc[TrackerSpecialFilter.UNTRACKED] ?? 0) + 1
            return acc
          }

          if (torrent.tracker === '' && !torrentStateNotAnnounced.includes(torrent.state)) {
            acc[TrackerSpecialFilter.NOT_WORKING] = (acc[TrackerSpecialFilter.NOT_WORKING] ?? 0) + 1
          }

          trackers.forEach(tracker => {
            if (!acc[tracker]) {
              acc[tracker] = 0
            }
            acc[tracker] += 1
          })
          return acc
        },
        {} as Record<string | TrackerSpecialFilter, number>
      )
    )
    whenever(
      () => trackerFilterInclude.value.length + trackerFilterExclude.value.length === 0,
      () => (isTrackerFilterActive.value = true)
    )

    const sortCriterias = ref(defaults.sortCriterias)

    function matchStatus(t: VtTorrent): boolean {
      return statusFilter.value.includes(t.state)
    }
    function matchCategory(t: VtTorrent): boolean {
      return categoryFilter.value.includes(t.category)
    }
    function matchTag(t: VtTorrent): boolean {
      function matcher(tag: string | null) {
        if (tag === null) {
          return t.tags.length === 0
        }
        return t.tags.includes(tag)
      }

      switch (tagFilterType.value) {
        case FilterType.CONJUNCTIVE:
          return Array.from(tagFilterInclude.value).every(matcher) && Array.from(tagFilterExclude.value).every(t => !matcher(t))
        case FilterType.DISJUNCTIVE:
          return Array.from(tagFilterInclude.value).some(matcher) || Array.from(tagFilterExclude.value).some(t => !matcher(t))
      }
    }
    function matchTracker(t: VtTorrent) {
      const torrentTrackers = trackerStore.torrentHostnameTrackers.get(t.hash) ?? []

      function matcher(tracker: string | TrackerSpecialFilter) {
        switch (tracker) {
          case TrackerSpecialFilter.UNTRACKED:
            return torrentTrackers.length === 0
          case TrackerSpecialFilter.NOT_WORKING:
            return torrentTrackers.length > 0 && t.tracker === '' && !torrentStateNotAnnounced.includes(t.state)
          default:
            return torrentTrackers.includes(tracker)
        }
      }

      switch (trackerFilterType.value) {
        case FilterType.CONJUNCTIVE:
          return Array.from(trackerFilterInclude.value).every(matcher) && Array.from(trackerFilterExclude.value).every(t => !matcher(t))
        case FilterType.DISJUNCTIVE:
          return Array.from(trackerFilterInclude.value).some(matcher) || Array.from(trackerFilterExclude.value).some(t => !matcher(t))
      }
    }

    const torrentsWithNavbarFilters = useArrayFilter(torrents, torrent => {
      const matchResults = []

      if (statusFilter.value.length > 0 && isStatusFilterActive.value) {
        matchResults.push(matchStatus(torrent))
      }
      if (categoryFilter.value.length > 0 && isCategoryFilterActive.value) {
        matchResults.push(matchCategory(torrent))
      }
      if (tagFilterInclude.value.length + tagFilterExclude.value.length > 0 && isTagFilterActive.value) {
        matchResults.push(matchTag(torrent))
      }
      if (trackerFilterInclude.value.length + trackerFilterExclude.value.length > 0 && isTrackerFilterActive.value) {
        matchResults.push(matchTracker(torrent))
      }

      if (matchResults.length === 0) {
        return true
      }

      switch (filterType.value) {
        case FilterType.CONJUNCTIVE:
          return matchResults.every(Boolean)
        case FilterType.DISJUNCTIVE:
          return matchResults.some(Boolean)
      }
    })

    const { results: filteredTorrents } = useSearchQuery(
      torrentsWithNavbarFilters,
      () => (isTextFilterActive.value ? textFilter.value : null),
      torrent => [torrent.name, torrent.hash, torrent.download_path, torrent.savePath]
    )

    const filteredAndSortedTorrents = useSorted(filteredTorrents, (a, b) => {
      let i = 0
      let compareResult = 0
      while (i < sortCriterias.value.length && compareResult === 0) {
        const { value, reverse } = sortCriterias.value.at(i++)!
        compareResult = comparatorMap[value](a, b, !reverse)
      }
      if (compareResult === 0) {
        compareResult = comparatorMap.hash(a, b, true)
      }
      return compareResult
    })

    function syncFromMaindata(fullUpdate: boolean, entries: [string, Partial<RawQbitTorrent>][], removed?: string[]) {
      if (fullUpdate) {
        _torrents.value = new Map(entries as [string, RawQbitTorrent][])
        return
      }

      for (const [hash, qbitTorrent] of entries) {
        const torrent = _torrents.value.get(hash)
        if (torrent) {
          _torrents.value.set(hash, { ...torrent, ...qbitTorrent })
        } else {
          _torrents.value.set(hash, qbitTorrent as RawQbitTorrent)
        }
      }

      removed?.forEach(t => _torrents.value.delete(t))
      triggerRef(_torrents)
    }

    async function setTorrentCategory(hashes: string[], category: string) {
      await qbit.setCategory(hashes, category)
    }

    async function addTorrentTags(hashes: string[], tags: string[]) {
      await qbit.addTorrentTag(hashes, tags)
    }

    async function removeTorrentTags(hashes: string[], tags: string[]) {
      await qbit.removeTorrentTag(hashes, tags)
    }

    async function removeTorrentAllTags(hashes: string[]) {
      await qbit.removeTorrentAllTags(hashes)
    }

    function getTorrentByHash(hash: string) {
      return torrents.value.find(t => t.hash === hash)
    }

    function getTorrentIndexByHash(hash: string) {
      return filteredAndSortedTorrents.value.findIndex(t => t.hash === hash)
    }

    async function deleteTorrents(hashes: string[], deleteWithFiles: boolean) {
      await qbit.deleteTorrents(hashes, deleteWithFiles)
    }

    async function moveTorrents(mode: 'dl' | 'save', hashes: string[], newPath: string) {
      switch (mode) {
        case 'dl':
          return await qbit.setTorrentDownloadPath(hashes, newPath)
        case 'save':
          return await qbit.setTorrentSavePath(hashes, newPath)
      }
    }

    async function addTorrents(torrents: File[], urls: string | string[], payload?: AddTorrentPayload) {
      const links = Array.isArray(urls) ? urls.join('\n') : urls
      return qbit.addTorrents(torrents, links, payload)
    }

    async function reannounceTorrents(hashes: MaybeRefOrGetter<string[]>) {
      await qbit.reannounceTorrents(toValue(hashes))
    }

    async function toggleSeqDl(hashes: MaybeRefOrGetter<string[]>) {
      await qbit.toggleSequentialDownload(toValue(hashes))
    }

    async function toggleFLPiecePrio(hashes: MaybeRefOrGetter<string[]>) {
      await qbit.toggleFirstLastPiecePriority(toValue(hashes))
    }

    async function toggleAutoTmm(hashes: MaybeRefOrGetter<string[]>, enable: MaybeRefOrGetter<boolean>) {
      await qbit.setAutoTMM(toValue(hashes), toValue(enable))
    }

    async function setSuperSeeding(hashes: MaybeRefOrGetter<string[]>, enable: MaybeRefOrGetter<boolean>) {
      await qbit.setSuperSeeding(toValue(hashes), toValue(enable))
    }

    async function renameTorrent(hash: string, newName: string) {
      await qbit.setTorrentName(hash, newName)
    }

    async function resumeTorrents(hashes: MaybeRefOrGetter<string[]>) {
      if (appStore.usesQbit5) {
        await qbit.startTorrents(toValue(hashes))
      } else {
        await qbit.resumeTorrents(toValue(hashes))
      }
    }

    async function resumeAllTorrents() {
      if (appStore.usesQbit5) {
        await qbit.startAllTorrents()
      } else {
        await qbit.resumeAllTorrents()
      }
    }

    async function forceStartTorrents(hashes: MaybeRefOrGetter<string[]>) {
      await qbit.forceStartTorrents(toValue(hashes))
    }

    async function pauseTorrents(hashes: MaybeRefOrGetter<string[]>) {
      if (appStore.usesQbit5) {
        await qbit.stopTorrents(toValue(hashes))
      } else {
        await qbit.pauseTorrents(toValue(hashes))
      }
    }

    async function pauseAllTorrents() {
      if (appStore.usesQbit5) {
        await qbit.stopAllTorrents()
      } else {
        await qbit.pauseAllTorrents()
      }
    }

    async function recheckTorrents(hashes: MaybeRefOrGetter<string[]>) {
      await qbit.recheckTorrents(toValue(hashes))
    }

    async function setTorrentPriority(hashes: string[], priority: 'increasePrio' | 'decreasePrio' | 'topPrio' | 'bottomPrio') {
      await qbit.setTorrentPriority(hashes, priority)
    }

    async function exportTorrent(hash: string) {
      return await qbit.exportTorrent(hash)
    }

    return {
      torrents,
      isTextFilterActive,
      isStatusFilterActive,
      isCategoryFilterActive,
      isTagFilterActive,
      isTrackerFilterActive,
      textFilter,
      statusFilter,
      categoryFilter,
      tagFilterInclude,
      tagFilterExclude,
      trackerFilterInclude,
      trackerFilterExclude,
      filterType,
      tagFilterType,
      trackerFilterType,
      torrentsByStatus,
      torrentsByTracker,
      sortCriterias,
      processedTorrents: filteredAndSortedTorrents,
      syncFromMaindata,
      setTorrentCategory,
      addTorrentTags,
      removeTorrentTags,
      removeTorrentAllTags,
      getTorrentByHash,
      getTorrentIndexByHash,
      deleteTorrents,
      moveTorrents,
      addTorrents,
      reannounceTorrents,
      toggleSeqDl,
      toggleFLPiecePrio,
      toggleAutoTmm,
      setSuperSeeding,
      renameTorrent,
      resumeTorrents,
      resumeAllTorrents,
      forceStartTorrents,
      pauseTorrents,
      pauseAllTorrents,
      recheckTorrents,
      setTorrentPriority,
      exportTorrent,
      $reset: () => {
        _torrents.value.clear()
        triggerRef(_torrents)
        const defaults = createTorrentFilterDefaults()
        filterType.value = defaults.filterType
        isTextFilterActive.value = defaults.isTextFilterActive
        textFilter.value = defaults.textFilter
        isStatusFilterActive.value = defaults.isStatusFilterActive
        statusFilter.value = defaults.statusFilter
        isCategoryFilterActive.value = defaults.isCategoryFilterActive
        categoryFilter.value = defaults.categoryFilter
        isTagFilterActive.value = defaults.isTagFilterActive
        tagFilterInclude.value = defaults.tagFilterInclude
        tagFilterExclude.value = defaults.tagFilterExclude
        tagFilterType.value = defaults.tagFilterType
        isTrackerFilterActive.value = defaults.isTrackerFilterActive
        trackerFilterInclude.value = defaults.trackerFilterInclude
        trackerFilterExclude.value = defaults.trackerFilterExclude
        trackerFilterType.value = defaults.trackerFilterType
        sortCriterias.value = defaults.sortCriterias
      },
    }
  },
  {
    persist: [{ storage: localStorage }],
  }
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTorrentDetailStore, import.meta.hot))
}
