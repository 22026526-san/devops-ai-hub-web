// src/stores/app.store.js
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    appLoading: false,
    settingMenu: false,
    pageTitle: 'DevOps AI Hub',
    topicSelected: 1,
    page : 1,
    pageSize : 20,
  }),

  actions: {
    setAppLoading(value) {
      this.appLoading = value
    },

    setSettingMenu(value) {
      this.settingMenu = value
    },

    setPageTitle(title) {
      this.pageTitle = title || 'DevOps AI Hub'
      document.title = this.pageTitle
    },

    setTopicSelected(topic) {
      this.topicSelected = topic
    }
  },
})