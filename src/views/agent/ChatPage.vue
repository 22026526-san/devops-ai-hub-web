<template>
  <div class="app-container">
    <Sidebar @new-chat="startNewConversation" />
    <div class="main-content">
      <ChatHeader />
      <WelcomeAiAgent v-if="mess.length === 0">
        <ChatInputBox @send="handleSendMessage" @cancel="handleCancel" :is-waiting="isLoadingAI" />
      </WelcomeAiAgent>

      <div v-else class="chat-active-layout">
        <ChatMessageArea :mess="mess" />
        <div class="pinned-input-container">
          <ChatInputBox @send="handleSendMessage" @cancel="handleCancel" :is-waiting="isLoadingAI" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Sidebar from '@/views/agent/Sidebar.vue';
import ChatHeader from '@/views/agent/ChatHeader.vue';
import ChatMessageArea from '@/views/agent/ChatMessageArea.vue';
import ChatInputBox from '@/views/agent/ChatInputBox.vue';
import WelcomeAiAgent from '@/views/components/WelcomeAiAgent.vue';
import { getConversationMessagesApi, aiChatApi } from '@/api/modules/ai.api.js'
import { useAiStore } from '@/stores/ai.store';
import { useAuthStore } from '@/stores/auth.store';
import { AI_ROLES } from '@/common/enums';

const aiStore = useAiStore()
const authStore = useAuthStore()
const mess = ref([])
const isLoadingAI = ref(false)
let abortController = null;

const fetchMessData = async () => {
  if (aiStore.formChat.conversationId) {
    aiStore.aiLoading = true
    try {
      const response = await getConversationMessagesApi(aiStore.formChat.conversationId)
      mess.value = response.data
      console.log(mess.value)
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu hồ sơ:', error)
    } finally {
      aiStore.aiLoading = false
    }
  }
}

watch(() => aiStore.formChat.conversationId,
  (newId) => {
    if (newId) {
      fetchMessData()
    }
  },
  { immediate: true }
)
const startNewConversation = () => {
  mess.value = [];
  aiStore.titleMess = '';
  aiStore.formChat.conversationId = null;
};
const handleSendMessage = async () => {
  if (!aiStore.formChat.message.trim()) return;
  isLoadingAI.value = true;
  mess.value.push({
    id: Date.now().toString(),
    role: AI_ROLES.USER,
    content: aiStore.formChat.message
  });

  const tempAiMessageId = "temp-" + Date.now();
  mess.value.push({
    id: tempAiMessageId,
    role: AI_ROLES.AI,
    content: '',
    isLoading: true
  });
  abortController = new AbortController();
  try {
    aiStore.isAiRequest = true
    aiStore.formChat.userId = authStore.user?.userId
    const response = await aiChatApi(aiStore.formChat,
      {
        signal: abortController.signal,
        timeout: 180000 
      }
    )

    const result = response.data

    const aiMessageIndex = mess.value.findIndex(m => m.id === tempAiMessageId);

    if (aiMessageIndex !== -1) {
      mess.value[aiMessageIndex].content = result.reply;
      aiStore.isAiRequest = false
    }

    if (!aiStore.formChat.conversationId) {
      aiStore.formChat.conversationId = result.conversationId;
      aiStore.refreshSidebarTrigger++;
    }

  } catch (error) {
    console.error('Lỗi gọi API AI:', error);
    const aiMessageIndex = mess.value.findIndex(m => m.id === tempAiMessageId);
    if (aiMessageIndex !== -1) {
      mess.value[aiMessageIndex].content = "Đã xảy ra lỗi kết nối. Hãy thử lại nhé!";
      aiStore.isAiRequest = false
    }
  } finally {
    aiStore.isAiRequest = false
    isLoadingAI.value = false;
  }
};
const handleCancel = () => {
  isLoadingAI.value = false;
  mess.value.pop();
  if (abortController) {
    abortController.abort();
  }
};
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #ffffff;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
}

.pinned-input-container {
  width: 100%;
}

.chat-active-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
</style>