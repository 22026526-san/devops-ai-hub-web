<template>
    <Teleport to="body">
        <div class="modal-overlay" v-if="isOpen" @click.self="closeModal">
            <div class="modal-container">

                <div class="modal-header">
                    <h2 class="modal-title">Bài viết của {{ post?.authorUsername }}</h2>
                    <button class="close-btn" @click="closeModal">✕</button>
                </div>

                <div class="modal-body">
                    <component :is="post?.postType === 'Pipeline' ? PipelineCard : QuestionCard" :post="post"
                        class="no-margin-bottom" />

                    <div class="comments-section">
                        <CommentItem 
                            v-for="comment in comments" 
                            :key="comment.id" 
                            :comment="comment" 
                            :authorId="post.authorId" 
                            @sendReply="handleSendReply"
                            @editComment="handleEditComment"
                            @deleteComment="handleDeleteComment"
                        />
                    </div>
                </div>

                <CreateComment @submitComment="handleSendComment" v-model="newComment"/>

            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import QuestionCard from '@/views/components/QuestionCard.vue'
import PipelineCard from '@/views/components/PipelineCard.vue'
import CommentItem from '@/views/components/CommentItem.vue'
import CreateComment from '@/views/components/CreateComment.vue'
import { createCommentApi, replyCommentApi, updateCommentApi, deleteCommentApi } from '@/api/modules/app.api'



const props = defineProps({
    isOpen: Boolean,
    post: Object,
    comments: Array
})

const emit = defineEmits(['close','refreshComments'])

const newComment = ref('')

const closeModal = () => {
    emit('close')
}


const handleSendComment = async (imageFile) => {
    try {
        const formData = new FormData()

        formData.append('PostId', props.post.id)
       
        formData.append('Content', newComment.value)
        
        if (imageFile) {
            console.log('Attaching image to comment:', imageFile)
            formData.append('Image', imageFile)
        }
        await createCommentApi(formData)
        emit('refreshComments')
    } catch (error) {
        console.error('Error sending comment:', error)
     } finally {
        newComment.value = ''
     }
}


const handleSendReply = async ({ parentId, content, imageFile }) => {
    console.log('Replying to comment', parentId, 'with content:', content)
    try {
        const formData = new FormData()
        
        formData.append('Content', content)
        
        if (imageFile) {
            formData.append('Image', imageFile)
        }
        await replyCommentApi(parentId, formData)
    } catch (error) {
        console.error('Error sending reply:', error)
     } finally {
        emit('refreshComments')
     }
}


const handleEditComment = async ({ commentId, content, imageFile }) => {
    try {
        const formData = new FormData()
        
        formData.append('Content', content)
        
        if (imageFile) {
            formData.append('Image', imageFile)
        }
        await updateCommentApi(commentId, formData)
        emit('refreshComments')
    } catch (error) {
        console.error('Error editing comment:', error)
     } finally {
        emit('refreshComments')
     }
}


const handleDeleteComment = async (commentId) => {
    await deleteCommentApi(commentId)
    emit('refreshComments')
}

</script>

<style scoped>

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(244, 244, 244, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}


.modal-container {
    background-color: white;
    width: 100%;
    max-width: 680px;
    height: 90vh;
    border-radius: 8px;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.modal-header {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #ced0d4;
}

.modal-title {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
}

.close-btn {
    position: absolute;
    right: 16px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #e4e6eb;
    border: none;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
}

.close-btn:hover {
    background-color: #d8dadf;
}

/* BODY */
.modal-body {
    flex: 1;
    overflow-y: auto;
    /* Cho phép cuộn phần nội dung giữa */
    padding: 16px 0;
}

.no-margin-bottom {
    margin-bottom: 24px;
    border: none !important;
    box-shadow: none !important;
}

.comments-section {
    padding: 0 16px;
}

</style>