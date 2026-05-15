<template>
    <div class="profile_content" ref="postListContainerRef">
        <CreatePost @refreshPosts="fetchPostsInfor"/>
        <div style="margin-top: 12px;">
            <FillterPost @refreshPosts="fetchPostsInfor" />
        </div>
        <PostList :items="posts" @refreshPosts="fetchPostsInfor"/>
    </div>
</template>

<script setup>
import CreatePost from '@/views/components/CreatePost.vue'
import PostList from '@/views/app/Post/PostList.vue';
import FillterPost from '@/views/components/FillterPost.vue';
import {ref,watch} from 'vue'
import { useAppStore } from '@/stores/app.store';
import { useAuthStore } from '@/stores/auth.store';
import { getPostsApi } from '@/api/modules/app.api'
import { useRoute } from 'vue-router';
import { useInfiniteScroll } from '@vueuse/core'

const appStore = useAppStore();
const authStore = useAuthStore()
const posts = ref([]);
const route = useRoute()
const hasMore = ref(true)
const postListContainerRef = ref(null)
const loading = ref(false)

const fetchPostsInfor = async () => {
  if (loading.value || !hasMore.value) return
  loading.value=true
  try {
      appStore.filters.CurrentUserId = authStore.user?.userId
      appStore.filters.FilterUserId = appStore.idProfile
      const response = await getPostsApi(appStore.filters)
      posts.value = [...posts.value, ...response.data.items]
      if (!response.data.hasNextPage) {
        hasMore.value = false
      } else {
        appStore.filters.Page++
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
  await fetchPostsInfor()
}

useInfiniteScroll(
  postListContainerRef,
  () => {
    if (!loading.value && hasMore.value) {
      fetchPostsInfor()
    }
  },
  { distance: 50 } 
)
watch(
  () => [appStore.idProfile, appStore.isFetchProfile, route.query],
  async ([newIdProfile, newIsFetchProfile, newQuery]) => {
    
    if (newQuery) {
       appStore.syncUrlToState(newQuery, route.path)
        await resetAndFetch()
    }
    if (newIdProfile || newIsFetchProfile) {
      await resetAndFetch()
    }
  },
  {immediate: true}
)

</script>

<style scoped>
.profile_content{
    height: 100%;
    width: calc(100% - 368px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}
</style>