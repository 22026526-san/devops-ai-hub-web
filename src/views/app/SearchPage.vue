<template>
  <FillterPost @refreshPosts="fetchPostsByTopic" />
  <div ref="postListContainerRef">
    <PostList :items="posts" @refreshPosts="fetchPostsByTopic" />
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
import { useRoute } from 'vue-router'
import { useInfiniteScroll } from '@vueuse/core'

const appStore = useAppStore()
const authStore = useAuthStore()
const route = useRoute()
const hasMore = ref(true)
const postListContainerRef = ref(null)
const loading = ref(false)

const posts = ref([])

const fetchPostsByTopic = async () => {
  if (loading.value || !hasMore.value) return
  loading.value=true
  try {
    if (authStore.role === USER_ROLES.ADMIN || authStore.role === USER_ROLES.USER) {
      appStore.filters.CurrentUserId = authStore.user.userId
      const response = await getPostsApi(appStore.filters)
      posts.value = [...posts.value, ...response.data.items]
      if (!response.data.hasNextPage) {
        hasMore.value = false
      } else {
        appStore.filters.Page++
      }
      console.log("fetchPostsByTopic with CurrentUserId:", appStore.filters)
    } else {
      const response = await getPostsApi(appStore.filters)
      posts.value = response.data
    }

  } catch (error) {
    console.error('Lỗi khi tải bài viết:', error)
  } finally {
    loading.value=false
  }
}
const resetAndFetch = async () => {
  posts.value = []
  appStore.filters.Page = 1
  hasMore.value = true
  await fetchPostsByTopic()
}

useInfiniteScroll(
  postListContainerRef,
  () => {
    if (!loading.value && hasMore.value) {
      fetchPostsByTopic()
    }
  },
  { distance: 50 } 
)
watch(
  () =>  route.query,
  async (newQuery) => {
    appStore.syncUrlToState(newQuery, route.path)
    await resetAndFetch()
  },
  { immediate: true }
)

</script>

<style scoped>
</style>