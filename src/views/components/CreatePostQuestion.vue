<script setup>
import { ref, reactive, onMounted , computed,watch} from 'vue';
import {
    X,
    ChevronDown,
    Save,
    Tags,
    Image
} from 'lucide-vue-next';
import TiptapEditor from '@/views/components/TiptapEditor.vue';
import { POST_VISIBILITY } from '@/common/enums';
import { useAuthStore } from '@/stores/auth.store';
import defaultAvatar from '@/assets/img/user_default.png';
import { useAppStore } from '@/stores/app.store'
import { getTagsApi } from '@/api/modules/app.api'
import {createQuestionPostApi} from '@/api/modules/app.api'


const appStore = useAppStore()
const authStore = useAuthStore()
const topics = ref([]);
const fileInputRef = ref(null);
const previewImageUrl = ref(null);
const selectedVisibility = ref(POST_VISIBILITY.PUBLIC);

const form = reactive({
    title: '',
    content: '',
    tagIds: [],
    visibility: selectedVisibility.value,
    Image: null,
});

const props = defineProps({
    postData: {
        type: Object,
        default: null 
    }
});

const emit = defineEmits(['close', 'refreshPosts','submitEditQuestion']);

const isEditMode = computed(() => !!props.postData);

watch(
    () => props.postData,
    (newData) => {
        if (newData) {
            form.title = newData.title || '';
            form.content = newData.detail?.content || ''; 
            selectedVisibility.value = newData.visibility;
            form.visibility = selectedVisibility.value;
            
            if (newData.tags && Array.isArray(newData.tags)) {
                 form.tagIds = newData.tags.map(t => t.id);
            } else {
                 form.tagIds = [];
            }

            if (newData.detail?.imgUrl) {
                previewImageUrl.value = newData.detail.imgUrl;
                form.Image = newData.detail.imgUrl;
            }
        }
    },
    { immediate: true }
);

const showTagSelector = ref(true);

const toggleTagSelector = () => {
    showTagSelector.value = !showTagSelector.value;
};

const toggleTag = (tagId) => {
    const index = form.tagIds.indexOf(tagId);
    if (index === -1) {
        form.tagIds.push(tagId);
    } else {
        form.tagIds.splice(index, 1);
    }
};

const fetchTopics = async () => {
    appStore.setAppLoading(true)
    try {
        const response = await getTagsApi()
        topics.value = response.data
        console.log('Tags đã tải về:', topics.value)
    } catch (error) {
        console.error('Lỗi khi tải topics:', error)
    } finally {
        appStore.setAppLoading(false)
    }
}

onMounted(() => {
    fetchTopics()
})

const closeModal = () => {
    emit('close');
};

const RefreshPosts = () => {
    emit('refreshPosts');
}

const triggerImageUpload = () => {
    if (fileInputRef.value) {
        fileInputRef.value.click();
    }
};

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    form.Image = file;

    if (file.type.startsWith('image/')) {
        previewImageUrl.value = URL.createObjectURL(file);
    }

    event.target.value = '';
};

const removeAttachment = () => {
    if (previewImageUrl.value) {
        URL.revokeObjectURL(previewImageUrl.value);
    }
    previewImageUrl.value = null;
    form.Image = null;
};

const showVisibilityMenu = ref(false);

const visibilityOptions = [
    { value: POST_VISIBILITY.PUBLIC, label: 'Công khai' },
    { value: POST_VISIBILITY.FOLLOWERS, label: 'Người theo dõi' },
    { value: POST_VISIBILITY.PRIVATE, label: 'Chỉ mình tôi' },
];

const selectVisibility = (value) => {
    selectedVisibility.value = value;
    showVisibilityMenu.value = false;
};

const currentVisibilityLabel = computed(() => {
    const option = visibilityOptions.find(opt => opt.value === selectedVisibility.value);
    return option ? option.label : 'Công khai';
});

