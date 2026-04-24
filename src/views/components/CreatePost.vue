<template>
  <div class="create-post-container">
    <div class="user-avatar-wrapper">
      <img :src="authStore.user?.avatarUrl ? authStore.user.avatarUrl : defaultAvatar" alt="User Avatar"
        class="user-avatar" />
    </div>

    <button class="trigger-input" @click="isQuestionPost = true">
      {{ authStore.user?.fullName || 'Bạn' }} ơi, bạn đang nghĩ gì thế?
    </button>

    <div class="action-icons">

      <button class="action-btn" @click="isQuestionPost = true; isPipelinePost = false">
        <Image class="icon-small" style="color: rgb(255 0 0);;" />
      </button>
      <CreatePostQuestion v-if="isQuestionPost" @close="isQuestionPost = false" @refreshPosts="emit('refreshPosts')"/>


      <button class="action-btn" @click="isPipelinePost = true; isQuestionPost = false">
        <Code2 class="icon-small" style="color: rgb(28 188 19);" />
      </button>
     <CreatePostPipeline v-if="isPipelinePost" @close="isPipelinePost = false" @refreshPosts="emit('refreshPosts')"/> 
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import defaultAvatar from '@/assets/img/user_default.png'
import CreatePostPipeline from '@/views/components/CreatePostPipeline.vue'
import CreatePostQuestion from '@/views/components/CreatePostQuestion.vue'
import { Code2, Image } from 'lucide-vue-next'

const authStore = useAuthStore()
const isQuestionPost = ref(false)
const isPipelinePost = ref(false)

const emit = defineEmits(['refreshPosts'])  

</script>

<style scoped>
.create-post-container {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #fff;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.trigger-input {
  flex: 1;
  background-color: #62626212;
  color: #B0B3B8;
  border: none;
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 15px;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action-icons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-btn {
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  padding: 0;
}
.icon-small {
  width: 22px;
  height: 22px;
}
</style>