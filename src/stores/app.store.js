// src/stores/app.store.js
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    appLoading: false,
    pageTitle: 'DevOps AI Hub',
  }),

  actions: {
    setAppLoading(value) {
      this.appLoading = value
    },

    setPageTitle(title) {
      this.pageTitle = title || 'DevOps AI Hub'
      document.title = this.pageTitle
    },
  },
})