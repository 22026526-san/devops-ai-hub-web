<template>
  <div class="input-wrapper">
    <div class="input-box">
      <textarea 
        ref="textareaRef"
        v-model="text"
        @input="autoResize"
        placeholder="Hỏi tớ mọi thứ về devops mà cậu muốn biết" 
        rows="1" 
        class="chat-textarea"
      ></textarea>
      <div class="input-actions">
        <div class="actions-left">
        </div>
        
        <div class="actions-right">
          <div type="text" shape="circle" class="send-btn" @click="handleAction">
            <Square v-if="props.isWaiting" :size="18" fill="currentColor" style="margin-top: 1px;" />
            <Send v-else :size="20" style="margin-top: 3px;" />
          </div>
        </div>
      </div>
    </div>
    <div class="disclaimer">
      Tớ là AI và có thể mắc sai sót.
    </div>
  </div>
</template>

<script setup>
import { Send,Square } from 'lucide-vue-next';
import { ref,nextTick } from 'vue';
import { useAiStore } from '@/stores/ai.store';


const aiStore = useAiStore();
const textareaRef = ref(null);
const text=ref(null);
const savedText = ref(''); 
const props = defineProps({
  isWaiting: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['send']);

const autoResize = () => {
  const textarea = textareaRef.value;
  if (!textarea) return;

  textarea.style.height = 'auto';

  textarea.style.height = `${textarea.scrollHeight}px`;
};
const handleAction = () => {
  if (props.isWaiting) {
    console.log('day')
    text.value = savedText.value; 
    emit('cancel'); 
    
    nextTick(() => {
      autoResize();
    });
  } else {
    console.log('day day')
    if (!text.value.trim()) return; 
    
    savedText.value = text.value; 
    aiStore.formChat.message = text.value;
    text.value = '';
    
    nextTick(() => {
      autoResize();
    }); 
    emit('send');
  }
};
</script>

<style scoped>
.input-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 30%);
  padding-bottom: 16px;
}

.input-box {
  width: 100%;
  max-width: 820px;
  background-color: #ffffff;
  border-radius: 32px; 
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); 
  border: 1px solid #e0e0e0;
  padding: 12px 16px 8px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-main{
    width: 100%;
}

.chat-textarea {
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  font-size: 16px;
  padding: 8px;
  background: transparent;
  color: #1f1f1f;
  line-height: 1.5; 
  overflow-y: auto;
  max-height: 120px;
}

.chat-textarea::placeholder { color: #5f6368; }

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions-left, .actions-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.disclaimer {
  margin-top: 12px;
  font-size: 12px;
  color: #444746;
}
.send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;          
  height: 40px;         
  border-radius: 50%;   
  background-color: #f0f4f9; 
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  padding: 0;           
}

.send-btn:hover {
  background-color: #e2e7ec; 
}

.send-icon {
  margin-left: 2px; 
}
</style>