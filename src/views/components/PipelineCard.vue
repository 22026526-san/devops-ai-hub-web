<template>
  <div class="post_card">
    <div class="post_header">
      <div class="user-avatar-wrapper" @click="handleInfo(post.authorId)">
        <img :src="post.authorImage ? post.authorImage : defaultAvatar" alt="User Avatar" class="user-avatar" />
      </div>
      <div class="post_user-info">
        <div class="post_name">
          {{ post.authorUsername }}
          <Earth :size="14" color="#65676b" v-if="post.visibility === POST_VISIBILITY.PUBLIC" />
          <Users v-if="post.visibility === POST_VISIBILITY.FOLLOWERS" :size="14" color="#65676b" />
          <Lock :size="14" color="#65676b" v-if="post.visibility === POST_VISIBILITY.PRIVATE" />
        </div>
        <div class="post_time">{{ formatDateTime(post.createdAt) }}</div>
      </div>
      <div class="post_options" v-if="post.authorId !== authStore.user?.userId">
        <Bookmark :size="22" :color="post.isBookmarked ? '#dbea10' : '#65676b'" @click="handleToggleBookmark(post)" />
      </div>
      <div class="options_wrapper" v-if="post.authorId === authStore.user?.userId">
        <Ellipsis :size="22" :color="'#65676b'" @click.stop="showOptions = !showOptions" />
        <div v-if="showOptions" class="dropdown-menu">
          <div class="dropdown-item" @click.stop="handleEditPost">
            <Pen class="icon-sm" />
            Chỉnh sửa
          </div>
          <div class="dropdown-item" @click.stop="handleDeletePost">
            <Trash2 class="icon-sm" />
            Xóa
          </div>
        </div>
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
          <div class="header-left">
            <select v-model="versionId" class="custom-select version-select">
              <option v-for="v in postVersionData" :key="v.id" :value="v.id">
                Version {{ v.versionNumber }}
              </option>
            </select>
            <span>.yaml</span>
          </div>

          <div class="header-right">
            <div @click="handleSaveCode" v-if="isSaveCode" class="action-icon">
              <Save :size="24" />
            </div>
            <div @click="handleEditCode" v-if="authStore.user.userId === appStore.idProfile && !isSaveCode"
              class="action-icon">
              <SquarePen :size="24" />
            </div>
          </div>
        </div>

        <VueMonacoEditor v-model:value="editableCode" theme="vs-dark" language="yaml" height="500px"
          :options="editorOptions" />

      </div>
    </div>

    <div class="post_footer">
      <div class="post_metrics">
        <div class="metrics-left">
          <div class="post_actions">
            <div class="action-btn">
              <ThumbsUp :size="20" :color="post.isLiked ? '#3b82f6' : '#65676b'" @click="handleToggleLike(post)" />
              <span>{{ post.likeCount }}</span>
            </div>
            <div class="action-btn" @click="emit('openComment', post.id)">
              <MessageSquare :size="20" />
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
import { onMounted, ref, watch } from 'vue'
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'
import { MessageSquare, ThumbsUp, Earth, Users, Bookmark, Lock, Ellipsis, Save, SquarePen, Trash2, Pen } from 'lucide-vue-next';
import defaultAvatar from '@/assets/img/user_default.png'
import { POST_VISIBILITY } from '@/common/enums';
import { bookmarkPostApi, unbookmarkPostApi, likePostApi, unlikePostApi, getPipelineVersionsApi,getPipelineVersionByIdApi } from '@/api/modules/app.api';
import { formatDateTime, formatTime } from '@/utils/format'
import { useAuthStore } from '@/stores/auth.store';
import { useAppStore } from '@/stores/app.store';
import { useRouter } from 'vue-router';

const authStore = useAuthStore()
const appStore = useAppStore()
const router = useRouter()
const isSaveCode = ref(false);
const showOptions = ref(false);

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['openComment', 'editPost', 'deletePost'])

const editableCode = ref(props.post.detail?.pipelineContent)

watch(
  () => props.post.detail?.pipelineContent,
  (newContent) => {
    editableCode.value = newContent;
  }
)

const editorOptions = {
  automaticLayout: true,
  minimap: { enabled: false },
  fontSize: 14,
  wordWrap: 'on',
  readOnly: true,
  scrollBeyondLastLine: false,
}

const postVersionData = ref(null)
const versionId = ref(null)
const versionData = ref(null)

const fetchPostVersion = async () => {
    try {
        const response = await getPipelineVersionsApi(props.post.id)
        postVersionData.value = response.data
        versionId.value = response.data[0].id
    } catch (error) {
        console.error('Error fetching post version:', error)
    }
}

onMounted(()=> {fetchPostVersion()})

const fetchPipelineVersion = async () => {
    try {
        const response = await getPipelineVersionByIdApi(versionId.value)
        versionData.value = response.data
    } catch (error) {
        console.error('Error fetching post version:', error)
    }
}

watch(()=>versionId.value, 
(newId)=> {
  if (newId) {
    fetchPipelineVersion()
  }
},{immediate:true})

watch(
  () => versionData.value?.content,
  (newContent) => {
    if (newContent) {
      editableCode.value = newContent;
    }
  }
);
const handleSaveCode = () => {
  console.log("Code mới sẽ được lưu là:\n", editableCode.value)
  alert('Đã lưu code! Xem trong console.')
  isSaveCode.value = false;
}

const handleEditCode = () => {
  editorOptions.readOnly = false;
  isSaveCode.value = true
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

const handleInfo = (id) => {
  appStore.fillTitle = ''
  appStore.idProfile = id
  router.push({
    name: 'profile',
    query: { id: id }
  })
}

const handleEditPost = () => {
  showOptions.value = false;
  emit('editPost', props.post);
};


const handleDeletePost = () => {
  showOptions.value = false;
  emit('deletePost', props.post.id);
};
</script>

<style scoped>
.code-editor-container {
  border-top: 1px solid #ced0d4;
  border-bottom: 1px solid #ced0d4;
  background-color: #1e1e1e;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2f2f2f; 
  padding: 8px 12px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #e2e8f0;
  font-weight: 500;
}

.header-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.action-icon {
  cursor: pointer;
  color: #e2e8f0;
  transition: color 0.2s;
  display: flex;
  align-items: center;
}

.action-icon:hover {
  color: #3b82f6;
}


.version-select {
  background-color: #3f3f46;
  color: #ffffff;
  border: 1px solid #52525b;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 13px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}

.version-select:hover {
  border-color: #71717a;
}

.options_wrapper {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 58%;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #ced0d4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  width: 160px;
  z-index: 100;
  overflow: hidden;
}

.dropdown-item {
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #050505;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f2f2f2;
}

.icon-sm {
  height: 16px;
  width: 16px;
}
</style>