<template>
  <div class="post-list-container">
    <template v-for="item in items" :key="item.id">
      
      <PipelineCard 
        v-if="item.postType === 'Pipeline'" 
        :post="item" 
        @openComment="handdleOpenModal"
      />
      
      <QuestionCard 
        v-else-if="item.postType === 'Question'" 
        :post="item" 
        @openComment="handdleOpenModal"
      />
      
      <div v-else class="fallback-card">
        Loại bài viết không hỗ trợ: {{ item.postType }}
      </div>

    </template>
    <PostDetailModal 
      :isOpen="isModalOpen" 
      :post="selectedPost" 
      :comments="apiCommentList"
      @close="isModalOpen = false"
      @refreshComments="handdleOpenModal(selectedPost)"
    />

    <ToastMessage 
      v-model="toastVisible"
      :text="toastText"
      :is-success="!isError"
      :is-error="isError"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PipelineCard from '@/views/components/PipelineCard.vue';
import QuestionCard from '@/views/components/QuestionCard.vue';
import { getPostCommentsApi } from '@/api/modules/app.api';
import PostDetailModal from '@/views/app/Post/PostDetailModal.vue'
import ToastMessage from '@/components/ToastMessage.vue';

defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

const isModalOpen = ref(false)
const apiCommentList = ref([])
const toastVisible = ref(false)
const toastText = ref('') 
const isError = ref(false)
const selectedPost = ref(null)

const handdleOpenModal = async (postData) => {
  selectedPost.value = postData
  try {
    const response = await getPostCommentsApi(postData.id)
    apiCommentList.value = response.data
  } catch (error) {
    isError.value = true
    toastText.value = "Lỗi khi tải bình luận: " + error.message
    toastVisible.value = true
  } finally {
    isModalOpen.value = true
  }
}
</script>

<style scoped>
.post-list-container {
  margin: 0 ;
  padding: 12px 0px;
}

.fallback-card {
  padding: 16px;
  margin-bottom: 16px;
  color: #ef4444; 
  border: 1px solid #fca5a5; 
  border-radius: 8px;
  background-color: #fef2f2;
}
</style>