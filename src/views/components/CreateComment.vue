<template>
    <div class="modal-comment">
        
        <div v-if="previewUrl" class="image-preview-container">
            <img :src="previewUrl" alt="Preview" class="image-preview" />
            <button class="remove-image-btn" @click="removeImage">✕</button>
        </div>

        <div class="comment-input-wrapper">
            <img :src="authStore.user?.avatarUrl ? authStore.user.avatarUrl : defaultAvatar" alt="My Avatar"
                class="my-avatar" />
            <div class="input-box">
                <textarea placeholder="Hãy để lại bình luận về bài viết..." v-model="newComment"
                    @keydown.enter.prevent="handleSubmit"></textarea>
                
                <div class="input-actions">
                    <input 
                        type="file" 
                        ref="fileInputRef" 
                        accept="image/*" 
                        style="display: none" 
                        @change="handleFileChange" 
                    />
                    
                    <Image :size="18" color="#65676b" class="cursor-pointer" @click="triggerFileInput" />
                    
                    <Send :size="18" color="#0084ff" class="cursor-pointer" @click="handleSubmit" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Image, Send } from 'lucide-vue-next'
import defaultAvatar from '@/assets/img/user_default.png'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()

const newComment = defineModel({ type: [String], default: '' })

const emit = defineEmits(['submitComment'])

const fileInputRef = ref(null)
const selectedImage = ref(null)
const previewUrl = ref(null)

const triggerFileInput = () => {
    if (fileInputRef.value) {
        fileInputRef.value.click()
    }
}


const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        selectedImage.value = file
        previewUrl.value = URL.createObjectURL(file) 
    }
    event.target.value = ''
}


const removeImage = () => {
    selectedImage.value = null
    if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value)
        previewUrl.value = null
    }
}


const handleSubmit = () => {
    if (newComment.value.trim() === '' && !selectedImage.value) return

    emit('submitComment', selectedImage.value)
    
    removeImage()
}
</script>

<style scoped>
.modal-comment {
    padding: 12px 16px;
    border-top: 1px solid #ced0d4;
    background-color: white;
}
.comment-input-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
}

.my-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
}

.input-box {
  flex: 1;
  background-color: #f0f2f5;
  border-radius: 20px;
  display: flex;
  align-items: flex-end;
  padding: 8px 12px;
}

.input-box textarea {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 15px;
  color: #050505;
  font-family: inherit;
  resize: none; 
  overflow-y: auto; 
  padding: 0;
  margin: 0;
  line-height: 1.4;
  max-height: 120px;
}

.input-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 2px; 
  padding-left: 8px;
}

.cursor-pointer {
    cursor: pointer;
}
.image-preview-container {
    position: relative;
    margin-left: 44px; 
    margin-bottom: 8px;
    display: inline-block;
    width: fit-content;
}
.image-preview {
    max-height: 100px;
    border-radius: 8px;
    border: 1px solid #ced0d4;
    display: block;
}
.remove-image-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ffffff;
    color: #65676b;
    border: 1px solid #ced0d4;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
.remove-image-btn:hover { background: #f0f2f5; }
</style>