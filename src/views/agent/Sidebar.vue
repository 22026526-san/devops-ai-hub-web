<template>
    <div class="sidebar" :class="{ 'collapsed': isCollapsed }" @click.self="isSearching = false">

        <div>
            <div v-if="isSearching" class="search-wrapper">
                <BaseSearch v-model="searchMess" placeholder="Tìm kiếm chủ đề..." style="flex: 1;" />
            </div>
            <div v-else class="sidebar-header">
                <Menu class="icon-btn" size="20" @click="toggleSidebar" />
                <div class="icon-20 icon-lock" v-show="!isCollapsed" @click="isSearching = true"></div>
            </div>

        </div>

        <div class="new-chat-btn" @click="handleNewChat">
            <SquarePen size="20" />
            <span v-show="!isCollapsed" class="fade-text">Cuộc trò chuyện mới</span>
        </div>

        <div class="chat-history" v-show="!isCollapsed">
            <div class="history-title">Cuộc trò chuyện</div>
            <ul class="history-list">
                <li v-if="conversations.length === 0" class="empty-text">
                    Chưa có cuộc trò chuyện nào
                </li>

                <li v-for="chat in filteredConversations" :key="chat.id" class="history-item"
                    :class="{ active: aiStore.formChat.conversationId === chat.id }"
                    @click="selectChat(chat.id, chat.title)">
                    <div class="chat-title-wrapper">
                        <span v-if="editingId !== chat.id" class="chat-title-text">{{ chat.title }}</span>
                    </div>

                    <div class="dropdown-container">
                        <div class="more-options-btn" @click.stop="openMenu($event, chat)"
                            :class="{ 'menu-open': activeMenuChat?.id === chat.id }">
                            <MoreVertical size="18" />
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <Teleport to="body">
            <div v-if="activeMenuChat" class="custom-dropdown-menu" :style="menuPosition" @click.stop>
                <div class="dropdown-item" @click="startEditing(activeMenuChat)">
                    <Pencil size="16" /> Đổi tên
                </div>
                <div class="dropdown-item text-danger" @click="deleteChat(activeMenuChat.id)">
                    <Trash2 size="16" /> Xóa
                </div>
            </div>
        </Teleport>

        <Teleport to="body">
            <div v-if="isRenameModalOpen" class="rename-overlay" @click="closeRenameModal">

                <div class="rename-modal" @click.stop>
                    <div class="rename-title">Đổi tên cho cuộc trò chuyện này</div>

                    <input type="text" v-model="editTitleValue" class="rename-input-box" ref="renameInputRef"
                        @keydown.enter="confirmRename" />

                    <div class="rename-actions">
                        <button class="btn-text btn-cancel" @click="closeRenameModal">Huỷ</button>
                        <button class="btn-text btn-submit" :disabled="!isRenameValid" @click="confirmRename">
                            Đổi tên
                        </button>
                    </div>
                </div>

            </div>
        </Teleport>

        <div class="spacer" v-show="isCollapsed"></div>

        <div class="sidebar-footer">
            <div class="footer-item" @click="router.push('/home')">
                <div class="icon-wrapper">
                    <ArrowLeftFromLine size="18" />
                </div>
                <span v-show="!isCollapsed" class="fade-text">Quay lại diễn đàn</span>
            </div>
        </div>
        <ConfirmModal />
    </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount, computed } from 'vue';
import { Menu, SquarePen, ArrowLeftFromLine, MoreVertical, Pencil, Trash2 } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { getConversationsByUserIdApi, changeTitleMessagesApi, deleteMessagesApi } from '@/api/modules/ai.api.js'
import { useAiStore } from '@/stores/ai.store'
import { useAuthStore } from '@/stores/auth.store'
import { useConfirmStore } from '@/stores/confim.store';
import ConfirmModal from '@/views/components/ConfirmModal.vue';
import BaseSearch from '@/components/base/BaseSearch.vue';

