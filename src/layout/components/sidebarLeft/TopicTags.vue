<template>
  <div class="trending-card">
    <!-- Header -->
    <div class="card-header">
      <div class="icon-20 icon-topic-tags"></div>
      <h3 class="title">Topics</h3>
    </div>

    <!-- Danh sách Tags -->
    <div class="tag-list">
      <li 
        v-for="tag in topics" 
        :key="tag.name" 
        class="tag-item"
        :class="{ 'is-active': idActive === tag.id }"
        @click="handleClickTag(tag)"
      >
        <div class="tag-left">
          <svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
            <line x1="4" y1="22" x2="4" y2="15"></line>
          </svg>
          <span class="tag-name">{{ tag.name }}</span>
        </div>
        <span class="tag-count" v-if="tag.count > 0">{{ tag.count }}</span>
      </li>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app.store'
import { getTagsApi } from '@/api/modules/app.api'
import { useRouter } from 'vue-router'

const router = useRouter()
const appStore = useAppStore()
const topics = ref([]);
const idActive = ref(null)

const fetchTopics = async () => {
  appStore.setAppLoading(true)
  try {
    const response = await getTagsApi()
    topics.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải topics:', error)
} finally {
    appStore.setAppLoading(false)
  }
}

onMounted(() => {
  fetchTopics()
})

const handleClickTag = (tag) => {
  appStore.setTopicSelected(tag.id)
  idActive.value = tag.id
  router.push({ 
    name: 'home', 
    params: { id: tag.id } 
  })
}
</script>

<style scoped>
.trending-card {
  background-color: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  margin-bottom: 1.5rem; 
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.icon-20 {
  background-color: #3b82f6;
}

.title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.tag-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  max-height: 268px;
  scrollbar-width: none; 
  -ms-overflow-style: none;
}

.tag-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.tag-item:hover {
  background-color: #f8fafc;
}

.tag-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.tag-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: #64748b;
}

.tag-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
}

.tag-count {
  font-size: 0.8rem;
  color: #94a3b8;
  background-color: transparent;
  padding: 0.2rem 0.5rem;
  border-radius: 99px;
}

.tag-item.is-active {
  background-color: #eff6ff; 
}

.tag-item.is-active .tag-icon,
.tag-item.is-active .tag-name {
  color: #2563eb;
  font-weight: 600;
}

.tag-item.is-active .tag-count {
  background-color: #dbeafe;
  color: #2563eb;
  font-weight: 600;
}
</style>