const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('Title', form.title);
    formData.append('Content', form.content);
    formData.append('Visibility', form.visibility);
    form.tagIds.forEach((tagId, index) => {
        formData.append(`TagIds[${index}]`, tagId); 
    });
    formData.append('Image', form.Image);
    try {
        await createQuestionPostApi(formData);
    } catch (error) {
        console.error('Lỗi khi tạo bài viết:', error);
    } finally {
        closeModal();
        RefreshPosts();
    }
}
const handleSubmitEdit = () => {
    console.log(form)
    const formData = new FormData();

    formData.append('Title', form.title);
    formData.append('QuestionContent', form.content); 
    formData.append('Visibility', form.visibility);
    
    form.tagIds.forEach((tagId, index) => {
        formData.append(`TagIds[${index}]`, tagId); 
    });
    
    if (form.Image) {
        formData.append('QuestionImage', form.Image); 
    }
    emit('submitEditQuestion', formData); 
}
</script>

<template>
    <Teleport to="body">
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>{{isEditMode ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}}</h3>
                    <button class="close-btn" @click="closeModal" title="Đóng">
                        <X class="icon" />
                    </button>
                </div>

                <div class="user-info">
                    <div class="user-avatar-wrapper">
                        <img :src="authStore.user?.avatarUrl ? authStore.user.avatarUrl : defaultAvatar"
                            alt="User Avatar" class="user-avatar " />
                    </div>
                    <div class="user-details">
                        <h4>{{ authStore.user?.fullName }}</h4>
                        <div class="visibility-wrapper" style="position: relative;">
                            <button class="visibility-selector" @click="showVisibilityMenu = !showVisibilityMenu">
                                <span>{{ currentVisibilityLabel }}</span>
                                <ChevronDown class="icon-small" />
                            </button>

                            <ul v-if="showVisibilityMenu" class="visibility-dropdown-menu">
                                <li v-for="option in visibilityOptions" :key="option.value"
                                    @click="selectVisibility(option.value)"
                                    :class="{ 'active': selectedVisibility === option.value }">
                                    {{ option.label }}
                                </li>
                            </ul>

                        </div>
                    </div>
                </div>

                <div class='modal-body'>
                    <div v-if="showTagSelector" class="tag-selector-area">
                        <div class="tag-header">
                            <Tags class="icon-small green" />
                            <h4>Chọn chủ đề cho bài viết ({{ form.tagIds.length }} đã chọn)</h4>
                        </div>
                        <div class="tag-list">
                            <button v-for="tag in topics" :key="tag.id" class="tag-pill"
                                :class="{ 'tag-selected': form.tagIds.includes(tag.id) }" @click="toggleTag(tag.id)">
                                #{{ tag.name }}
                            </button>
                        </div>
                    </div>

                    <div class="title-input-group">
                        <input v-model="form.title" type="text" class="input-title"
                            placeholder="Tiêu đề pipeline của bạn ..." />
                    </div>

                    <div class="main-input-area">
                        <TiptapEditor v-model="form.content" :placeholder="`Bạn đang nghĩ gì?`" />
                    </div>

                    <div v-if="previewImageUrl || form.Image" class="attachment-preview-area">
                        <div v-if="previewImageUrl" class="image-preview-wrapper">
                            <img :src="previewImageUrl" alt="Preview" class="preview-image" />
                            <button @click="removeAttachment" class="remove-attachment-btn" title="Gỡ bỏ ảnh">
                                <X class="icon-small" />
                            </button>
                        </div>

                        <div v-else-if="form.Image" class="file-preview-wrapper">
                            <button @click="removeAttachment" class="remove-attachment-btn" title="Gỡ bỏ file">
                                <X class="icon-small" />
                            </button>
                        </div>
                    </div>

                </div>

                <div class="add-to-post-toolbar">
                    <span>Thêm vào bài viết của bạn</span>
                    <div class="toolbar-icons">
                        <button @click="toggleTagSelector">
                            <Tags class="icon green" />
                        </button>

                        <button @click="triggerImageUpload">
                            <Image class="icon green" />
                            <input type="file" ref="fileInputRef" @change="handleFileChange" accept=".png,.jpg,.jpeg"
                                style="display: none;" />
                        </button>
                    </div>
                </div>

                <div class="submit-btn-wrapper">

                    <button class="submit-btn" @click="handleSubmitEdit" v-if="isEditMode">
                        <Save class="icon" />
                        Lưu bài viết
                    </button>
                    <button class="submit-btn" @click="handleSubmit" v-else>
                        <Save class="icon" />
                        Tạo Bài Viết
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    width: 680px;
    max-width: 90%;
    max-height: 90vh;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
}

