// src/stores/auth.store.js
import { defineStore } from 'pinia'
import { loginApi } from '@/api/modules/auth.api'
import { getMyInfoApi } from '@/api/modules/user.api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('access_token') || '',
    user: null,
    authLoading: false,
    role: 'Guest',
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    userStatus: (state) => state.user?.role || '',
  },

  actions: {
    setAccessToken(token) {
      this.accessToken = token || ''

      if (token) {
        localStorage.setItem('access_token', token)
      } else {
        localStorage.removeItem('access_token')
      }
    },

    setUser(user) {
      this.user = user
    },

    setRole (role) {
      this.role = role || 'Guest'
    },

    clearAuth() {
      this.accessToken = ''
      this.user = null
      this.authLoading = false
      this.role = 'Guest'

      localStorage.removeItem('access_token')
    },

    async login(payload) {
      try {
        this.authLoading = true

        const response = await loginApi(payload)
        const data = response?.data 

        const accessToken = data?.token
          
        if (!accessToken) {
          throw new Error('Token không tồn tại trong response')
        }

        this.setAccessToken(accessToken)
        this.setRole(data?.role)

        const profileResult = await this.fetchMyInfo()

        if (!profileResult.success) {
          throw new Error(profileResult.message)
        }

        return {
          success: true,
        }
      } catch (error) {
        this.clearAuth()
        return {
          success: false,
          message:
            error?.response?.data?.message ||
            error?.message ||
            'Đăng nhập thất bại',
        }
      } finally {
        this.authLoading = false
      }
    },

    async fetchMyInfo() {
      try {
        const response = await getMyInfoApi()
        const user = response?.data

        this.setUser(user)

        return {
          success: true,
          data: user,
        }
      } catch (error) {
        return {
          success: false,
          message:
            error?.response?.data?.message ||
            'Không lấy được thông tin người dùng',
        }
      }
    },

    logout() {
      this.clearAuth()
      window.location.href = '/login'
    },
  },
})