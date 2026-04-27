<template>
  <div class="profile-container">

    <div class="profile-content">
      <div class="profile-header-main">
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <img :src="data.avatarUrl || defaultAvatar" alt="Avatar" />
            <div class="active-status"></div>
          </div>
        </div>

        <div class="user-info">
          <h1 class="user-name">{{ data.fullName }}</h1>
          <div class="follower-stats">
            {{ data.followerCount || 0 }} người theo dõi • {{ data.followingCount || 0 }} đang theo dõi
          </div>
        </div>

        <div class="action-buttons">
            <button class="btn btn-secondary" v-if="appStore.idProfile === authStore.user?.userId">
              <Pen class="icon-sm" />
              Chỉnh sửa
            </button>
            <button class="btn btn-secondary" v-if="data.isFollowing && appStore.idProfile !== authStore.user?.userId" @click="handleUnFollow(appStore.idProfile)">
              <X class="icon-sm" />
                Hủy theo dõi
            </button>
            <button class="btn btn-secondary" v-if="!data.isFollowing && appStore.idProfile !== authStore.user?.userId" @click="handleFollow(appStore.idProfile)">
              <Plus class="icon-sm" />
              Theo dõi
            </button>
        </div>
      </div>

      <div class="divider"></div>

      <div class="nav-tabs">
        <div class="tabs-list">
          <div class="tab active">Bài viết</div>
          <div class="tab">Người theo dõi</div>
          <div class="tab">Đang theo dõi</div>
        </div>
        <button class="btn-more">
          <MoreHorizontal class="icon-sm" />
        </button>
      </div>
    </div>
    <ToastMessage 
        v-model="toastVisible"
        :text="toastText"
        :is-success="!isError"
        :is-error="isError"
    />
  </div>
</template>

<script setup>
import { 
  Pen, 
  Plus, 
  MoreHorizontal, 
  X
} from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth.store'
import { useAppStore } from '@/stores/app.store'
import { getUserProfileByIdApi } from '@/api/modules/user.api'
import defaultAvatar from '@/assets/img/user_default.png'
import { ref, watch } from 'vue';
import ToastMessage from '@/components/ToastMessage.vue';
import { followUserApi, unfollowUserApi } from '@/api/modules/user.api';

const authStore = useAuthStore()
const appStore = useAppStore()
const data = ref([])
const toastVisible = ref(false)
const toastText = ref('')
const isError = ref(false)

const fetchProfileData = async () => {
  if (appStore.idProfile !== authStore.user?.userId) {
    appStore.setAppLoading(true)
    try {
        const response = await getUserProfileByIdApi(appStore.idProfile)
        data.value = response.data
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu hồ sơ:', error)
    } finally {
        appStore.setAppLoading(false)
    }
  } else {
    data.value = authStore.user
  }
}

watch(() => appStore.idProfile,
  (newId) => {
    if (newId) {
      fetchProfileData()
    }
  },
  { immediate: true }
)

const handleFollow = async (id) =>{
    try {
        await followUserApi(id)
    } catch (error) {
        isError.value = true
        toastText.value = "Lỗi khi theo dõi chuyên gia: " + error.message
        toastVisible.value = true
    } finally {
        fetchProfileData()
        appStore.isFetchProfile = true,
        isError.value = false
        toastText.value = "Đã theo dõi chuyên gia thành công"  
        toastVisible.value = true
    }
}
const handleUnFollow = async (id) =>{
    try {
        await unfollowUserApi(id)
    } catch (error) {
        isError.value = true
        toastText.value = "Lỗi khi thủy heo dõi chuyên gia: " + error.message
        toastVisible.value = true
    } finally {
        fetchProfileData()
        appStore.isFetchProfile = true,
        isError.value = false
        toastText.value = "Hủy theo dõi chuyên gia thành công"  
        toastVisible.value = true
    }
}
</script>

<style scoped>

.profile-container {
  margin: 0 156px;
  background-color: #ffffff;
  height: 100%;
  width: auto;
}

.profile-content {
  padding: 0 32px;
}

.profile-header-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.btn-secondary{
    background-color: #e4e6eb;
    border: none;
    border-radius: 6px;
    color: #050505;
}

.icon-sm{
    width: 16px;
    height: 16px;
}

.avatar-section {
  margin-top: 36px; 
  margin-right: 26px;
}

.avatar-wrapper {
  width: 168px;
  height: 168px;
  border-radius: 50%;
  border: 1px solid #cecece;
  background-color: #ffffff;
  overflow: hidden;
}

.avatar-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.user-info {
  flex: 1;
  margin-bottom: 48px;
}

.user-name {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #050505;
  line-height: 1.2;
}

.follower-stats {
  font-size: 15px;
  color: #65676b;
  font-weight: 500;
  margin-top: 4px;
}

/* --- Action Buttons --- */
.action-buttons {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding-bottom: 16px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  height: 36px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

/* --- Divider & Tabs --- */
.divider {
  height: 1px;
  background-color: #ced0d4;
  margin: 0;
}

.nav-tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.tabs-list {
  display: flex;
}

.tab {
  padding: 16px 16px;
  font-weight: 600;
  color: #65676b;
  font-size: 15px;
  cursor: pointer;
  border-radius: 6px;
  margin-right: 4px;
  display: flex;
  align-items: center;
}

.tab:hover {
  background-color: #f2f2f2;
}

.tab.active {
  color: #0866ff;
  border-radius: 0;
  border-bottom: 3px solid #0866ff;
  padding-bottom: 13px; 
}

.btn-more {
  background-color: #e4e6eb;
  border: none;
  border-radius: 6px;
  width: 48px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.btn-more:hover {
  background-color: #d8dadf
}

@media (max-width: 768px) {
  .profile-header-main {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .avatar-section {
    margin-right: 0;
  }
  
  .mutual-friends {
    justify-content: center;
  }
  
  .action-buttons {
    align-items: center;
    margin-top: 16px;
  }
  
  .nav-tabs {
    overflow-x: auto;
  }
}
</style>