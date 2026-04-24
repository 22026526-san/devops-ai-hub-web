import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import DefaultLayout from '@/layout/DefaultLayout.vue'
import HomePage from '@/views/app/HomePage.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import HomeViewLayout from '@/layout/HomeViewLayout.vue'

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
  ],
})

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  console.log(`[Router] Đang cố gắng đi từ: ${from.path} ---> đến: ${to.path}`);

  try {
    if (to.path === '/login' && authStore.isAuthenticated) {
      console.log('Người dùng đã đăng nhập, bị đẩy về Home.')
      return '/home'
    }

    if (!to.meta.public && !authStore.isAuthenticated) {
      console.log('Người dùng chưa đăng nhập, bị đẩy về Login.')
      return '/login'
    }

    if (authStore.isAuthenticated && !authStore.user) {
      console.log('1. Đang gọi API lấy thông tin User...'); 
      
      const result = await authStore.fetchMyInfo()
      console.log('2. Kết quả trả về từ API:', result); 

      if (!result?.success) {
        console. log('3. Lỗi lấy User! Bị đẩy về Login.');
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