.modal-body {
    flex-grow: 1;
    overflow-y: auto;
}

.modal-header {
    padding: 15px;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.1rem;
}

.close-btn {
    background: transparent;
    border: none;
    cursor: pointer;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 15px;
}

.user-details h4 {
    margin: 0;
    font-size: 1rem;
}

.visibility-selector {
    background-color: #f0f2f5;
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
}

.title-input-group {
    padding: 0 15px;
}

.input-title {
    width: 100%;
    padding: 8px 0;
    border-radius: 4px;
    outline: none;
    border: none;
    font-size: 15px;
}

.input-title:focus {
    outline: none;
    border-color: none;
}

.main-input-area {
    padding: 0 15px;
}


.add-to-post-toolbar {
    border: 1px solid #ddd;
    margin: 10px 15px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.add-to-post-toolbar span {
    font-size: 15px;
    font-weight: 500;
    margin-left: 8px;
}

.toolbar-icons {
    display: flex;
    gap: 5px;
}

.toolbar-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
}

.toolbar-btn:hover {
    background-color: #f0f2f5;
}

button {
    padding: 12px 8px;
}

.submit-btn-wrapper {
    padding: 15px;
    border-top: 1px solid #ddd;
    flex-shrink: 0;
}

.submit-btn {
    width: 100%;
    background-color: #1877f2;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.submit-btn:hover {
    background-color: #166fe5;
}

.user-avatar-wrapper {
    width: 42px;
    height: 42px;
}

.icon {
    width: 24px;
    height: 24px;
}

.icon-small {
    width: 18px;
    height: 18px;
}

.green {
    color: #45bd62;
}

.blue {
    color: #1877f2;
}

.yellow {
    color: #f7b928;
}

.red {
    color: #f3425f;
}

.purple {
    color: #b05cf2;
}

.cyan {
    color: #00cccc;
}

.tag-selector-area {
    padding: 10px 15px;
    background-color: #f8f9fa;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;
}

.tag-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
}

.tag-header h4 {
    margin: 0;
    font-size: 0.9rem;
    color: #65676b;
    font-weight: 600;
}

.tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    overflow-y: auto;
    max-height: 150px;
}

.tag-pill {
    background-color: white;
    border: 1px solid #ced4da;
    color: #495057;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.tag-pill:hover {
    background-color: #e9ecef;
}


.tag-pill.tag-selected {
    background-color: #e6f2ff;
    border-color: #1877f2;
    color: #1877f2;
}

.btn-active {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
}
.attachment-preview-area {
    padding: 10px 15px;
    margin-bottom: 10px;
}

.image-preview-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
    border-radius: 8px;
    border: 1px solid #ddd;
    overflow: hidden;
    background-color: #f8f9fa;
    text-align: center;
}

.preview-image {
    max-width: 100%;
    max-height: 300px; 
    display: block;
    object-fit: contain;
    margin: 0 auto;
}

.remove-attachment-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background-color: rgba(255, 255, 255, 0.9);
    border: 1px solid #ddd;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
}

.file-preview-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
    background-color: #f0f2f5;
    border-radius: 8px;
    border: 1px solid #ddd;
}
.visibility-wrapper {
  position: relative;
  display: inline-block;
}


.visibility-dropdown-menu {
  position: absolute;
  top: 100%; 
  left: 0;
  margin-top: 4px;
  padding: 8px 0;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  list-style: none;
  min-width: 150px;
  z-index: 50;
}

.visibility-dropdown-menu li {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: background-color 0.2s;
}

.visibility-dropdown-menu li:hover {
  background-color: #f3f4f6;
}

.visibility-dropdown-menu li.active {
  background-color: #e0f2fe;
  color: #0284c7;
  font-weight: 500;
}
</style>