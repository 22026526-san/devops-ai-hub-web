<template>
    <div class="chat-header">
        <div class="header-left">
            <h2>OmniOps</h2>
        </div>
        <div class="header-center">
            <span>{{ aiStore.titleMess }}</span>
        </div>
        <div class="header-right">
            <div class="user-avatar-wrapper">
                <img 
                :src="authStore.user?.avatarUrl ? authStore.user.avatarUrl : defaultAvatar" 
                alt="User Avatar" 
                class="user-avatar"
                @click="appStore.setSettingMenu(!appStore.settingMenu)"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import defaultAvatar from '@/assets/img/user_default.png'
import { useAuthStore } from '@/stores/auth.store' 
import { useAiStore } from '@/stores/ai.store';

const authStore = useAuthStore()
const aiStore = useAiStore()
</script>

<style scoped>
.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    height: 64px;
}

.header-left h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 400;
    color: #5f6368;
}

.header-center {
    font-weight: 500;
    font-size: 16px;
    color: #1f1f1f;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.action-icon {
    width: 18px;
    height: 18px;
    cursor: pointer;
}
</style>