<template>
  <div class="layout-wrapper">
    <!-- Header -->
    <header class="header">
      <div class="logo-area">
        <img src="@/assets/img/logo_devops_hub.png" alt="DevOps Connect Logo" class="logo-icon" />
        <span class="logo-text">DevOps Connect</span>
      </div>
      <div class="header-right">
        <button class="btn-primary-small" @click="() => router.push('/login')">Đăng nhập</button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Register Card -->
      <div class="register-card">
        <div class="card-header">
          <h1 class="title">Tạo tài khoản mới</h1>
          <p class="subtitle">Trở thành một phần của cộng đồng DevOps toàn cầu ngay hôm nay.</p>
        </div>

        <form @submit.prevent="handleRegister" class="form">

          <!-- Họ và tên -->
          <BaseInput v-model="form.username" label="Họ và tên" placeholder="Nguyen Van A" icon="icon-user" required @blur="touched.username = true" :error="errors.username"/>

          <!-- Email -->
          <BaseInput v-model="form.email" label="Email" placeholder="devops@example.com" icon="icon-email" type="email"
            required @blur="touched.email = true" :error="errors.email"/>

          <!-- Grid Mật khẩu & Xác nhận -->
          <div class="enter-password">
            <BaseInput v-model="form.password" label="Mật khẩu" placeholder="Nhập mật khẩu" icon="icon-password"
              type="password" required @blur="touched.password = true" :error="errors.password"/>


            <!-- Grid Mật khẩu & Xác nhận -->
            <BaseInput v-model="confirmPassword" label="Xác nhận mật khẩu" placeholder="xác nhận lại mật khẩu"
              icon="icon-password" type="password" required @blur="touched.confirmPassword = true" :error="errors.confirmPassword" />
          </div>

          <!-- Checkbox Điều khoản -->
          <div class="checkbox-row">
            <label class="checkbox-label">
              <input type="checkbox" v-model="agreeTerms" />
              <span>
                Tôi đồng ý với <a href="#" class="link-primary">Điều khoản sử dụng</a> và <a href="#"
                  class="link-primary">Chính sách bảo mật</a> của DevOps Connect.
              </span>
            </label>
          </div>

          <!-- Nút Đăng ký -->
          <button type="submit" class="btn-submit">Tạo tài khoản ngay</button>

          <!-- Đăng nhập link -->
          <div class="login-link-row">
            <span class="text-muted">Đã có tài khoản?</span>
            <a href="/login" class="link-primary font-medium">Đăng nhập</a>
          </div>
        </form>
      </div>

      <div class="features-section">
        <div class="feature-item">
          <div class="feature-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h3>Cộng đồng lớn</h3>
          <p>Kết nối với hơn 50,000 chuyên gia DevOps trên toàn thế giới.</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <h3>Kiến thức chuyên sâu</h3>
          <p>Truy cập hàng ngàn bài viết và tutorial chất lượng cao.</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <h3>Cơ hội nghề nghiệp</h3>
          <p>Tìm kiếm các vị trí DevOps từ những tập đoàn công nghệ hàng đầu.</p>
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
  <ToastMessage v-model="toastVisible" :text="toastText" :is-success="!isError" :is-error="isError" />
  <OtpModal v-model:isOpen="isOpen" @confirm="handleVerifyOtp" @resend="handleResendCode"/>
  <LoadingPage v-if="authStore.isLoading" />
</template>

