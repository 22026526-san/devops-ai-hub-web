import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import DefaultLayout from '@/layout/DefaultLayout.vue'
import HomePage from '@/views/app/HomePage.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import HomeViewLayout from '@/layout/HomeViewLayout.vue'
import SearchPage from '@/views/app/SearchPage.vue'
import ProfileLayout from '@/layout/ProfileLayout.vue'
import ProfilePage from '@/views/app/ProfilePage.vue'
import { useAppStore } from '@/stores/app.store'

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
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPassword,
      meta: { 
        public: true ,
        layout: null
      },  
  
    },
    {
      path: '/home/:id?',
      name: 'home',
      component: HomePage,
      meta: { 
        public: true ,
        layout: HomeViewLayout
      },
    },
    {
      path: '/search/:text?',
      name: 'search',
      component: SearchPage,
      meta: { 
        public: true ,
        layout: HomeViewLayout
      },
    },
    {
      path: '/ai-agent',
      name: 'ai-agent',
      component: HomePage,
      meta: { 
        public: true ,
        layout: DefaultLayout
      },
    },
    {
      path: '/explore',
      name: 'explore',
      component: HomePage,
      meta: { 
        public: true ,
        layout: DefaultLayout
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage,
      meta: { 
        public: true ,
        layout: ProfileLayout
      },
    },
  ],
})

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  const appStore = useAppStore()

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

    if (to.path === '/home') {
      appStore.setTopicSelected(1)
      appStore.resetFilters()
    }

    return true
  } catch (error) {
    authStore.clearAuth()
    return '/login'
  }
})

export default router
