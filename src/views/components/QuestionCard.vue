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
      <div class="options_wrapper">
        <Ellipsis :size="22" :color="'#65676b'" @click.stop="showOptions = !showOptions" style="cursor: pointer;"/>
        <div v-if="showOptions" class="dropdown-menu">
          <div class="dropdown-item" @click.stop="handleEditPost" v-if="post.authorId === authStore.user?.userId">
            <Pen class="icon-sm" />
            Chỉnh sửa
          </div>
          <div class="dropdown-item delete-text" @click.stop="handleDeletePost"
            v-if="post.authorId === authStore.user?.userId">
            <Trash2 class="icon-sm" />
            Xóa
          </div>
          <div class="dropdown-item delete-text" v-if="post.authorId !== authStore.user?.userId">
            <Flag class="icon-sm" />
            Báo cáo
          </div>
        </div>
      </div>
    </div>

    <div class="post_body-text">
      <h3 class="post_title">{{ post.title }}</h3>
      <div class="post_question-content" v-if="post.detail" v-html="post.detail.content"></div>
      <div class="post_tags">
        <span v-for="tag in post.tags" :key="tag.id">#{{ tag.name }}</span>
      </div>
    </div>

    <div class="post_media" v-if="post.detail && post.detail.imgUrl">
      <img :src="post.detail.imgUrl" alt="Ảnh đính kèm" class="post_image" />
    </div>

    <div class="post_footer">
      <div class="post_metrics">
        <div class="metrics-left">
          <div class="post_actions">
            <div class="action-btn" @click="handleToggleLike(post)">
              <ThumbsUp :size="20" :color="post.isLiked ? '#3b82f6' : '#65676b'" />
              <span>{{ post.likeCount }}</span>
            </div>
            <div class="action-btn" @click="emit('openComment', post.id)">
              <MessageSquare :size="20" />
              <span>{{ post.commentCount }}</span>
            </div>
            <div class="action-btn" @click="handleToggleBookmark(post)"
              v-if="post.authorId !== authStore.user?.userId">
              <Bookmark :size="22" :color="post.isBookmarked ? '#dbea10' : '#65676b'" />
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
import {
  MessageSquare,
  ThumbsUp,
  Earth,
  Users,
  Bookmark,
  Lock,
  Ellipsis,
  Pen,
  Trash2,
  Flag
} from "lucide-vue-next";
import { ref } from "vue";
import defaultAvatar from "@/assets/img/user_default.png";
import { POST_VISIBILITY } from "@/common/enums";
import {
  bookmarkPostApi,
  unbookmarkPostApi,
  likePostApi,
  unlikePostApi,
} from "@/api/modules/app.api";
import { formatDateTime, formatTime } from "@/utils/format";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app.store";

const authStore = useAuthStore();
const router = useRouter();
const appStore = useAppStore();
const showOptions = ref(false);

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["openComment", 'editPost', 'deletePost']);

const handleEditPost = () => {
  showOptions.value = false;
  emit('editPost', props.post);
};


const handleDeletePost = () => {
  showOptions.value = false;
  emit('deletePost', props.post.id);
};

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
};

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
};

const handleInfo = (id) => {
  appStore.fillTitle = "";
  appStore.idProfile = id;
  router.push({
    name: "profile",
    query: { id: id },
  });
};
</script>

<style scoped>
.post_question-content {
  margin-top: 8px;
  font-size: 15px;
  color: #1c1e21;
  white-space: pre-wrap;
  line-height: 1.5;
}

.post_image {
  width: 100%;
  height: auto;
  display: block;
  border-top: 1px solid #ced0d4;
  border-bottom: 1px solid #ced0d4;
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
  height: 18px;
  width: 18px;
}
</style>
