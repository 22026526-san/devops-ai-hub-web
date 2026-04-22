<template>
  <div class="post-list-container">
    <template v-for="item in items" :key="item.id">
      
      <PipelineCard 
        v-if="item.postType === 'Pipeline'" 
        :post="item" 
      />
      
      <QuestionCard 
        v-else-if="item.postType === 'Question'" 
        :post="item" 
      />
      
      <div v-else class="fallback-card">
        Loại bài viết không hỗ trợ: {{ item.postType }}
      </div>

    </template>
  </div>
</template>

<script setup>
import PipelineCard from '@/views/components/PipelineCard.vue';
import QuestionCard from '@/views/components/QuestionCard.vue';

defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
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