<template>
  <div class="base-input-wrapper">
    <div v-if="label" class="label">
      {{ label }} <span v-if="required" class="required">*</span>
    </div>
    
    <div :class="['input-field', { 'is-error': error }]">
      <div class="icon-btn" v-if="icon">
        <div :class="`icon-20 ${icon}`"></div>
      </div>

      <input
        :type="type"
        v-model="model"
        :placeholder="placeholder"
        v-bind="$attrs"
      />
    </div>

    <span v-if="error" class="error-text">
      {{ error }}
    </span>
  </div>
</template>

<script setup>

const model = defineModel({ type: [String, Number], default: '' })

defineProps({
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  error: {
    type: String,
    default: ''
  },
  icon : {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  }
})

defineOptions({
  inheritAttrs: false
})
</script>

<style scoped>
.base-input-wrapper {
  display: flex;
  flex:1;
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

.input-field {
  padding: 4px 8px;
  font-size: 13px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
  display: flex;
  align-items: center;
}

.input-field input {
  width: 100%;
  border: none;
  outline: none;
}

.input-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.input-field.is-error {
  border-color: #ef4444;
}

.input-field.is-error:focus {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

.error-text {
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
}
</style>