<script setup>
import BaseInput from '@/components/base/BaseInput.vue'
import ToastMessage from '@/components/ToastMessage.vue';
import OtpModal from '@/components/OtpModal.vue'
import { reactive, ref,computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import LoadingPage from '@/components/LoadingPage.vue';

const authStore = useAuthStore();
const router = useRouter();
const agreeTerms = ref(false);
const toastVisible = ref(false);
const toastText = ref('');
const isError = ref(false);
const isOpen = ref(false);

const touched = reactive({
  username: false,
  email: false,
  password: false,
  confirmPassword: false
})
const confirmPassword = ref('');

const form = reactive({
  username: '',
  email: '',
  password: '',
})

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const errors = computed(() => {
  // Tạo một object rỗng để chứa lỗi
  const errs = { username: '', email: '', password: '' }

  // --- Validate Username ---
  if (touched.username) {
    if (!form.username) {
      errs.username = 'Vui lòng nhập tên đăng nhập'
    } else if (form.username.length < 6) {
      errs.username = 'Họ và tên phải có ít nhất 6 ký tự'
    }
  }

  // --- Validate Email ---
  if (touched.email) {
    if (!form.email) {
      errs.email = 'Vui lòng nhập địa chỉ email'
    } else if (!emailRegex.test(form.email)) {
      errs.email = 'Định dạng email không hợp lệ'
    }
  }

  // --- Validate Password ---
  if (touched.password) {
    if (!form.password) {
      errs.password = 'Vui lòng nhập mật khẩu'
    } else if (form.password.length < 6) {
      errs.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }
  }

  return errs
})

const handleRegister = async () => {

  if (!form.username || !form.email || !form.password) {
    toastText.value = 'Vui lòng điền đầy đủ tất cả các trường.';
    isError.value = true;
    toastVisible.value = true;
    return
  }

  if (!agreeTerms.value) {
    toastText.value = 'Bạn phải đồng ý với điều khoản sử dụng và chính sách bảo mật để tiếp tục.';
    isError.value = true;
    toastVisible.value = true;
    return
  }

  if (form.password !== confirmPassword.value) {
    toastText.value = 'Mật khẩu và xác nhận mật khẩu không khớp.';
    isError.value = true;
    toastVisible.value = true;
    return
  }

  const result = await authStore.requestRegisterOtp(form);

  if (result.success) {
    toastText.value = result.message ;
    isError.value = false;
    toastVisible.value = true;
    setTimeout(() => {
      isOpen.value = true;
    }, 1500);
  } else {
    toastText.value = result.message;
    isError.value = true;
    toastVisible.value = true;
    console.error('Đăng ký thất bại:', result.error);
  }

}

const handleVerifyOtp = async (otpCode) => {
  const otpVerifyData = {
    email: form.email,
    otp: otpCode
  }
  const result = await authStore.verifyRegisterOtp(otpVerifyData);

  if (result.success) {
    toastText.value = result.message;
    isError.value = false;
    toastVisible.value = true;
    setTimeout(() => {
      isOpen.value = false;
      router.push('/login');
    }, 1500);
  } else {
    toastText.value = result.message;
    isError.value = true;
    toastVisible.value = true;
  }
}

const handleResendCode = async () => {
  const result = await authStore.requestRegisterOtp(form);

  if (result.success) {
    toastText.value = result.message ;
    isError.value = false;
    toastVisible.value = true;
  } else {
    toastText.value = result.message;
    isError.value = true;
    toastVisible.value = true;
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

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 36px;
}

/* Register Card */
.register-card {
  width: 100%;
  max-width: 468px;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  padding: 2.5rem 3rem;
  margin-bottom: 4rem;
}

.card-header {
  margin-bottom: 2rem;
}

.title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
}

/* Form Styles */
.form {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  color: #0f172a;
  background-color: #f8fafc;
  transition: all 0.2s;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #3b82f6;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-wrapper input::placeholder {
  color: #94a3b8;
}

.grid-2-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.enter-password {
  display: flex;
  gap: 22px;
}

/* Checkbox */
.checkbox-row {
  margin-top: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #475569;
  cursor: pointer;
  line-height: 1.5;
}

.checkbox-label input {
  margin-top: 0.25rem;
}

.link-primary {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.link-primary:hover {
  text-decoration: underline;
}

/* Button Submit */
.btn-submit {
  width: 100%;
  padding: 0.875rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.btn-submit:hover {
  background-color: #2563eb;
}

/* Login Link */
.login-link-row {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
}

.text-muted {
  color: #64748b;
  margin-right: 0.5rem;
}

.font-medium {
  font-weight: 600;
}


.features-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  max-width: 1000px;
  width: 100%;
  text-align: center;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.feature-icon-wrapper {
  width: 3rem;
  height: 3rem;
  background-color: #dbeafe;
  /* Nền xanh nhạt */
  color: #2563eb;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.feature-icon-wrapper svg {
  width: 1.5rem;
  height: 1.5rem;
}

.feature-item h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
}

.feature-item p {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

/* Footer */
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 3rem;
  border-top: 1px solid #e2e8f0;
  font-size: 0.875rem;
  color: #94a3b8;
  background: white;
}

.footer p {
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-links a {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #475569;
}


@media (max-width: 768px) {

  .header,
  .footer {
    padding: 1.5rem 1.5rem;
  }

  .grid-2-cols {
    grid-template-columns: 1fr;
  }

  .features-section {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .register-card {
    padding: 2rem 1.5rem;
  }
}
</style>