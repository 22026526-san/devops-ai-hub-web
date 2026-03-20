import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import DefaultLayout from '@/layout/DefaultLayout.vue'
import HomePage from '@/views/app/HomePage.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
    path: '/',
    redirect: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { 
        public: true ,
        layout: null
      },
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { 
        public: true ,
        layout: null
      },
    },
    {
      path: '/home',
      name: 'home',
      component: HomePage,
      meta: { 
        public: true ,
        layout: DefaultLayout
      },
    },
  ],
})

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()

  try {
    if (to.path === '/login' && authStore.isAuthenticated) {
      return '/home'
    }

    if (!to.meta.public && !authStore.isAuthenticated) {
      return '/login'
    }

    if (authStore.isAuthenticated && !authStore.user) {
      const result = await authStore.fetchMyInfo()

      if (!result?.success) {
        authStore.clearAuth()
        return '/login'
      }
    }

    return true
  } catch (error) {
    console.error('beforeEach error:', error)
    authStore.clearAuth()
    return '/login'
  }
})

export default router
