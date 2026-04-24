<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder' 
import { watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Bạn đang nghĩ gì thế?',
  },
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: props.placeholder, 
    }),
  ],
  
  onUpdate({ editor }) {
    emit('update:modelValue', editor.getHTML()) 
  },
  
  editorProps: {
    attributes: {
      class: 'tiptap-content',
    },
  },
})

watch(() => props.modelValue, (newValue) => {
  const isSame = editor.value?.getHTML() === newValue
  if (!isSame) {
    editor.value?.commands.setContent(newValue, false)
  }
})
</script>

<template>
  <div class="tiptap-wrapper">
    <editor-content :editor="editor" class="tiptap-input" />
  </div>
</template>

<style scoped>
/* CSS cho Tiptap */
.tiptap-wrapper {
  margin-bottom: 10px;
  border-radius: 4px;
}
.tiptap-toolbar {
  padding: 5px;
  border-bottom: 1px solid #ddd;
  display: flex;
  gap: 5px;
}
.tiptap-toolbar button {
  padding: 5px 10px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
}
.tiptap-toolbar button:hover {
  background-color: #f0f2f5;
}
.tiptap-toolbar button.is-active {
  background-color: #f0f2f5;
  border-color: #ddd;
}
:deep(.tiptap-content) {
  padding: 10px;
  min-height: 150px;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid transparent;
}
:deep(.tiptap-content:focus) {
  outline: none;
  border-color: none; 
}

:deep(.tiptap-content p.is-editor-empty:first-child::before),
:deep(.tiptap-content p.is-empty::before) {
  content: attr(data-placeholder);
  float: left;
  color: #8f9396;
  pointer-events: none;
  height: 0;
}

:deep(.tiptap-content) {
  padding: 0 !important; 
  min-height: 150px;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid transparent;
}
</style>