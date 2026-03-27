<template>
  <header class="app-header">
    <div class="header-left">
    
      <div class="logo-area">
          <img src="@/assets/img/logo_devops_hub.png" alt="DevOps Connect Logo" class="logo-icon" />
          <span class="logo-text">DevOps Connect</span>
      </div>

      <!-- Navigation Links -->
      <div class="nav-menu">
        <!-- Home (Active) -->
        <router-link to="/home" class="nav-item" active-class="active">
          <div class="icon-20 icon-home"></div>
          Trang chủ
        </router-link>

        <!-- Explore -->
        <router-link to="/explore" class="nav-item" active-class="active">
          <div class="icon-20 icon-explore"></div>
          Khám phá
        </router-link>

        <!-- AI Agent -->
        <router-link to="/ai-agent" class="nav-item" active-class="active">
          <div class="icon-20 icon-ai"></div>
          Trợ lý AI
        </router-link>

      </div>
    </div>

    <div class="header-right">
      <!-- Search Box -->
      <BaseSearch
        v-model="searchQuery"
        placeholder="Tìm kiếm..."
        @search="onSearchSubmit"
        @clear="onSearchClear"
      />
      <button class="btn-notification">
        <div class="icon-24 icon-notification"></div>
        <span class="notification-dot" v-if="hasUnreadNotifications"></span>
      </button>

      <div class="user-avatar-wrapper">
        <img 
          :src="authStore.user?.avatarUrl ? authStore.user.avatarUrl : defaultAvatar" 
          alt="User Avatar" 
          class="user-avatar"
          @click="appStore.setSettingMenu(!appStore.settingMenu)"
        />
      </div>
    </div>
  </header>
  <SettingsMenu v-if="appStore.settingMenu" />
</template>

<script setup>
import BaseInput from '@/components/base/BaseInput.vue';
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store' 
import { useAppStore } from '@/stores/app.store' 
import defaultAvatar from '@/assets/img/user_default.png'
import SettingsMenu from '@/components/SettingsMenu.vue';
import BaseSearch from '@/components/base/BaseSearch.vue';

const authStore = useAuthStore()
const appStore = useAppStore()

const searchQuery = ref('')

const hasUnreadNotifications = ref(true)

const onSearchSubmit = (text) => {
  console.log('Người dùng vừa nhấn Enter tìm kiếm:', searchQuery.value)
}

const onSearchClear = () => {
  console.log('Đã xóa trắng tìm kiếm')
}
</script>

<style scoped>

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
  padding: 0 1.5rem;
  background-color: #ffffff;
  border-bottom: 1px solid #f1f5f9; 
  font-family: 'Inter', -apple-system, sans-serif;
}


.header-left {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

/* Logo */
.logo-area {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.logo-icon {
  width: 32px;
  height: 32px;
}

.logo-text {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a; /* Slate 900 */
}

/* Navigation Menu */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  color: #64748b; /* Slate 500 */
  transition: color 0.2s;
}

.nav-icon {
  width: 1.1rem;
  height: 1.1rem;
}

.nav-item:hover {
  color: #343434e8; 
}
.nav-item:hover .icon-20 {
  background-color: #343434e8;
}
.nav-item.active .icon-20 {
  background-color: #3b82f6;
}

.nav-item.active {
  color: #3b82f6; 
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.btn-notification {
  position: relative;
  background: none;
  border: none;
  padding: 0.4rem;
  cursor: pointer;
  color: #0f172a; 
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.btn-notification:hover {
  background-color: #efefefa0;
}

/* Chấm đỏ báo hiệu có thông báo */
.notification-dot {
  position: absolute;
  top: 4px;
  right: 6px;
  width: 8px;
  height: 8px;
  background-color: #ef4444; 
  border-radius: 50%;
  border: 2px solid #ffffff; 
}

/* User Avatar */
.user-avatar-wrapper {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(135deg, #a7f3d0, #bae6fd); 
  cursor: pointer;
}

.user-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background-color: #e2e8f0;
}
.base-input-wrapper[data-v-6f2d2890] {
  margin-bottom: 0;
}
</style>