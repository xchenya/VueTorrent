import { acceptHMRUpdate, defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import { createSidebarDefaults } from '@/config/defaults'

export const useSidebarStore = defineStore(
  'sidebar',
  () => {
    const settings = reactive(createSidebarDefaults())
    const { sidebarWidgets, isDrawerRight, filters } = toRefs(settings)

    function toggleWidget(name: string) {
      const widget = sidebarWidgets.value.find(w => w.name === name)
      if (widget) {
        widget.active = !widget.active
      }
    }

    function setAllWidgets(active: boolean) {
      sidebarWidgets.value = sidebarWidgets.value.map(widget => ({ ...widget, active }))
    }

    function toggleFilter(name: string) {
      const widget = filters.value.find(w => w.name === name)
      if (widget) {
        widget.active = !widget.active
      }
    }

    function setAllFilters(active: boolean) {
      filters.value = filters.value.map(filter => ({ ...filter, active }))
    }

    return {
      sidebarWidgets,
      toggleWidget,
      setAllWidgets,
      toggleFilter,
      setAllFilters,
      isDrawerRight,
      filters,
      $reset: () => {
        Object.assign(settings, createSidebarDefaults())
      },
    }
  },
  {
    persist: [{ storage: localStorage, key: 'sidebarSettings' }],
  }
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSidebarStore, import.meta.hot))
}
