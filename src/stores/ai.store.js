import { defineStore } from 'pinia'

export const useAiStore = defineStore('ai', {
  state: () => ({
    aiLoading: false,
    titleMess:'',
    isAiRequest:false,
    refreshSidebarTrigger: 0,
    formChat: {
      message: '',
      userId: null,
      conversationId: null,
      topKQa: 10,
      topKText: 10
    }
  }),
        
  persist: {storage: sessionStorage},
})