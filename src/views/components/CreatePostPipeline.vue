<script setup>
import { ref, reactive, onMounted,computed ,watch} from 'vue';
import {
    X,
    Code2,
    ChevronDown,
    Trash2,
    Save,
    Tags,
    Upload
} from 'lucide-vue-next';
import { VueMonacoEditor } from '@guolao/vue-monaco-editor';
import TiptapEditor from '@/views/components/TiptapEditor.vue';
import { POST_VISIBILITY } from '@/common/enums';
import { useAuthStore } from '@/stores/auth.store';
import defaultAvatar from '@/assets/img/user_default.png';
import { useAppStore } from '@/stores/app.store'
import { getTagsApi, createPipelinePostApi } from '@/api/modules/app.api'

const appStore = useAppStore()
const authStore = useAuthStore()
const topics = ref([]);
const fileInputRef = ref(null);
const selectedVisibility = ref(POST_VISIBILITY.PUBLIC);
const isEditMode = computed(() => !!props.postData);

const props = defineProps({
    postData: {
        type: Object,
        default: null
    }
});

const form = reactive({
    title: '',
    description: '',
    content: '',
    tagIds: [],
    visibility: selectedVisibility.value,
    changelog: 'Initial version',
});

const emit = defineEmits(['close', 'refreshPosts','submitEditPipeline',]);

const showCodeEditor = ref(false);

const showTagSelector = ref(true);

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

const MONACO_OPTIONS = {
    automaticLayout: true,
    formatOnPaste: true,
    fontSize: 14,
    scrollBeyondLastLine: false,
};
const codeLanguage = ref('yaml');

const closeModal = () => {
    emit('close');
};

const RefreshPosts = () => {
    emit('refreshPosts');
};

const toggleCodeEditor = () => {
    showCodeEditor.value = !showCodeEditor.value;
};


const removeCode = () => {
    form.content = '';
    showCodeEditor.value = false;
};

const triggerFileUpload = () => {
    if (fileInputRef.value) {
        fileInputRef.value.click();
    }
};

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();


    reader.onload = (e) => {
        form.content = e.target.result;
    };

    reader.readAsText(file);

    event.target.value = '';
};

const handleSubmitEdit = () => {
    const formData = new FormData();

    if (form.changelog) {
        formData.append('Changelog', form.changelog);
    }

    formData.append('Title', form.title);
    formData.append('Visibility', selectedVisibility.value);
    
    if (form.description) {
        formData.append('PipelineDescription', form.description); 
    }
    if (form.content) {
        formData.append('PipelineContent', form.content); 
    }

    form.tagIds.forEach((tagId, index) => {
        formData.append(`TagIds[${index}]`, tagId);
    });

    emit('submitEditPipeline', formData);
}

const handleSubmit = async () => {

    try {
        await createPipelinePostApi(form);
    } catch (error) {
        console.error("Lỗi khi tạo bài viết:", error);
        alert('Có lỗi xảy ra khi tạo bài viết. Vui lòng thử lại.');
    } finally { 
        closeModal();
        RefreshPosts();
    }
}

watch(
    () => props.postData,
    (newData) => {
        if (newData) {
            form.title = newData.title || '';
            selectedVisibility.value = newData.visibility || POST_VISIBILITY.PUBLIC;
            form.visibility = selectedVisibility.value;
            
            form.description = newData.detail?.description || '';
            form.content = newData.detail?.pipelineContent || '';
            
            if (form.content) {
                showCodeEditor.value = true;
            }

            if (newData.tags && Array.isArray(newData.tags)) {
                form.tagIds = newData.tags.map(t => t.id);
            } else {
                form.tagIds = [];
            }
            console.log(newData)
        }
    },
    { immediate: true }
);
</script>

<template>
    <Teleport to="body">
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Tạo bài viết mới</h3>
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
                        <TiptapEditor v-model="form.description" :placeholder="`Hãy thêm mô tả cho pipeline...`" />
                    </div>

                    <div v-if="showCodeEditor" class="code-editor-area">
                        <div class="code-editor-header">
                            <div class="code-editor-actions">
                                <div style="display: flex;gap: 8px;align-items: center;">
                                    <button @click="triggerFileUpload" class="action-btn" title="Tải file từ máy tính">
                                        <Upload class="icon-small" style="color: aliceblue;" />
                                    </button>
                                    <input type="file" ref="fileInputRef" @change="handleFileChange"
                                        accept=".yaml,.yml,.json,.js,.txt" style="display: none;" />
                                    <span style="color: aliceblue;">.yaml</span>
                                </div>
                                <button @click="removeCode" class="action-btn">
                                    <Trash2 class="icon-small" style="color: aliceblue;" />
                                </button>
                            </div>
                        </div>
                        <div class="monaco-wrapper">
                            <VueMonacoEditor v-model:value="form.content" :language="codeLanguage" theme="vs-dark"
                                :options="MONACO_OPTIONS" height="360px" />
                        </div>
                    </div>
                </div>

                <div class="add-to-post-toolbar">
                    <span>Thêm vào bài viết của bạn</span>
                    <div class="toolbar-icons">
                        <button @click="toggleTagSelector">
                            <Tags class="icon green" />
                        </button>

                        <button @click="toggleCodeEditor">
                            <Code2 class="icon cyan" />
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
    border-radius: 8px;
    padding: 4px 8px;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 6px;
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

.code-editor-area {
    padding: 0 15px;
    margin-bottom: 10px;
}

.code-editor-header {
    background-color: #2f2f2f;
    padding: 8px 12px;
    border-bottom: none;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

.code-editor-header h4 {
    margin: 0;
    font-size: 0.9rem;
    flex-grow: 1;
}

.icon-code-status.success {
    color: #28a745;
}

.code-editor-actions {
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: space-between;
}

.language-select {
    padding: 4px;
    font-size: 0.8rem;
    border-radius: 4px;
}

.remove-btn {
    background: transparent;
    border: 1px solid #dc3545;
    color: #dc3545;
    border-radius: 4px;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
}

.remove-btn:hover {
    background-color: #dc3545;
    color: white;
}

.monaco-wrapper {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    overflow: hidden;
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

/* Đánh dấu mục đang được chọn */
.visibility-dropdown-menu li.active {
  background-color: #e0f2fe;
  color: #0284c7;
  font-weight: 500;
}
</style>