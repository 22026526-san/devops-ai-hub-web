<template>
  <div class="base-search-wrapper">

    <div class="icon-20 icon-lock" @click="handleEnter"></div>

    <input
      type="text"
      class="search-input"
      :value="modelValue"
      :placeholder="placeholder"
      @input="handleInput"
      @keyup.enter="handleEnter"
      v-bind="$attrs"
    />

    <div 
      v-if="modelValue" 
      class="btn-clear" 
      @click="handleClear"
      type="button"
      title="Xóa tìm kiếm"
    >
      <div class="icon-20 icon-X"></div>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  inheritAttrs: false 
})

const text = defineModel({ type: [String], default: '' })

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Tìm kiếm...'
  }
})

const emit = defineEmits(['search', 'clear'])

const handleInput = (event) => {
  text.value = event.target.value
}

const handleEnter = () => {
  if (text.value.trim()) {
    emit('search', text.value)
  }
}

const handleClear = () => {
  text.value = ''
  emit('clear')
}
</script>

<style scoped>
.base-search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
}

.icon-lock {
  position: absolute;
  left: 6px;
  cursor: pointer;
}

.search-input {
  width: 100%;
  padding: 10px 36px 10px 36px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #0f172a;
  outline: none;
  transition: all 0.2s ease;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-input:focus {
  background-color: #ffffff;
  border-color: #6666666d;
}

.btn-clear {
  position: absolute;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 4px;
  transition: all 0.2s;
}

.btn-clear svg {
  width: 14px;
  height: 14px;
}
</style>