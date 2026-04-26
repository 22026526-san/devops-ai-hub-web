<template>
  <FillterPost @refreshPosts="fetchPostsByTopic" />
  <div class="post_list_container">
    <PostList :items="posts.items" @refreshPosts="fetchPostsByTopic" />
  </div>
  <LoadingPage v-if="appStore.appLoading" />
</template>

<script setup>
import { watch, ref } from 'vue'
import { useAppStore } from '@/stores/app.store'
import { useAuthStore } from '@/stores/auth.store'
import { getPostsApi } from '@/api/modules/app.api'
import PostList from "@/views/app/Post/PostList.vue"
import LoadingPage from '@/components/LoadingPage.vue'
import { USER_ROLES } from '@/common/enums'
import FillterPost from '@/views/components/FillterPost.vue'

const appStore = useAppStore()
const authStore = useAuthStore()

const posts = ref([])

const fetchPostsByTopic = async () => {
  appStore.setAppLoading(true)

  try {
    if (authStore.role === USER_ROLES.ADMIN || authStore.role === USER_ROLES.USER) {
      appStore.filters.CurrentUserId = authStore.user.userId
      const response = await getPostsApi(appStore.filters)
      posts.value = response.data
      console.log("fetchPostsByTopic with CurrentUserId:", appStore.filters)
    } else {
      const response = await getPostsApi(appStore.filters)
      posts.value = response.data
    }

  } catch (error) {
    console.error('Lỗi khi tải bài viết:', error)
  } finally {
    appStore.setAppLoading(false)
  }
}

watch(
  () => [appStore.selectedTopic, appStore.filters.Search],

  ([newTopic, newSearch]) => {
    if (newTopic || newSearch) {
      fetchPostsByTopic()
    } else {
      posts.value = []
    }
  },
  { immediate: true }
)

</script>

<style scoped>
.header_search-container p {
  color: #2b3034;
  font-size: 15px;
  font-weight: 500;
}
</style>