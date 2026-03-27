<template>
  <div class="ai-widget-card">
    <div class="widget-header">
      <svg class="icon-sparkles" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"></path>
      </svg>
      <h3 class="title">Trợ lý AI</h3>
    </div>
    
    <p class="description">
      Trợ lý AI của chúng tôi có thể giúp bạn giải đáp thắc mắc, cung cấp thông tin nhanh chóng và hỗ trợ trong việc tìm kiếm tài liệu liên quan đến DevOps. 
    </p>
    
    <button class="btn-start-chat" @click="router.push('/ai-agent')">
      Bắt đầu 
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<style scoped>
.ai-widget-card {
  background-color: #f0fdf4; 
  border: 1px solid #bfdbfe; 
  border-radius: 1rem;
  padding: 1.25rem;
}

.widget-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.icon-sparkles {
  width: 1.25rem;
  height: 1.25rem;
  color: #2563eb;
  fill: #2563eb; 
}

.title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e40af; 
  margin: 0;
}

.description {
  font-size: 0.875rem;
  color: #334155;
  line-height: 1.5;
  margin: 0 0 1.25rem 0;
}

.btn-start-chat {
  width: 100%;
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-start-chat:hover {
  background-color: #2563eb;
}
</style>