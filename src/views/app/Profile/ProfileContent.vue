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

const appStore = useAppStore();
const authStore = useAuthStore()
const posts = ref([]);

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
  () => [appStore.idProfile,appStore.isFetchProfile],

  ([newTopic, isFetchProfile]) => {
    if (newTopic || isFetchProfile) {
      fetchPostsInfor()
    }
  },
  {immediate:true}
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