<template>
  <FillterPost @refreshPosts="fetchLikePosts" />
  <div class="post_list_container">
    <PostList :items="posts.items" @refreshPosts="fetchLikePosts" />
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

const appStore = useAppStore()
const posts = ref([])
const route = useRoute()

const fetchLikePosts = async () => {
  appStore.setAppLoading(true)

  try {
      const response = await getMyLikesApi(appStore.filters)
      posts.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải bài viết:', error)
  } finally {
    appStore.setAppLoading(false)
  }
}

watch(
  () => route.query,
  (newQuery) => {
    appStore.syncUrlToState(newQuery, route.path)
    fetchLikePosts()
  },
  { immediate: true }
)

</script>

<style scoped>

</style>