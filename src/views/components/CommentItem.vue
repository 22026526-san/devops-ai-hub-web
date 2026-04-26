<template>
    <div class="comment-wrapper">
        <div class="comment-main">
            <div class="comment-avatar">
                <img :src="comment.authorAvatarUrl || defaultAvatar" alt="Avatar" />
            </div>

            <div class="comment-content-area">
                <div class="comment-bubble" v-if="!showEditInput && comment.content">
                    <span class="comment-author">{{ comment.authorUsername }}</span>
                    <span class="comment-text">{{ comment.content }}</span>
                </div>

                <div v-if="comment.imgUrl && !showEditInput" class="image-preview-container" @click="handleOpenImage(comment.imgUrl)">
                    <img :src="comment.imgUrl" alt="Preview" class="image-preview" />
                </div>

                <CreateComment v-if="showEditInput" @submitComment="submitEdit" v-model="newEdit" />

                <div class="comment-actions" v-if="!showEditInput">
                    <span class="action-time">{{ formatDate(comment.createdAt) }}</span>
                    <span class="action-reply font-bold" @click="showReplyInput = !showReplyInput">Trả lời</span>
                    <span class="action-reply font-bold" v-if="authStore.user?.userId === comment.authorId"
                        @click="toggleEdit">Chỉnh sửa</span>
                    <span class="action-reply font-bold"
                        v-if="authStore.user?.userId === comment.authorId || authStore.user?.userId === authorId"
                        @click="$emit('deleteComment', comment.id)">Xóa</span>
                </div>

                <CreateComment v-if="showReplyInput" @submitComment="submitReply" v-model="newReply" />
            </div>
        </div>

        <div class="comment-replies" v-if="comment.replies && comment.replies.length > 0">
            <CommentItem v-for="reply in visibleReplies" :key="reply.id" :comment="reply" :authorId="authorId"
                @sendReply="$emit('sendReply', $event)" @editComment="$emit('editComment', $event)"
                @deleteComment="$emit('deleteComment', $event)" />

            <div v-if="!showAll && remainingCount > 0" class="show-more-btn font-bold" @click="showAll = true">
                <span class="reply-curve"></span> Xem thêm {{ remainingCount }} phản hồi
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import defaultAvatar from '@/assets/img/user_default.png'
import { formatDate } from '@/utils/format'
import { useAuthStore } from '@/stores/auth.store'
import CreateComment from './CreateComment.vue'


const authStore = useAuthStore()

const props = defineProps({
    comment: { type: Object, required: true },
    authorId: { type: String, required: true }
})

const emit = defineEmits(['sendReply', 'editComment', 'deleteComment'])


const showReplyInput = ref(false)
const newReply = reactive({
    content: null,
    imageFile: null,
    parentId: props.comment.id
})
const showEditInput = ref(false)
const newEdit = reactive({
    content: props.comment.content,
    imageFile: props.comment.imgUrl ? props.comment.imgUrl : null,
    commentId: props.comment.id
})
const showAll = ref(false)

const INITIAL_VISIBLE = 2
const visibleReplies = computed(() => showAll.value ? props.comment.replies : (props.comment.replies?.slice(0, INITIAL_VISIBLE) || []))
const remainingCount = computed(() => Math.max(0, (props.comment.replies?.length || 0) - INITIAL_VISIBLE))

const toggleEdit = () => {
    showEditInput.value = !showEditInput.value
    newEdit.imageFile = props.comment.imgUrl ? props.comment.imgUrl : null
    showReplyInput.value = false
}

const submitEdit = () => {
    emit('editComment', newEdit)
    showEditInput.value = false
}

const submitReply = () => {
    emit('sendReply', newReply)
    showReplyInput.value = false
    newReply.value = ''
}

const handleOpenImage = (url) => {
    if (!url) return;
    window.open(url, '_blank');
}
</script>

<style scoped>
.comment-wrapper {
    margin-bottom: 12px;
}

.comment-main {
    display: flex;
    gap: 8px;
}

.comment-avatar img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
}

.comment-content-area {
    flex: 1;
    max-width: calc(100% - 40px);
}

.comment-bubble {
    background-color: #f0f2f5;
    border-radius: 18px;
    padding: 8px 12px;
    display: inline-block;
    max-width: 100%;
    word-wrap: break-word;
}

.comment-author {
    font-weight: 600;
    font-size: 13px;
    color: #050505;
    display: block;
    margin-bottom: 2px;
}

.comment-text {
    font-size: 15px;
    color: #050505;
    white-space: pre-wrap;
}

.comment-actions {
    display: flex;
    gap: 12px;
    margin-top: 4px;
    margin-left: 12px;
    font-size: 12px;
    color: #65676b;
    align-items: center;
}

.action-reply {
    cursor: pointer;
}

.action-time,
.action-reply {
    font-size: 11px;
    color: #65676b;
}

.font-bold {
    font-weight: 600;
}

.comment-replies {
    margin-left: 40px;
    margin-top: 8px;
    position: relative;
}

.comment-replies::before {
    content: "";
    position: absolute;
    top: -20px;
    left: -20px;
    width: 16px;
    height: 30px;
    border-left: 2px solid #f0f2f5;
    border-bottom: 2px solid #f0f2f5;
    border-bottom-left-radius: 10px;
}


.show-more-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
    font-size: 14px;
    color: #65676b;
    cursor: pointer;
    position: relative;
}

.show-more-btn:hover {
    text-decoration: underline;
}

.action-reply:hover {
    text-decoration: underline;
}

.reply-curve {
    display: inline-block;
    width: 24px;
    height: 16px;
    border-left: 2px solid #ced0d4;
    border-bottom: 2px solid #ced0d4;
    border-bottom-left-radius: 10px;
    margin-top: -12px;
}

.image-preview-container {
    margin-top: 4px;
    margin-bottom: 4px;
    display: block;
}


.image-preview {
    max-width: 160px;
    max-height: 120px;
    width: auto;
    height: auto;
    border-radius: 12px;
    border: 1px solid #e4e6eb;
    display: block;
}
</style>