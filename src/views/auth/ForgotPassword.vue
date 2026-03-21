<template>
  <div class="forgot-password-layout">
    <header class="header">
      <div class="logo-area">
        <img src="@/assets/img/logo_devops_hub.png" alt="DevOps Connect Logo" class="logo-icon" />
        <span class="logo-text">DevOps Connect</span>
      </div>
      <div class="header-right">
        <button class="btn-primary-small" @click="() => router.push('/login')">Đăng nhập</button>
      </div>
    </header>
    <!-- Main Card -->
     <main class="main-content">
    <div class="card">
      <!-- Icon phía trên cùng -->
      <div class="icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
          <path d="M3 3v5h5"></path>
        </svg>
      </div>

      <h1 class="title">Quên mật khẩu?</h1>
      <p class="subtitle">
        Đừng lo lắng, hãy nhập email của bạn và chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu.
      </p>

      <!-- Form -->
      <div class="form">
        <div class="input-group" v-if="!isOpenOtp">
          <label>EMAIL</label>
          <BaseInput
            v-model="email"
            type="email"
            placeholder="name@company.com"
            :error="emailError"
            required
            icon="icon-email"
            @blur="isTouched = true"
            />
        </div>
        <div class="input-group" v-if="isOpenOtp">
            <label>MÃ XÁC NHẬN (OTP)</label>
            <div class="otp-input-wrapper">
                <!-- BaseInput tự động co giãn chiếm phần còn lại -->
                <BaseInput
                v-model="otpCode"
                type="text"
                placeholder="Nhập mã 6 số"
                maxlength="6"
                required
                icon="icon-otp"
                @blur="isTouched = true"
                class="flex-1" 
                />
                
                <!-- Nút gửi lại mã -->
                <button 
                type="button" 
                class="btn-resend" 
                :disabled="countdown > 0"
                @click="handleResendOtp"
                >
                {{ countdown > 0 ? `Gửi lại (${countdown}s)` : 'Gửi lại mã' }}
                </button>
            </div>
            <label>NEW PASSWORD</label>
            <BaseInput
                v-model="newPassword"
                type="password"
                placeholder="Nhập mật khẩu mới"
                required
                icon="icon-password"
                @blur="isTouched = true"
            />
        </div>
        <button @click="handleSubmit" class="btn-submit" :disabled="isLoading" v-if="!isOpenOtp">
          Gửi yêu cầu khôi phục
          <svg v-if="!isLoading" class="icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
        <button @click="handleResetPassword" class="btn-submit" :disabled="isLoading || !newPassword" v-if="isOpenOtp">
          Xác nhận mật khẩu mới
          <svg v-if="!isLoading" class="icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>

      <!-- Link quay lại -->
      <div class="back-link">
        <router-link to="/login" class="link">
          <div class="icon-20 icon-back"></div>
          Quay lại Đăng nhập
        </router-link>
      </div>
    </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>© 2026 DevOps Connect. All rights reserved.</p>
      <div class="footer-links">
        <a href="#">Trợ giúp</a>
        <a href="#">Riêng tư</a>
        <a href="#">Điều khoản</a>
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
  <OtpModal v-model:isOpen="isOpen" @confirm="handleVerifyOtp" @resend="handleResendCode"/>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import BaseInput from '@/components/base/BaseInput.vue'
import ToastMessage from '@/components/ToastMessage.vue';
import LoadingPage from '@/components/LoadingPage.vue';
import OtpModal from '@/components/OtpModal.vue';

const authStore = useAuthStore()

const router = useRouter()

const email = ref('')
const newPassword = ref('');
const otpCode = ref('')
const isTouched = ref(false)
const isLoading = ref(false)
const toastVisible = ref(false)
const toastText = ref('')
const isError = ref(false)
const isOpenOtp = ref(false)

const countdown = ref(0)
let timer = null

const startCountdown = () => {
  countdown.value = 120
  clearInterval(timer)
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(timer) 
    }
  }, 1000)
}

// Regex kiểm tra định dạng email chuẩn
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Computed tính toán lỗi thông minh
const emailError = computed(() => {
  if (!isTouched.value) return ''
  
  if (!email.value) {
    return 'Vui lòng nhập địa chỉ email'
  }
  if (!emailRegex.test(email.value)) {
    return 'Định dạng email không hợp lệ'
  }
  return ''
})

