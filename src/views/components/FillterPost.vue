<template>
  <div class="post-header-container">
    <h2 class="post-title">Bài viết <span>{{ appStore.fillTitle }}</span></h2>

    <div class="post-actions">
      <button class="action-btn" @click="openFilter">
        <SlidersHorizontal class="icon-small" />
        Bộ lọc
      </button>
    </div>
  </div>
  <PostFilterModal :isOpen="isFillOpen" @close="closeFill"/>
</template>

<script setup>
import { ref } from 'vue'
import { SlidersHorizontal } from 'lucide-vue-next';
import { useAppStore } from '@/stores/app.store';
import PostFilterModal from '../app/Post/PostFilterModal.vue';

const appStore = useAppStore()
const isFillOpen = ref(false)

const emit = defineEmits(['refreshPosts'])

const openFilter = () => {
  isFillOpen.value = true;
}

const closeFill = () => {
    isFillOpen.value = false;
    emit('refreshPosts')
}

</script>

<style scoped>
.post-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  width: auto;
  background-color: #fff;
  padding: 12px 16px;
  border-radius: 8px;
  border: #d8dadf 1px solid;
}

.post-title {
  font-size: 20px;
  font-weight: 700;
  color: #050505;
  margin: 0;
}

.post-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: #e4e6eb;
  color: #050505;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.action-btn:hover {
  background-color: #d8dadf;
}


.icon-small {
  width: 16px;
  height: 16px;
  stroke-width: 2.5px;
}
</style>