const aiStore = useAiStore();
const authStore = useAuthStore();
const confirmStore = useConfirmStore();
const router = useRouter();
const isCollapsed = ref(false);
const conversations = ref([]);
const editingId = ref(null);
const editTitleValue = ref('');
const activeMenuChat = ref(null);
const menuPosition = ref({ top: '0px', left: '0px' });
const isRenameModalOpen = ref(false);
const renameInputRef = ref('');
const searchMess = ref('')
const isSearching = ref(false)
const filteredConversations = computed(() => {
  const keyword = searchMess.value.toLowerCase().trim()
  if (!keyword) return conversations.value

  return conversations.value.filter(chat => 
    chat.title.toLowerCase().includes(keyword)
  )
})

const openMenu = (event, chat) => {
    const rect = event.currentTarget.getBoundingClientRect();

    menuPosition.value = {
        top: `${rect.bottom + 4}px`,
        left: `${rect.right - 16}px`
    };

    activeMenuChat.value = chat;
    console.log(activeMenuChat.value.id, activeMenuChat)
};

const closeMenu = () => {
    activeMenuChat.value = null;
};

const isRenameValid = computed(() => {
    return editTitleValue.value.trim() !== '' &&
        editTitleValue.value !== activeMenuChat.value.title;
});

const emit = defineEmits(['new-chat']);

const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
};

const fetchMess = async () => {
    aiStore.aiLoading = true
    console.log(authStore.user?.userId)
    try {
        const response = await getConversationsByUserIdApi(authStore.user?.userId)
        conversations.value = response.data
        console.log(response.data)
    } catch (error) {
        console.error('Lỗi khi tải topics:', error)
    } finally {
        aiStore.aiLoading = false
    }
}

onMounted(() => {
    fetchMess()
    document.addEventListener('click', closeMenu);
})
onBeforeUnmount(() => {
    document.removeEventListener('click', closeMenu);
});

watch(() => aiStore.refreshSidebarTrigger, () => {
    fetchMess();
});

const selectChat = (id, title) => {
    aiStore.formChat.conversationId = id;
    aiStore.titleMess = title
};
const handleNewChat = () => {
    emit('new-chat');
};

const startEditing = async (chat) => {
    editingId.value = chat.id;
    editTitleValue.value = chat.title;
    isRenameModalOpen.value = true

    await nextTick();
    if (renameInputRef.value) {
        renameInputRef.value.focus();
        renameInputRef.value.select();
    }
};

const closeRenameModal = () => {
    isRenameModalOpen.value = false;
    editTitleValue.value = '';
    editingId.value = null;
    activeMenuChat.value = null;
};

const confirmRename = async () => {
    if (!isRenameValid.value) return;

    try {
        await changeTitleMessagesApi({ newTitle: editTitleValue.value }, editingId.value)
    } catch (error) {
        console.error('Lỗi khi doi ten:', error)
    } finally {
        if (aiStore.formChat.conversationId === editingId.value) {
            aiStore.titleMess = editTitleValue.value
        }
        aiStore.refreshSidebarTrigger++
        closeRenameModal();
    }
};

const deleteChat = async (id) => {
    const isConfirmed = await confirmStore.show(
        "Xoá cuộc trò chuyện?",
        "Bạn có chắc chắn muốn xóa cuộc trò chuyện này không? Hành động này không thể hoàn tác."
    );
    if (!isConfirmed) return;

    try {
        await deleteMessagesApi(id)
    } catch (error) {
        console.error("Lỗi khi xóa:", error);
    } finally {
        aiStore.refreshSidebarTrigger++;
        aiStore.titleMess = '';
        closeMenu()
    }
};
</script>

<style scoped>
.sidebar {
    width: 280px;
    background-color: #f0f4f9;
    display: flex;
    flex-direction: column;
    padding: 16px 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    white-space: nowrap;
}


.sidebar.collapsed {
    width: 68px;
    padding: 16px 10px;
}

.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    margin-bottom: 24px;
    height: 40px;
}
.search-wrapper {
    display: flex;
    padding: 8px;
    margin-bottom: 24px;
    height: 40px;
}

.sidebar.collapsed .sidebar-header {
    justify-content: center;
}

.icon-btn {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.icon-btn:hover {
    background-color: #e2e7ec;
}

.new-chat-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background-color: transparent;
    border-radius: 50px;
    cursor: pointer;
    font-weight: 500;
    margin-bottom: 24px;
    color: #1f1f1f;
    transition: all 0.3s;
}

