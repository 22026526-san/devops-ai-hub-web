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
import { reactive, ref,watch } from 'vue'
import QuestionCard from '@/views/components/QuestionCard.vue'
import PipelineCard from '@/views/components/PipelineCard.vue'
import CommentItem from '@/views/components/CommentItem.vue'
import CreateComment from '@/views/components/CreateComment.vue'
import { useAppStore } from '@/stores/app.store'
import { createCommentApi, replyCommentApi, updateCommentApi, deleteCommentApi, getPipelineVersionsApi } from '@/api/modules/app.api'



const props = defineProps({
    isOpen: Boolean,
    post: Object,
    comments: Array
})

const emit = defineEmits(['close','refreshComments'])
const appStore = useAppStore()
const newComment = reactive({
    content: '',
    imageFile: null
})
const postVersionData = ref(null)

const fetchPostVersion = async () => {
    try {
        const response = await getPipelineVersionsApi(props.post.id)
        postVersionData.value = response.data
    } catch (error) {
        console.error('Error fetching post version:', error)
    }
}

const closeModal = () => {
    emit('close')
}


const handleSendComment = async () => {
    appStore.setAppLoading(true)
    try {
        const formData = new FormData()

        formData.append('PostId', props.post.id)
       
        formData.append('Content', newComment.content)

        if (newComment.imageFile) {
            console.log('Attaching image to comment:', newComment.imageFile)
            formData.append('Image', newComment.imageFile)
        }
        await createCommentApi(formData)
    } catch (error) {
        console.error('Error sending comment:', error)
     } finally {
        newComment.content = ''
        newComment.imageFile = null
        emit('refreshComments')
        appStore.setAppLoading(false)
     }
}


const handleSendReply = async (commentReply) => {
    appStore.setAppLoading(true)
    try {
        const formData = new FormData()
        
        formData.append('Content', commentReply.content)
        
        if (commentReply.imageFile) {
            formData.append('Image', commentReply.imageFile)
        }
        await replyCommentApi(commentReply.parentId, formData)
    } catch (error) {
        console.error('Error sending reply:', error)
     } finally {
        emit('refreshComments')
        appStore.setAppLoading(false)
     }
}


const handleEditComment = async (commentEdit) => {
    appStore.setAppLoading(true)
    try {
        const formData = new FormData()
        
        formData.append('Content', commentEdit.content)
        
        if (commentEdit.imageFile) {
            formData.append('Image', commentEdit.imageFile)
        }
        await updateCommentApi(commentEdit.commentId, formData)
    } catch (error) {
        console.error('Error editing comment:', error)
     } finally {
        appStore.setAppLoading(false)
        emit('refreshComments')
     }
}


const handleDeleteComment = async (commentId) => {
    appStore.setAppLoading(true)
    try {
        await deleteCommentApi(commentId)
        emit('refreshComments')
    } catch (error) {
        console.error('Error deleting comment:', error)
    } finally {
        appStore.setAppLoading(false)
    }
}
watch(() => props.isOpen, (newVal) => {
    if (newVal === true && props.post?.postType === 'Pipeline') {
        fetchPostVersion()
    } else {
        postVersionData.value = null
    }
})
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