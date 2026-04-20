<template>
  <div class="experts-card">
    <h3 class="card-title">Gợi ý theo dõi</h3>
    
    <div class="expert-list">
      <div 
        v-for="expert in experts" 
        :key="expert.id" 
        class="expert-item"
      >
        <img :src="expert.avatar" :alt="expert.name" class="expert-avatar" />
        
        <div class="expert-info">
          <span class="expert-name">{{ expert.name }}</span>
          <span class="expert-role">{{ expert.role }}</span>
        </div>
        
        <button class="btn-follow" @click="handleFollow(expert.name)">
          <div class="icon-20 icon-plus"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Dữ liệu giả lập chuẩn theo thiết kế
const experts = ref([
  {
    id: 1,
    name: 'Alex Rivera',
    role: 'AWS Hero',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'K8s Contributor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
  },
  {
    id: 3,
    name: 'Tom Watson',
    role: 'Staff SRE',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom'
  },
  {
    id: 1,
    name: 'Alex Rivera',
    role: 'AWS Hero',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'K8s Contributor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
  },
  {
    id: 3,
    name: 'Tom Watson',
    role: 'Staff SRE',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom'
  },
  {
    id: 1,
    name: 'Alex Rivera',
    role: 'AWS Hero',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'K8s Contributor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
  },
  {
    id: 3,
    name: 'Tom Watson',
    role: 'Staff SRE',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom'
  },
  {
    id: 1,
    name: 'Alex Rivera',
    role: 'AWS Hero',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'K8s Contributor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
  },
  {
    id: 3,
    name: 'Tom Watson',
    role: 'Staff SRE',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom'
  },
])

const handleFollow = (name) => {
  console.log(`Đã bấm theo dõi chuyên gia: ${name}`)
  
}
</script>

<style scoped>
.experts-card {
  background-color: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1.25rem 0;
}

.expert-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  max-height: 368px;
  scrollbar-width: none; 
  -ms-overflow-style: none;
}

.expert-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.expert-avatar {
  width: 38px; 
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #e2e8f0; 
}

.expert-info {
  flex: 1; 
  display: flex;
  flex-direction: column;
}

.expert-name {
  font-size: 14px ;
  font-weight: 600;
  color: #0f172a;
}

.expert-role {
  font-size:  12px;
  color: #64748b;
  margin-top: 0.1rem;
}

.btn-follow {
  display: flex;
  align-items: center;
  justify-self:center;
  gap: 2px;
  background-color: transparent;
  cursor: pointer;
  border: none;
}
.btn-follow .icon-20 {
  background-color: #2563eb; 
}
</style>