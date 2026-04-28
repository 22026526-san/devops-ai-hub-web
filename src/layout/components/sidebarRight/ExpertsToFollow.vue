<template>
  <div class="experts-card">
    <h3 class="card-title">Gợi ý theo dõi</h3>
    
    <div class="expert-list">
      <div 
        v-for="expert in experts" 
        :key="expert.userId" 
        class="expert-item"
        @click="handleInfo(expert.userId)"
      >
        <div class="user-avatar-wrapper">
        <img 
          :src="expert.avatarUrl ? expert.avatarUrl : defaultAvatar" 
          alt="User Avatar" 
          class="user-avatar"
        />
      </div>
        
        <div class="expert-info">
          <span class="expert-name">{{ expert.fullName }}</span>
          <span class="expert-role">{{ expert.jobTitle ? expert.jobTitle : '' }}</span>
        </div>
        
        <button class="btn-follow" @click="handleFollow(expert.userId)">
          <div class="icon-20 icon-plus"></div>
        </button>
      </div>
    </div>
  </div>
  <ToastMessage 
    v-model="toastVisible"
    :text="toastText"
    :is-success="!isError"
    :is-error="isError"
  />
</template>

<script setup>
import { ref , watchEffect } from 'vue'
import { getSuggestedFollowsApi, followUserApi } from '@/api/modules/user.api'
import defaultAvatar from '@/assets/img/user_default.png'
import ToastMessage from '@/components/ToastMessage.vue'
import { useAppStore } from '@/stores/app.store'
import { useRouter } from 'vue-router'


const toastVisible = ref(false)
const toastText = ref('')
const isError = ref(false)
const appStore = useAppStore()
const router = useRouter()

const experts = ref([])

const loadSuggestedFollows = async () => {
  try {
    const response = await getSuggestedFollowsApi()
    experts.value = response.data
  } catch (error) {
    console.error("Lỗi khi tải danh sách chuyên gia gợi ý:", error)
  }
}

watchEffect(() => {
  loadSuggestedFollows()
})

const handleFollow = async (userId) => {
  try {
    await followUserApi(userId)
  } catch (error) {
    isError.value = true
    toastText.value = "Lỗi khi theo dõi chuyên gia: " + error.message
    toastVisible.value = true
  } finally {
    loadSuggestedFollows()
    isError.value = false
    toastText.value = "Đã theo dõi chuyên gia thành công!"  
    toastVisible.value = true
  }
}

const handleInfo = (id) => {
  appStore.idProfile = id
  appStore.fillTitle = ''
  router.push({ 
      name: 'profile', 
      query: { id: id } 
  }) 
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
  cursor: pointer;
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