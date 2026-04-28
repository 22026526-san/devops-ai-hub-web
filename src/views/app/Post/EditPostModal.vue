<template>
    <div v-if="isOpen">
        <CreatePostPipeline v-if="post?.postType === 'Pipeline'" :postData="post" @close="handleClose" @submitEditPipeline="handleEdit"/>
        <CreatePostQuestion v-else :postData="post" @close="handleClose" @submitEditQuestion="handleEdit"/>
    </div>
    <LoadingPage v-if="appStore.appLoading"/>
</template>

<script setup>
import { useAppStore } from '@/stores/app.store'
import { updatePostApi } from '@/api/modules/app.api'
import CreatePostPipeline from '@/views/components/CreatePostPipeline.vue'
import CreatePostQuestion from '@/views/components/CreatePostQuestion.vue'
import LoadingPage from '@/components/LoadingPage.vue'



const props = defineProps({
    isOpen: Boolean,
    post: Object,
})

const emit = defineEmits(['close','refreshComments'])
const appStore = useAppStore()
const handleClose = () => {
    emit('close')
}

const handleEdit = async (data) => {
    appStore.setAppLoading(true)
    try {
         await updatePostApi(props.post?.id, data)
    } catch (error) {
        console.log(error)
    } finally {
        emit('refreshComments')
        appStore.setAppLoading(false)
    }
}
</script>

<style scoped>
</style>