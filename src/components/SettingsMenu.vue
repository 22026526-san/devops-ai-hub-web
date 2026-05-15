<template>
    <Teleport to="body">
        <div class="setting-overlay">
            <div class="settings-sidebar">
                <div class="profile-group">
                    <div class="profile-item">
                        <div class="avatar-wrapper">
                            <img :src="authStore.user?.avatarUrl ? authStore.user.avatarUrl : defaultAvatar"
                                alt="User Avatar" class="avatar" />
                        </div>
                        <span class="user-name">{{ authStore.user?.fullName || 'Guest' }}</span>
                    </div>
                </div>

                <div class="action-group">
                    <div class="menu-item action-item">
                        <div class="icon-btn bg-btn">
                            <div class="icon-20 icon-user"></div>
                        </div>
                        <div class="item-content" @click="toProfile">
                            <span class="main-text">Trang cá nhân</span>
                        </div>
                        <div class="icon-btn">
                            <div class="icon-20 icon-chevron"></div>
                        </div>
                    </div>
                    <div class="menu-item action-item">
                        <div class="icon-btn bg-btn">
                            <div class="icon-24 icon-setting"></div>
                        </div>
                        <div class="item-content">
                            <span class="main-text">Cài đặt và quyền riêng tư</span>
                        </div>
                        <div class="icon-btn">
                            <div class="icon-20 icon-chevron"></div>
                        </div>
                    </div>

                    <div class="menu-item action-item">
                        <div class="icon-btn bg-btn">
                            <div class="icon-24 icon-help"></div>
                        </div>
                        <div class="item-content">
                            <span class="main-text">Trợ giúp và hỗ trợ</span>
                        </div>
                        <div class="icon-btn">
                            <div class="icon-20 icon-chevron"></div>
                        </div>
                    </div>

                    <div class="menu-item action-item">
                        <div class="icon-btn bg-btn">
                            <div class="icon-20 icon-like"></div>
                        </div>
                        <div class="item-content has-sub" @click="toLikePost">
                            <span class="main-text">Bài viết đã thích</span>
                        </div>
                        <div class="icon-btn">
                            <div class="icon-20 icon-chevron"></div>
                        </div>
                    </div>

                    <div class="menu-item action-item">
                        <div class="icon-btn bg-btn">
                            <div class="icon-20 icon-save"></div>
                        </div>
                        <div class="item-content" @click="toBookmarkPost">
                            <span class="main-text">Bài viết đã lưu</span>
                        </div>
                        <div class="icon-btn">
                            <div class="icon-20 icon-chevron"></div>
                        </div>
                    </div>

                    <div class="menu-item action-item">
                        <div class="icon-btn bg-btn">
                            <div class="icon-20 icon-logout"></div>
                        </div>
                        <div class="item-content" @click="handleLogout">
                            <span class="main-text" v-if="authStore.role === USER_ROLES.GUEST">Đăng nhập</span>
                            <span class="main-text" v-else>Đăng xuất</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </Teleport>
</template>
<script setup>
import { useAuthStore } from '@/stores/auth.store'
import { useAppStore } from '@/stores/app.store'
import defaultAvatar from '@/assets/img/user_default.png'
import { USER_ROLES } from '@/common/enums'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const appStore = useAppStore()
const router = useRouter()

const handleLogout = () => {
    authStore.logout()
}

const toProfile = () => {
    appStore.filters.Page=1
    appStore.idProfile = authStore.user?.userId
    appStore.setSettingMenu(false)
    appStore.resetFilters();
    appStore.fillTitle = ''
    router.push({ 
        name: 'profile', 
        query: { id: authStore.user?.userId } 
    }) 
}
const toLikePost = () => {
    appStore.filters.Page=1
    appStore.setSettingMenu(false)
    appStore.resetFilters()
    appStore.fillTitle = 'đã thích'
    router.push({ 
        name: 'like_post', 
    }) 
}
const toBookmarkPost = () => {
    appStore.filters.Page=1
    appStore.setSettingMenu(false)
    appStore.resetFilters()
    appStore.fillTitle = 'đã lưu'
    router.push({ 
        name: 'bookmark_post', 
    }) 
}

</script>
<style scoped>
.setting-overlay {
    position: fixed;
    top: 68px;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: flex-end;
    z-index: 99999;
}

.settings-sidebar {
    width: 326px;
    background-color: #ffff;
    padding: 16px;
    color: #242526;
}

.bg-btn {
    background-color: #3a3b3c1f;
}

.menu-item {
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    text-decoration: none;
}

.menu-item:hover {
    background-color: #3a3b3c1a;
}

.profile-group {
    padding-bottom: 12px;
    border-bottom: 1px solid #3e40425e;
    margin-bottom: 12px;
}

.profile-item {
    gap: 12px;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    padding: 4px;
}

.avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    background-color: #e2e8f0;
}


.avatar-wrapper {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    padding: 2px;
    background: linear-gradient(135deg, #a7f3d0, #bae6fd);
    cursor: pointer;
}

.user-name {
    font-size: 15px;
    font-weight: 600;
}

.action-group {
    display: flex;
    flex-direction: column;
    gap: 4px;

}

.action-item {
    gap: 8px;
    padding: 8px;
}

/* Nội dung chữ (hỗ trợ sub-text) */
.item-content {
    flex: 1;
    /* Chiếm phần không gian ở giữa */
    display: flex;
    flex-direction: column;
}

.main-text {
    font-size: 15px;
    font-weight: 500;
}

.sub-text {
    font-size: 12px;
    color: #B0B3B8;
    margin-top: 2px;
}
</style>