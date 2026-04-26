<template>
  <Teleport to="body">
    <div class="modal-overlay" v-if="isOpen" @click.self="closeModal">
      <div class="modal-container">
        
        <div class="modal-header">
          <h2 class="modal-title">Bộ lọc bài viết</h2>
          
          <X class="close-btn" @click="closeModal" />
        
        </div>

        <div class="modal-body">
          <div class="filter-description">
            <strong v-if="appStore.filters.Search">Dùng bộ lọc để tìm bài viết mà bạn mong muốn.</strong>
            <strong v-else>Dùng bộ lọc để tìm bài viết trên dòng thời gian của bạn.</strong>
          </div>

          <div class="filter-form">
            <div class="form-row">
              <label>Đi đến:</label>
              <div class="date-selectors">
                <select v-model="appStore.filters.Year" class="custom-select">
                  <option value="">Năm</option>
                  <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>

                <select v-if="appStore.filters.Year" v-model="appStore.filters.Month" class="custom-select">
                  <option value="">Tháng</option>
                  <option v-for="month in months" :key="month" :value="month">Tháng {{ month }}</option>
                </select>

                <select v-if="appStore.filters.Month" v-model="appStore.filters.Day" class="custom-select">
                  <option value="">Ngày</option>
                  <option v-for="day in daysInMonth" :key="day" :value="day">{{ day }}</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <label>Sắp xếp theo:</label>
              <select v-model="appStore.filters.SortBy" class="custom-select">
                <option value="likes_desc">Bài viết nhiều like nhất</option>
                <option value="views_desc">Bài viết nhiều lượt xem nhất</option>
              </select>
            </div>

          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-clear" @click="clearFilters">Xóa</button>
          <button class="btn-submit" @click="closeModal">Xong</button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue'
import { X } from 'lucide-vue-next'
import { useAppStore } from '@/stores/app.store'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])
const appStore = useAppStore()
const closeModal = () => {
  emit('close')
}
const clearFilters = () => {
  const text = appStore.filters.Search
  appStore.resetFilters()
  appStore.filters.Search = text
  emit('close')
}

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 20 }, (_, i) => currentYear - i)
const months = Array.from({ length: 12 }, (_, i) => i + 1)

const daysInMonth = computed(() => {
  if (!appStore.filters.Year || !appStore.filters.Month) return []
  const days = new Date(appStore.filters.Year, appStore.filters.Month, 0).getDate()
  return Array.from({ length: days }, (_, i) => i + 1)
})



</script>

<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(244, 244, 244, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: Arial, sans-serif;
}

/* Header */
.modal-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ced0d4;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #050505;
}

.close-btn {
  width: 24px;
  height: 24px;
  border: none;
  cursor: pointer;
}

.close-btn:hover {
  background-color: #d8dadf;
}

.modal-body {
  padding: 16px;
}

.filter-description {
  margin-bottom: 20px;
  color: #050505;
}

.filter-description p {
  color: #65676B;
  margin: 4px 0 0 0;
  font-size: 15px;
}

.filter-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.form-row label {
  width: 160px; 
  font-size: 15px;
  color: #050505;
}

.date-selectors {
  display: flex;
  gap: 8px;
  flex: 1;
}


.custom-select {
  appearance: none; 
  background-color: #e4e6eb;
  border: none;
  border-radius: 6px;
  padding: 8px 32px 8px 12px;
  font-size: 15px;
  font-weight: 600;
  color: #050505;
  cursor: pointer;
  outline: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23050505%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 12px top 50%;
  background-size: 12px auto;
}

.custom-select:hover {
  background-color: #d8dadf;
}

/* Footer Buttons */
.modal-footer {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid white; 
}

.btn-clear {
  padding: 8px 24px;
  border: none;
  border-radius: 6px;
  background-color: #e4e6eb;
  color: #050505;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
}

.btn-clear:hover {
  background-color: #d8dadf;
}

.btn-submit {
  padding: 8px 36px;
  border: none;
  border-radius: 6px;
  background-color: #0866ff; 
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
}

.btn-submit:hover {
  background-color: #0054d1;
}
.icon-small{
    height: 22px;
    width: 22px;
}
</style>