.sidebar.collapsed .new-chat-btn {
    padding: 12px;
    justify-content: center;
    aspect-ratio: 1/1;
}

.new-chat-btn:hover {
    background-color: #e2e7ec;
}


.chat-history {
    flex: 1;
    overflow-y: auto;
}

.spacer {
    flex: 1;
}

.history-title {
    font-size: 14px;
    font-weight: 500;
    padding: 8px 16px;
    color: #444746;
}

.history-list {
    list-style: none;
    padding: 0;
    margin: 0;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.history-list li {
    padding: 12px 16px;
    margin: 2px 0;
    border-radius: 24px;
    cursor: pointer;
    font-size: 14px;
    color: #444746;
    overflow: hidden;
    text-overflow: ellipsis;
}

.history-list li:hover {
    background-color: #e2e7ec;
}

.history-list li.active {
    background-color: #d3e3fd;
    color: #041e49;
}


.sidebar-footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 12px 16px;
    border-radius: 24px;
    cursor: pointer;
    transition: all 0.3s;
}

.sidebar.collapsed .sidebar-footer {
    padding: 12px;
    align-items: center;
}

.sidebar-footer:hover {
    background-color: #e2e7ec;
}

.footer-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 500;
    color: #444746;
}


.icon-wrapper {
    position: relative;
    display: flex;
}

.notification-dot {
    position: absolute;
    top: -2px;
    right: -4px;
    width: 8px;
    height: 8px;
    background-color: #0b57d0;
    border-radius: 50%;
    border: 2px solid #f0f4f9;
}

.fade-text {
    animation: fadeIn 0.3s forwards;
}

.history-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    margin: 2px 0;
    border-radius: 24px;
    cursor: pointer;
    font-size: 14px;
    color: #444746;
    position: relative;
}

.history-item:hover {
    background-color: #e2e7ec;
}

.history-item.active {
    background-color: #d3e3fd;
    color: #041e49;
}


.chat-title-wrapper {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-right: 8px;
}


.more-options-btn {
    display: none;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 50%;
    color: #444746;
    cursor: pointer;
}

.more-options-btn:hover {
    background-color: #ffffff;
}

.more-options-btn.menu-open {
    display: flex !important;
    background-color: #ffffff !important;
}

.history-item:hover .more-options-btn {
    display: flex;
}

.rename-input {
    width: 100%;
    border: 1px solid #0b57d0;
    border-radius: 4px;
    padding: 2px 6px;
    outline: none;
    background-color: #ffffff;
    color: #1f1f1f;
    font-family: inherit;
}

.custom-dropdown-menu {
    position: fixed;
    z-index: 99999;
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    width: 130px;
    padding: 8px 0;
    border: 1px solid #e0e0e0;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    font-size: 14px;
    color: #1f1f1f;
    cursor: pointer;
    transition: background-color 0.2s;
}

.dropdown-item:hover {
    background-color: #f0f4f9;
}

.text-danger:hover {
    background-color: #fce8e6;
}

.rename-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
}


.rename-modal {
    background-color: #f0f4f9;
    width: 90%;
    max-width: 400px;
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
}

.rename-title {
    font-size: 20px;
    color: #1f1f1f;
    margin-bottom: 24px;
}


.rename-input-box {
    width: 92%;
    padding: 16px;
    font-size: 16px;
    color: #1f1f1f;
    background-color: transparent;
    border: 1px solid #747775;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.2s;
}


.rename-input-box:focus {
    border: 2px solid #0b57d0;
    padding: 15px;
}


.rename-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 24px;
}

.btn-text {
    background: none;
    border: none;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 20px;
    cursor: pointer;
}

.btn-text:hover:not(:disabled) {
    background-color: #e2e7ec;
}

.btn-cancel {
    color: #0b57d0;
}

.btn-submit {
    color: #0b57d0;
}

.btn-submit:disabled {
    color: #1f1f1f;
    opacity: 0.38;
    cursor: not-allowed;
}
.icon-lock{
    cursor: pointer;
}
</style>