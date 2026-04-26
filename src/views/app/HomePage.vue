<template>
  <CreatePost @refreshPosts="fetchPostsByTopic"/>
  <div class="post_list_container">
    <PostList :items="posts.items" @refreshPosts="fetchPostsByTopic"/>
  </div>
  <LoadingPage v-if="appStore.appLoading"/>
</template>

<script setup>
import { watch, ref} from 'vue'
import { useAppStore } from '@/stores/app.store'
import {useAuthStore} from '@/stores/auth.store'
import { getPostsApi } from '@/api/modules/app.api'
import CreatePost from '@/views/components/CreatePost.vue'
import PostList from "@/views/app/Post/PostList.vue"
import LoadingPage from '@/components/LoadingPage.vue'
import { USER_ROLES } from '@/common/enums'

const appStore = useAppStore()
const authStore = useAuthStore()


const posts = ref([])
const { filters } = appStore
const fetchPostsByTopic = async () => {
  appStore.setAppLoading(true)
  try {
    if (authStore.role === USER_ROLES.ADMIN || authStore.role === USER_ROLES.USER) {
      filters.CurrentUserId = authStore.user?.userId
      const response = await getPostsApi(filters)
      posts.value = response.data
    } else {
      const response = await getPostsApi(filters)
      posts.value = response.data
    }

  } catch (error) {
    console.error('Lỗi khi tải bài viết:', error)
  } finally {
    appStore.setAppLoading(false)
  }
}

watch(
  () => appStore.selectedTopic,

  (newTopic) => {
    if (newTopic) {
      fetchPostsByTopic()
    }
  },
  {immediate:true}
)


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

/* Avatar */
.user-avatar-wrapper {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(135deg, #a7f3d0, #bae6fd);
  cursor: pointer;
}

.user-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background-color: #e2e8f0;
}

.icon-camera {
  margin-top: 2px;
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
</style>