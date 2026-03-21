<template>
  <!-- Teleport đưa toàn bộ Modal ra thẳng thẻ <body> -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-content">
        
          <button class="btn-close" @click="closeModal">✕</button>

          <!-- Header -->
          <h2 class="title">Xác thực tài khoản</h2>
          <p class="subtitle">
            Chúng tôi đã gửi mã OTP đến email của bạn. Vui lòng kiểm tra và nhập mã 6 số bên dưới.
          </p>

          <!-- Vùng nhập OTP (6 ô) -->
          <div class="otp-container">
            <input
              v-for="(digit, index) in otpArray"
              :key="index"
              ref="inputRefs"
              type="text"
              inputmode="numeric"
              maxlength="1"
              v-model="otpArray[index]"
              class="otp-input"
              placeholder="0"
              @input="handleInput($event, index)"
              @keydown="handleKeydown($event, index)"
              @paste="handlePaste($event)"
              @focus="$event.target.select()"
            />
          </div>

          <div class="timer-container">
            <div v-if="timeLeft > 0" class="timer-pill">
              <svg class="icon-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Gửi lại mã sau <span class="time-text">{{ formattedTime }}</span>
            </div>
            <button v-else class="btn-resend" @click="resendOtp">
              Gửi lại mã OTP
            </button>
          </div>

          <!-- Nút Xác nhận -->
          <button class="btn-confirm" @click="confirmOtp" :disabled="!isOtpComplete">
            Xác nhận
            <svg class="icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false }
})

const emit = defineEmits(['update:isOpen', 'confirm', 'resend'])

const closeModal = () => {
  emit('update:isOpen', false)
}

const otpLength = 6
const otpArray = ref(Array(otpLength).fill(''))
const inputRefs = ref([])

// Kiểm tra xem đã nhập đủ 6 số chưa
const isOtpComplete = computed(() => {
  return otpArray.value.every(digit => digit !== '')
})

const handleInput = (e, index) => {
  const value = e.target.value
  if (!/^\d*$/.test(value)) {
    otpArray.value[index] = ''
    return
  }

  if (value && index < otpLength - 1) {
    inputRefs.value[index + 1].focus()
  }
}

const handleKeydown = (e, index) => {
  if (e.key === 'Backspace' && !otpArray.value[index] && index > 0) {
    inputRefs.value[index - 1].focus()
  }
}

const handlePaste = (e) => {
  e.preventDefault()
  const pastedData = e.clipboardData.getData('text').slice(0, otpLength).replace(/\D/g, '') 
  
  if (pastedData) {
    pastedData.split('').forEach((char, i) => {
      otpArray.value[i] = char
    })

    const focusIndex = Math.min(pastedData.length, otpLength - 1)
    inputRefs.value[focusIndex].focus()
  }
}

const confirmOtp = () => {
  const otpCode = otpArray.value.join('')
  emit('confirm', otpCode)
}

const timeLeft = ref(120)
let timer = null

const formattedTime = computed(() => {
  const m = Math.floor(timeLeft.value / 60).toString().padStart(2, '0')
  const s = (timeLeft.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

const startTimer = () => {
  clearInterval(timer)
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timer)
    }
  }, 1000)
}

const resendOtp = () => {
  timeLeft.value = 120
  startTimer()
  otpArray.value = Array(otpLength).fill('') 
  inputRefs.value[0]?.focus()
  emit('resend')
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    otpArray.value = Array(otpLength).fill('')
    timeLeft.value = 120
    startTimer()
    nextTick(() => {
      inputRefs.value[0]?.focus()
    })
  } else {
    clearInterval(timer)
  }
})
</script>

<style scoped>

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; 
  backdrop-filter: blur(2px);
}

/* Khung nội dung Modal */
.modal-content {
  position: relative;
  background: white;
  width: 90%;
  max-width: 440px;
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  text-align: center;
}

.btn-close {
  position: absolute;
  top: 1rem;
  right: 1.25rem;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #94a3b8;
  cursor: pointer;
}
.btn-close:hover { color: #0f172a; }

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-top: 0;
  margin-bottom: 0.75rem;
}

.subtitle {
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 2rem;
}

/* Vùng nhập OTP */
.otp-container {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.otp-input {
  width: 3rem;
  height: 3.5rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: #0f172a;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  transition: all 0.2s;
  -moz-appearance: textfield;
  appearance: textfield;
}
.otp-input::-webkit-outer-spin-button,
.otp-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.otp-input:focus {
  outline: none;
  border-color: #3b82f6;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.otp-input::placeholder { color: #cbd5e1; }

/* Vùng Timer */
.timer-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.timer-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f1f5f9;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  color: #475569;
  font-weight: 500;
}

.icon-clock {
  width: 1rem;
  height: 1rem;
  color: #64748b;
}

.time-text {
  color: #2563eb;
  font-weight: 600;
}

.btn-resend {
  background: none;
  border: none;
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 1rem;
}
.btn-resend:hover { text-decoration: underline; }

/* Nút Xác nhận */
.btn-confirm {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.875rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-confirm:hover { background-color: #2563eb; }
.btn-confirm:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.icon-arrow {
  width: 1.25rem;
  height: 1.25rem;
}

/* Hiệu ứng Fade cho Modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: translateY(-20px) scale(0.95);
}
</style>