const handleSubmit = async () => {
    const result = await authStore.requestForgotPasswordOtp({ email: email.value })
    if (result.success) {
      toastText.value = result.message;
      toastVisible.value = true; 
      isError.value = false;
      setTimeout(() => {
        isOpenOtp.value = true;
        startCountdown();
      }, 1500);
    } else {
      toastText.value = result.message;
      toastVisible.value = true;
      isError.value = true
    }
}

const handleResetPassword = async () => {
  const result = await authStore.resetPassword({ email: email.value, otp: otpCode.value, newPassword: newPassword.value })
  if (result.success) {
    toastText.value = result.message;
    toastVisible.value = true; 
    isError.value = false;
    setTimeout(() => {
      router.push('/login')
    }, 1500);
  } else {
    toastText.value = result.message;
    toastVisible.value = true;
    isError.value = true
  }
}

const handleResendOtp = async () => {
  const result = await authStore.requestForgotPasswordOtp({ email: email.value })
  if (result.success) {
    toastText.value = result.message;
    toastVisible.value = true; 
    isError.value = false;
    startCountdown();
  } else {
    toastText.value = result.message;
    toastVisible.value = true;
    isError.value = true
  }
}

</script>

<style scoped>

.forgot-password-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc; 
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

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
  display: flex;
  align-items: center;
}

.link-text {
  color: #475569;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
}

.link-text:hover {
  color: #0f172a;
}

.btn-primary-small {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary-small:hover {
  background-color: #2563eb;
}

/* Thẻ Card trung tâm */
.card {
  background: #ffffff;
  width: 100%;
  max-width: 400px;
  border-radius: 1rem;
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08);
  padding: 3rem 2.5rem;
  text-align: center;
  z-index: 10;
}

/* Icon tròn trên cùng */
.icon-wrapper {
  width: 4rem;
  height: 4rem;
  background-color: #dbeafe; /* Xanh nhạt */
  color: #3b82f6; /* Xanh đậm */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem auto;
}

.icon-wrapper svg {
  width: 2rem;
  height: 2rem;
}

/* Typography */
.title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.75rem 0;
}

.subtitle {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 2rem 0;
}

/* Form Styles */
.form {
  text-align: left;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #475569;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  width: 1.25rem;
  height: 1.25rem;
  color: #94a3b8;
}

.input-wrapper input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  color: #0f172a;
  transition: all 0.2s;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.input-wrapper input::placeholder {
  color: #94a3b8;
}

/* Trạng thái lỗi */
.input-wrapper.has-error input {
  border-color: #ef4444;
}
.input-wrapper.has-error input:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}
.error-text {
  display: block;
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

/* Nút Submit */
.btn-submit {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-submit:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.icon-arrow {
  width: 1.25rem;
  height: 1.25rem;
}

/* Link quay lại */
.back-link {
  margin-top: 1.5rem;
  text-align: center;
}

.back-link .link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #475569;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  transition: color 0.2s;
}

.icon-20 {
  background-color: #475569;
}   

.back-link .link:hover, .icon-20:hover {
  color: #0f172a;
}

/* Footer (Nằm ngoài Card) */
.footer {
  margin: 2rem 0;
  text-align: center;
  color: #94a3b8;
  font-size: 0.85rem;
  z-index: 10;
}

.footer p {
  margin: 0 0 0.5rem 0;
}

.footer-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
}

.footer-links a {
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
}

.footer-links a:hover {
  color: #0f172a;
}

.dot {
  color: #cbd5e1;
}

.otp-input-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: stretch; 
}

.btn-resend {
  padding: 0 1rem;
  background-color: #f1f5f9;
  color: #3b82f6;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  white-space: nowrap; 
  transition: all 0.2s;
  height: 46px; 
}

.btn-resend:hover:not(:disabled) {
  background-color: #e2e8f0;
}

.btn-resend:disabled {
  color: #94a3b8;
  cursor: not-allowed;
  background-color: #f8fafc;
}

/* Responsive */
@media (max-width: 480px) {
  .card {
    padding: 2.5rem 1.5rem;
  }
}
</style>