<template>
    <div class="profile_content">
        <CreatePost @refreshPosts="fetchPostsInfor"/>
        <div style="margin-top: 12px;">
            <FillterPost @refreshPosts="fetchPostsInfor" />
        </div>
        <PostList :items="posts.items" @refreshPosts="fetchPostsInfor"/>
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

const appStore = useAppStore();
const authStore = useAuthStore()
const posts = ref([]);
const route = useRoute()

const fetchPostsInfor = async () => {
  appStore.setAppLoading(true)
  try {
      appStore.filters.CurrentUserId = authStore.user?.userId
      appStore.filters.FilterUserId = appStore.idProfile
      const response = await getPostsApi(appStore.filters)
      posts.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải bài viết:', error)
  } finally {
    appStore.setAppLoading(false)
    appStore.isFetchProfile = false
  }
}

watch(
  () => [appStore.idProfile, appStore.isFetchProfile, route.query],
  ([newIdProfile, newIsFetchProfile, newQuery]) => {
    
    if (newQuery) {
       appStore.syncUrlToState(newQuery, route.path)
        fetchPostsInfor()
    }
    if (newIdProfile || newIsFetchProfile) {
      fetchPostsInfor()
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