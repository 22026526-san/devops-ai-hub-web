<template>
  <div class="base-select-wrapper" ref="selectRef">
    <label v-if="label" class="label">
      {{ label }} <span v-if="required" class="required">*</span>
    </label>

    <div class="input-container">
      <input
        type="text"
        v-model="searchQuery"
        :placeholder="placeholder"
        :class="['select-input', { 'is-error': error, 'is-open': isOpen }]"
        @focus="openDropdown"
        @click="openDropdown"
      />
      <div class="arrow-icon">
        <div :class="['icon-20', isOpen ? 'icon-up' : 'icon-down']"></div>
      </div>
    </div>

    <Transition name="fade">
      <ul v-if="isOpen" class="dropdown-menu">
        <li
          v-for="option in filteredOptions"
          :key="option.value"
          class="dropdown-item"
          :class="{ 'is-selected': model === option.value }"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </li>
        
        <li v-if="filteredOptions.length === 0" class="dropdown-item empty-state">
          Không tìm thấy kết quả phù hợp
        </li>
      </ul>
    </Transition>

    <span v-if="error" class="error-text">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const model = defineModel({ type: [String, Number], default: '' })

const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => []
  },
  label: { type: String, default: '' },
  placeholder: { type: String, default: 'Chọn giá trị' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false }
})


const selectRef = ref(null) 
const isOpen = ref(false)   
const searchQuery = ref('') 

const normalizedOptions = computed(() => {
  return props.options.map(opt => {
    if (typeof opt === 'object' && opt !== null) return opt
    return { label: String(opt), value: opt }
  })
})

const filteredOptions = computed(() => {
  if (!searchQuery.value) return normalizedOptions.value
  
 
  const selectedOption = normalizedOptions.value.find(opt => opt.value === model.value)
  if (selectedOption && searchQuery.value === selectedOption.label && !isOpen.value) {
    return normalizedOptions.value
  }

  const query = searchQuery.value.toLowerCase()
  return normalizedOptions.value.filter(opt => 
    opt.label.toLowerCase().includes(query)
  )
})

const selectOption = (option) => {
  model.value = option.value        
  searchQuery.value = option.label  
  isOpen.value = false              
}

const openDropdown = (e) => {
  isOpen.value = true
  e.target.select() 
}

watch(model, (newVal) => {
  const selected = normalizedOptions.value.find(opt => opt.value === newVal)
  if (selected) {
    searchQuery.value = selected.label
  } else {
    searchQuery.value = ''
  }
}, { immediate: true })

const handleClickOutside = (event) => {
  if (selectRef.value && !selectRef.value.contains(event.target)) {
    isOpen.value = false
    
    const selected = normalizedOptions.value.find(opt => opt.value === model.value)
    searchQuery.value = selected ? selected.label : ''
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.base-select-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #374151;
}

.required {
  color: #ef4444;
}

.input-container {
  position: relative;
}

.select-input {
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  outline: none;
  background: white;
  cursor: text;
  transition: all 0.2s;
}

.select-input:focus, .select-input.is-open {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.select-input.is-error {
  border-color: #ef4444;
}

.arrow-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.7rem;
  color: #9ca3af;
  pointer-events: none; 
  transition: transform 0.2s;
}

.arrow-icon.rotate {
  transform: translateY(-50%) rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 50;
  padding: 0;
  margin: 0;
  list-style: none;
}

.dropdown-item {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}

.dropdown-item.is-selected {
  background-color: #eff6ff;
  color: #2563eb;
  font-weight: 500;
}

.empty-state {
  color: #6b7280;
  cursor: default;
}

.empty-state:hover {
  background-color: transparent;
}

.error-text {
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>