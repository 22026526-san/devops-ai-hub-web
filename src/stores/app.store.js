// src/stores/app.store.js
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    appLoading: false,
    settingMenu: false,
    idProfile : 1,
    isFetchProfile:false,
    selectedTopic:1,
    fillTitle:'',
    filters: {
      Search: null,
      TagIds: null,
      FilterUserId: null,
      CurrentUserId: null,
      Year: null,
      Month: null,
      Day: null,
      SortBy: null,
      Page : 1,
      PageSize : 20,
    }
  }),

  actions: {

    syncUrlToState(query, path) {
      if (path !== '/profile') {
        this.filters.FilterUserId =null
      }
      if (query.tagId) {
        this.setTopicSelected(query.tagId)
      } else {
        this.setTopicSelected(1)
      }

      this.filters.Search = query.text ? query.text : null;
    
      this.filters.SortBy = query.sort ? query.sort :  null; 

      this.filters.Year = query.year ? query.year: null;
      this.filters.Month = query.month ? query.month : null;
      this.filters.Day = query.day ? query.day : null;
    },
    setAppLoading(value) {
      this.appLoading = value
    },

    setSettingMenu(value) {
      this.settingMenu = value
    },

    setTopicSelected(topic) {
      this.selectedTopic = topic
      if (topic === 1) {
        this.filters.TagIds = null;
      } else {
        this.filters.TagIds = topic
      }
    },
    setPage(pageNumber) {
      this.Page = pageNumber
    },

    setPageSize(size) {
      this.PageSize = size
    },

    nextPage() {
      this.filters.Page += 1
    },
    prevPage(){
      if (this.filters.Page > 0) {
        this.filters.Page -= 1
      }
    },
    resetFilters() {
      this.filters = {
        Search: null,
        TagIds: null,
        FilterUserId: null,
        CurrentUserId: null,
        Year: null,
        Month: null,
        Day: null,
        SortBy: null,
        Page : 1,
        PageSize : 20,
      }
    }
  },
  persist: {storage: sessionStorage},
})