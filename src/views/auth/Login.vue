<template>
  <div class="layout-wrapper">
    <!-- Header -->
    <header class="header">
      <div class="logo-area">
        <img src="@/assets/img/logo_devops_hub.png" alt="DevOps Connect Logo" class="logo-icon" />
        <span class="logo-text">DevOps Connect</span>
      </div>
      <div class="header-right">
        <span class="text-muted">Chưa có tài khoản?</span>
        <a href="/register" class="link-primary font-medium">Đăng ký ngay</a>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="login-card">
        
        <!-- Left Column: Form -->
        <div class="form-column">
          <h1 class="title">Chào mừng trở lại</h1>
          <p class="subtitle">Đăng nhập để kết nối với cộng đồng DevOps toàn cầu</p>

          <form class="form" @submit.prevent="handleLogin">
        
            <BaseInput
              v-model="form.emailOrUsername"
              label="Email/Username"
              type="text"
              placeholder="name@company.com hoặc username"
              icon="icon-email"
            />

            <BaseInput
              v-model="form.password"
              label="Mật khẩu"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Nhập mật khẩu của bạn"
              icon="icon-password"
            />

            <!-- Options -->
            <div class="options-row">
              <label class="checkbox-label">
                <input type="checkbox" v-model="showPassword" />
                <span>Hiển thị mật khẩu</span>
              </label>
              <a href="/forgot-password" class="link-primary text-sm">Quên mật khẩu?</a>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn-submit">Đăng nhập</button>

            <!-- Divider -->
            <div class="divider">
              <span>Hoặc đăng nhập bằng</span>
            </div>

            <!-- Social Logins -->
            <div class="social-row">
              <button type="button" class="btn-social">
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button type="button" class="btn-social">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"></path></svg>
                GitHub
              </button>
            </div>
          </form>
        </div>

        <!-- Right Column: Promo -->
        <div class="promo-column">
          <div class="promo-image-wrapper">
            <!-- Thay bằng ảnh thật của bạn -->
            <img src="@/assets/img/devops_hub.png" alt="DevOps Engineer" class="promo-image" />
          </div>
          <h2 class="promo-title">Mạng xã hội cho các kỹ sư DevOps</h2>
          <p class="promo-desc">Chia sẻ kiến thức, thảo luận về CI/CD, Kubernetes, Cloud Native và xây dựng sự nghiệp của bạn.</p>
          
          <div class="avatar-group-wrapper">
            <span class="avatar-text">+ 5k người đã tham gia tuần này</span>
          </div>
        </div>

      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>© 2024 DevOps Connect. Toàn bộ bản quyền được bảo lưu.</p>
      <div class="footer-links">
        <a href="#">Điều khoản</a>
        <a href="#">Bảo mật</a>
        <a href="#">Trợ giúp</a>
      </div>
    </footer>
  </div>
  <ToastMessage
    v-model="toastVisible"
    :text="toastText"
    :is-success="!isError"
    :is-error="isError"
    ></ToastMessage>
  <LoadingPage v-if="authStore.authLoading"/>
</template>

<script setup>
import BaseInput from '@/components/base/BaseInput.vue'
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import ToastMessage from '@/components/ToastMessage.vue'
import LoadingPage from '@/components/LoadingPage.vue'

const showPassword = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const toastVisible = ref(false)
const toastText = ref('')
const isError = ref(false)

const form = reactive({
  emailOrUsername: '',
  password: '',
})

const handleLogin = async () => {
  
  const result = await authStore.login(form)

  if (result.success) {
    toastText.value = 'Đăng nhập thành công.'
    toastVisible.value = true
    isError.value = false
    setTimeout(() => {
      router.push('/home')
    }, 2000)
  } else {
    isError.value = true
    toastText.value = result.message
    toastVisible.value = true
  }
}
</script>

<style scoped>

.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc; 
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.header-right {
  font-size: 0.875rem;
}

.text-muted {
  color: #64748b;
  margin-right: 0.5rem;
}

.link-primary {
  color: #2563eb;
  text-decoration: none;
}
.link-primary:hover {
  text-decoration: underline;
}
.font-medium {
  font-weight: 500;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.login-card {
  display: flex;
  width: 100%;
  max-width: 936px;
  background: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08);
  overflow: hidden;
}

/* Left Column (Form) */
.form-column {
  flex: 1;
  padding: 3rem 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.5rem;
  margin-top: 0;
}

.subtitle {
  color: #64748b;
  margin-bottom: 2.5rem;
  font-size: 0.95rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.options-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #475569;
  cursor: pointer;
}

.text-sm {
  font-size: 0.875rem;
}

.btn-submit {
  width: 100%;
  padding: 0.875rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 0.5rem;
}

.btn-submit:hover {
  background-color: #1d4ed8;
}

.divider::before, .divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e2e8f0;
}

.divider span {
  padding: 0 1rem;
}

.social-row {
  display: flex;
  gap: 1rem;
}

.btn-social {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-social:hover {
  background-color: #f8fafc;
}

/* Right Column */
.promo-column {
  flex: 1;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.promo-image-wrapper {
  width: 100%;
  max-width: 400px;
  margin-bottom: 2rem;
  border-radius: 1rem;
  padding: 0.5rem;
  background: rgba(255,255,255,0.5);
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05);
}

.promo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 16px;
}

.promo-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1rem;
}

.promo-desc {
  color: #475569;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 350px;
}

.avatar-group-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-group {
  display: flex;
}

.avatar-text {
  font-size: 0.875rem;
  color: #475569;
  font-weight: 500;
}

/* Footer */
.footer {
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-size: 0.875rem;
}

.footer-links {
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.footer-links a {
  color: #64748b;
  text-decoration: none;
}

.footer-links a:hover {
  color: #0f172a;
}

@media (max-width: 900px) {
  .login-card {
    flex-direction: column;
  }
  .promo-column {
    display: none; 
  }
  .header {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>