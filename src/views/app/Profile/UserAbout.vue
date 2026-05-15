<template>
  <div class="about-card">
    <h2 class="card-title">Giới thiệu</h2>

    <div class="info-list">
      <div class="info-item">
        <IdCard class="info-icon" />
        <div class="info-text">
          <strong>Trang cá nhân</strong> Người sáng tạo nội dung
        </div>
      </div>

      <div class="info-item">
        <Mail class="info-icon" />
        <div class="info-text">
          Email <strong>{{ data.email }}</strong>
        </div>
      </div>
      <div class="info-item">
        <BriefcaseBusiness class="info-icon" />
        <div class="info-text" v-if="data.jobTitle !== 'string' && data.jobTitle !== null">
          Công việc <strong>{{ data.jobTitle }}</strong>
        </div>
        <div class="info-text" v-else>
          Công việc <strong>Chưa cập nhật</strong>
        </div>
      </div>

      <div class="info-item">
        <GitPullRequestArrow class="info-icon" />
        <div class="info-text" v-if="data.githubUrl !== 'string' && data.githubUrl !== null">
          GitHub <strong><a :href="data.githubUrl" class="social-link">{{ data.githubUrl }}</a></strong>
        </div>
        <div class="info-text" v-else>
          GitHub <strong>Chưa cập nhật</strong>
        </div>
      </div>

      <div class="info-item">
        <Link class="info-icon" />
        <div class="info-text" v-if="data.bio !== 'string' && data.bio !== null">
          Bio <strong><a :href="data.bio" class="social-link">{{ data.bio }}</a></strong>
        </div>
        <div class="info-text" v-else>
          Bio <strong>Chưa cập nhật</strong>
        </div>
      </div>

      <div class="info-item">
        <Clock class="info-icon" />
        <div class="info-text">
          Tham gia vào {{ formatDate(data.createdAt) }}
        </div>
      </div>
    </div>

    <button class="btn-full" @click="isModalOpen = true">Chỉnh sửa chi tiết</button>

    <EditProfileModal v-model:isOpen="isModalOpen" :userData="data" @save="updateProfileInfo" />
    <ConfirmModal />
  </div>
</template>

<script setup>
import {
  IdCard,
  Mail,
  GitPullRequestArrow,
  Link,
  Clock,
  BriefcaseBusiness
} from 'lucide-vue-next';
import { useAppStore } from '@/stores/app.store';
import { useConfirmStore } from '@/stores/confim.store';
import { ref, watch } from 'vue';
import { getUserProfileByIdApi, updateProfileApi } from '@/api/modules/user.api'
import { formatDate } from '@/utils/format'
import EditProfileModal from '@/views/app/Profile/EditProfileModal.vue';
import ConfirmModal from '@/views/components/ConfirmModal.vue';

const appStore = useAppStore();
const confirmStore = useConfirmStore();
const data = ref([]);
const isModalOpen = ref(false);

const updateProfileInfo = async (newData) => {
  const isConfirmed = await confirmStore.show(
    "Cập nhật thông tin?",
    "Bạn có chắc chắn muốn lưu những thay đổi này? Thông tin mới sẽ được hiển thị trên trang cá nhân của bạn."
  );
  if (!isConfirmed) return;
  try {
    await updateProfileApi(newData)
  } catch (error) {
    console.error("Lỗi cập nhật hồ sơ:", error);
  } finally {
    appStore.isUpdateProfile = true
  }
};

const fetchInfoUser = async () => {
  appStore.setAppLoading(true)
  try {
    const response = await getUserProfileByIdApi(appStore.idProfile)
    data.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu hồ sơ:', error)
  } finally {
    appStore.setAppLoading(false)
    appStore.isUpdateProfile = false
  }
}

watch(
  () => [appStore.idProfile, appStore.isUpdateProfile],
  ([newIdProfile, newUpdateProfile]) => {
    if (newIdProfile || newUpdateProfile) {
      fetchInfoUser()
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.about-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  width: auto;
  max-width: 368px;
  color: #050505;
  border: 1px solid #e0e0e0;
  margin-bottom: 16px;
  height: auto;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #050505;
}

.btn-full {
  width: 100%;
  background-color: #e4e6eb;
  color: #050505;
  border: none;
  border-radius: 6px;
  padding: 8px 0;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 16px;
}

.btn-full:hover {
  background-color: #d8dadf;
}


.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}


.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-icon {
  width: 20px;
  height: 20px;
  color: #8c939d;
  flex-shrink: 0;
}

.info-text {
  font-size: 15px;
  color: #050505;
  display: flex;
  gap: 6px;
}

.info-text strong {
  font-weight: 600;
}

.social-link {
  color: #212121;
  text-decoration: none;
  font-weight: 600;
  display: block;
}

.social-link:hover {
  text-decoration: underline;
}
</style>