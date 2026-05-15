<template>
  <FillterPost @refreshPosts="fetchLikePosts" />
  <div ref="postListContainerRef">
    <PostList :items="posts" @refreshPosts="fetchLikePosts" />
  </div>
  <LoadingPage v-if="appStore.appLoading" />
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAppStore } from '@/stores/app.store'
import { getMyLikesApi } from '@/api/modules/app.api'
import PostList from "@/views/app/Post/PostList.vue"
import LoadingPage from '@/components/LoadingPage.vue'
import FillterPost from '@/views/components/FillterPost.vue'
import { useRoute } from 'vue-router'
import { useInfiniteScroll } from '@vueuse/core'

const appStore = useAppStore()
const posts = ref([])
const route = useRoute()
const hasMore = ref(true)
const postListContainerRef = ref(null)
const loading = ref(false)

const fetchLikePosts = async () => {
  if (loading.value || !hasMore.value) return
  loading.value=true

  try {
      const response = await getMyLikesApi(appStore.filters)
      posts.value = [...posts.value, ...response.data.items]
      if (!response.data.hasNextPage) {
        hasMore.value = false
      } else {
        appStore.filters.Page++
      }
  } catch (error) {
    console.error('Lỗi khi tải bài viết:', error)
  } finally {
    loading.value = false
  }
}
const resetAndFetch = async () => {
  posts.value = []
  appStore.filters.Page = 1
  hasMore.value = true
  await fetchLikePosts()
}

useInfiniteScroll(
  postListContainerRef,
  () => {
    if (!loading.value && hasMore.value) {
      fetchLikePosts()
    }
  },
  { distance: 50 } 
)
watch(
  () => route.query,
  async (newQuery) => {
    appStore.syncUrlToState(newQuery, route.path)
    await resetAndFetch()
  },
  { immediate: true }
)

</script>

<style scoped>

</style>