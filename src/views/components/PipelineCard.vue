<template>
  <div class="post_card">
    <div class="post_header">
      <div class="user-avatar-wrapper">
        <img :src="post.authorImage ? post.authorImage : defaultAvatar" alt="User Avatar"
          class="user-avatar" />
      </div>
      <div class="post_user-info">
        <div class="post_name">
          {{ post.authorUsername }}
          <Earth :size="14" color="#65676b" v-if="post.visibility === POST_VISIBILITY.PUBLIC"/>
          <Users v-if="post.visibility === POST_VISIBILITY.FOLLOWERS" :size="14" color="#65676b"/>
          <Lock :size="14" color="#65676b" v-if="post.visibility === POST_VISIBILITY.PRIVATE"/>
        </div>
        <div class="post_time">{{ formatDate(post.createdAt) }}</div>
      </div>
      <div class="post_options" v-if="post.authorId !== authStore.user?.userId">
        <Bookmark 
        :size="22"
        :color="post.isBookmarked ? '#dbea10': '#65676b'"
        @click="handleToggleBookmark(post)"
        />
      </div>
      <div class="post_options" v-if="post.authorId === authStore.user?.userId">
        <Ellipsis 
        :size="22"
        :color="'#65676b'"
        
        />
      </div>
    </div>

    <div class="post_body-text">
      <h3 class="post_title">{{ post.title }}</h3>
      <div class="post_summary" v-html="post.detail.description"></div>
      <div class="post_tags">
        <span v-for="tag in post.tags" :key="tag.id">#{{ tag.name }}</span>
      </div>
    </div>

    <div class="post_media" v-if="post.detail && post.detail.pipelineContent !== undefined">
      <div class="code-editor-container">
        <div class="code-header">
          <span>.yaml</span>
          <div style="display: flex; gap: 12px;align-items: center;">
            <div  @click="handleSaveCode">
              <Save :size="24"/>
            </div>
            <div  @click="handleEditCode">
              <SquarePen :size="24"/>
            </div>
          </div>
        </div>
        
        <VueMonacoEditor
          v-model:value="editableCode"
          theme="vs-dark"
          language="yaml"
          height="500px"
          :options="editorOptions"
        />
        
      </div>
    </div>

    <div class="post_footer">
      <div class="post_metrics">
        <div class="metrics-left">
          <div class="post_actions">
            <div class="action-btn">
              <ThumbsUp 
              :size="20"
              :color="post.isLiked ? '#3b82f6' : '#65676b'"
              @click="handleToggleLike(post)"
              />
              <span>{{ post.likeCount }}</span>
            </div>
            <div class="action-btn" @click="emit('openComment', post.id)">
              <MessageSquare :size="20"/>
              <span>{{ post.commentCount }}</span>
            </div>
          </div>
        </div>
        <div class="metrics-right">
          <span>{{ post.viewCount }} lượt xem</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'
import { MessageSquare, ThumbsUp,  Earth, Users,Bookmark,Lock, Ellipsis, Save,SquarePen } from 'lucide-vue-next';
import defaultAvatar from '@/assets/img/user_default.png'
import {  POST_VISIBILITY } from '@/common/enums';
import { bookmarkPostApi, unbookmarkPostApi, likePostApi, unlikePostApi } from '@/api/modules/app.api';
import { formatDate, formatTime } from '@/utils/format'
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore()

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['openComment'])

const editableCode = ref(props.post.detail?.pipelineContent || '')

const editorOptions = {
  automaticLayout: true,
  minimap: { enabled: false },
  fontSize: 14,
  wordWrap: 'on',
  readOnly: true,
  scrollBeyondLastLine: false,
}

const handleSaveCode = () => {
  console.log("Code mới sẽ được lưu là:\n", editableCode.value)
  alert('Đã lưu code! Xem trong console.')
}

const handleEditCode = () => {
  editorOptions.readOnly = false;
}

const handleToggleBookmark = async (post) => {
  try {
    if (post.isBookmarked) {
      await unbookmarkPostApi(post.id);
      post.isBookmarked = false;
      post.bookmarkCount--;
    } else {
      await bookmarkPostApi(post.id);
      post.isBookmarked = true;
      post.bookmarkCount++;
    }
  } catch (error) {
    console.error("Lỗi khi thao tác bookmark:", error);
  }
}

const handleToggleLike = async (post) => {
  try {
    if (post.isLiked) {
      await unlikePostApi(post.id);
      post.isLiked = false;
      post.likeCount--;
    } else {
      await likePostApi(post.id);
      post.isLiked = true;
      post.likeCount++;
    }
  } catch (error) {
    console.error("Lỗi khi thao tác like:", error);
  }
}
</script>

<style scoped>

.code-editor-container {
  border-top: 1px solid #ced0d4;
  border-bottom: 1px solid #ced0d4;
  background-color: #1e1e1e;
}
.code-header {
  background-color: #2d2d2d;
  color: #d4d4d4;
  padding: 8px 16px;
  font-size: 13px;
  border-bottom: 1px solid #404040;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>