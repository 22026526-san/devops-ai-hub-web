<template>
  <div class="message-area" ref="messageAreaRef">
    <div class="message-container">

      <div v-for="msg in mess" :key="msg.id" class="message"
        :class="msg.role === AI_ROLES.USER ? 'user-message' : 'ai-message'">

        <template v-if="msg.role === 'user'">
          <div class="bubble">
            {{ msg.content }}
          </div>
        </template>

        <template v-else-if="msg.role === AI_ROLES.AI">
          <div class="ai-icon">
            <Sparkles color="#4285f4" fill="#4285f4" size="24" />
          </div>

          <div class="ai-content">
            <div v-if="aiStore.isAiRequest && msg.isLoading === true" class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
            <div v-else class="text-content">
              <MarkdownViewer :rawText="msg.content" />
            </div>
          </div>
        </template>

      </div>

      <div class="scroll-spacer"></div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated, nextTick } from 'vue';
import { Sparkles } from 'lucide-vue-next';
import { useAiStore } from '@/stores/ai.store';
import MarkdownViewer from '@/views/components/MarkdownViewer.vue';
import { AI_ROLES } from '@/common/enums';

const props = defineProps({
  mess: {
    type: Array,
    required: true,
    default: () => []
  }
});

const messageAreaRef = ref(null);
const aiStore = useAiStore();

const scrollToBottom = () => {
  if (messageAreaRef.value) {
    messageAreaRef.value.scrollTop = messageAreaRef.value.scrollHeight;
  }
};

onMounted(() => {
  scrollToBottom();
});

onUpdated(() => {
  nextTick(() => {
    scrollToBottom();
  });
});
</script>

<style scoped>
.message-area {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  justify-content: center;
  scroll-behavior: smooth;
}

.message-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.message {
  display: flex;
  width: 100%;
}

.user-message {
  justify-content: flex-end;
}

.user-message .bubble {
  background-color: #f0f4f9;
  padding: 12px 20px;
  border-radius: 24px;
  max-width: 80%;
  font-size: 16px;
  line-height: 1.5;
  color: #1f1f1f;
  white-space: pre-wrap;
}

.ai-message {
  justify-content: flex-start;
  gap: 16px;
}

.ai-icon {
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  margin-top: 18px;
  flex-shrink: 0;
}

.ai-content {
  flex: 1;
  max-width: 90%;
}

.text-content {
  font-size: 16px;
  color: #1f1f1f;
}

.scroll-spacer {
  height: 20px;
  width: 100%;
  flex-shrink: 0;
}

.typing-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background-color: #f0f4f9;
  border-radius: 20px;
  border-top-left-radius: 4px;
  margin-top: 16px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background-color: #a8c7fa;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}


.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {

  0%,
  80%,
  100% {
    transform: scale(0);
  }

  40% {
    transform: scale(1);
  }
}
</style>
