<template>
  <div class="welcome-wrapper">
    <div class="greeting-container">
      <h1 class="greeting-title">Xin chào {{authStore.user?.fullName}}!</h1>
      <h2 class="greeting-subtitle">Hôm nay có gì mới?</h2>
    </div>

    <div class="input-slot">
      <slot></slot>
    </div>

    <div class="suggestion-chips">
      <div class="chip-btn">Lộ trình học DevOps 2026</div>

      <div class="chip-btn">
        <GitBranch class="chip-icon icon-blue" size="16" />
        Viết luồng CI/CD GitHub Actions
      </div>

      <div class="chip-btn">
        <Box class="chip-icon icon-orange" size="16" />
        Tối ưu hóa Dockerfile
      </div>

      <div class="chip-btn">Giải thích kiến trúc Kubernetes</div>
      <div class="chip-btn">Viết script Terraform cấu hình AWS</div>
      <div class="chip-btn">Các lệnh Linux thường dùng</div>
    </div>
  </div>
</template>

<script setup>
import { GitBranch,Box} from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
</script>

<style scoped>
.welcome-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  max-width: 860px;
  margin: 0 auto;
  width: 100%;
}

.greeting-container {
  text-align: left;
  width: 100%;
  margin-bottom: 32px;
}

.greeting-title {
  font-size: 40px;
  font-weight: 500;
  color: #444746;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.greeting-subtitle {
  font-size: 40px;
  font-weight: 400;
  color: #444746;
  margin: 0;
  line-height: 1.2;
}

.input-slot {
  width: 100%;
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
}


.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  max-width: 700px;
}

.chip-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  font-size: 14px;
  color: #444746;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.chip-btn:hover {
  background-color: #f0f4f9;
}

.chip-icon {
  flex-shrink: 0;
}

/* Tuỳ chỉnh màu cho icon giống Gemini */
.icon-blue {
  color: #1a73e8;
}

.icon-red {
  color: #ea4335;
}
</style>