<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click="closeModal">

      <div class="fb-modal" @click.stop>

        <div class="modal-header">
          <h2 class="modal-title">Chỉnh sửa trang cá nhân</h2>
          <div class="close-btn-circle" @click="closeModal">
            <X size="20" color="#65676b" />
          </div>
        </div>

        <div class="modal-body">

          <div class="profile-section">
            <div class="section-header">
              <h3>Ảnh đại diện</h3>
              <input type="file" ref="avatarInputRef" @change="onAvatarChange" accept="image/*" hidden />
              <button class="edit-link-btn" @click="triggerUpload(avatarInputRef)">Chỉnh sửa</button>
            </div>
            <div class="avatar-preview-container">
              <img :src="avatarUrl || defaultAvatar" alt="Avatar" class="avatar-img" />
              <button v-if="avatarUrl" class="remove-avatar-btn" @click="handleRemoveAvatar" title="Xóa ảnh đại diện">
                <Trash size="16" stroke-width="3" />
              </button>
            </div>
          </div>

          <div class="profile-section">
            <div class="section-header">
              <h3>Tên đăng nhập</h3>
              <button class="edit-link-btn" @click="toggleEdit('username')">
                {{ editMode.username ? 'Xong' : 'Chỉnh sửa' }}
              </button>
            </div>
            <div class="section-content">
              <input v-if="editMode.username" type="text" v-model="formData.username" class="fb-input" />
              <span v-else class="text-value">{{ formData.username || 'Chưa cập nhật' }}</span>
            </div>
          </div>

          <div class="profile-section">
            <div class="section-header">
              <h3>Email</h3>
              <button class="edit-link-btn" @click="toggleEdit('email')">
                {{ editMode.email ? 'Xong' : 'Chỉnh sửa' }}
              </button>
            </div>
            <div class="section-content">
              <input v-if="editMode.email" type="email" v-model="formData.email" class="fb-input" />
              <span v-else class="text-value">{{ formData.email || 'Chưa cập nhật' }}</span>
            </div>
          </div>

          <div class="profile-section border-none">
            <div class="section-header">
              <h3>Mật khẩu</h3>
              <button class="edit-link-btn" @click="toggleEdit('password')">
                {{ editMode.password ? 'Xong' : 'Chỉnh sửa' }}
              </button>
            </div>
            <div class="section-content">
              <input v-if="editMode.password" type="text" v-model="formData.password" placeholder="Nhập mật khẩu mới..."
                class="fb-input" />
              <span v-else class="text-value">********</span>
            </div>
          </div>

        </div>

        <div class="modal-footer">
          <button class="btn-fb-primary" @click="handleSave">Lưu tất cả thay đổi</button>
        </div>

      </div>
      <ConfirmModal />
      <ToastMessage v-model="toastVisible" :text="toastText" :is-success="!isError" :is-error="isError" />
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Trash, X } from 'lucide-vue-next';
import defaultAvatar from '@/assets/img/user_default.png';
import ConfirmModal from '@/views/components/ConfirmModal.vue';
import ToastMessage from '@/components/ToastMessage.vue';
import { useConfirmStore } from '@/stores/confim.store';
import { useAppStore } from '@/stores/app.store';
import { deleteAvatarApi, updateAvatarApi } from '@/api/modules/user.api';
const props = defineProps({
  isOpen: { type: Boolean, required: true },
  userData: { type: Object, required: true }
});

const emit = defineEmits(['update:isOpen', 'save']);

const avatarUrl = ref(null);
const avatarInputRef = ref(null);
const confirmStore = useConfirmStore();
const appStore = useAppStore();
const toastVisible = ref(false)
const toastText = ref('')
const isError = ref(false)
const editMode = ref({ username: false, email: false, password: false });


const formData = ref({
  username: '',
  email: '',
  password: ''
});


watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    formData.value = {
      username: props.userData?.username || '',
      email: props.userData?.email || '',
      password: ''
    };
    avatarUrl.value = props.userData?.avatarUrl
    editMode.value = { username: false, email: false, password: false };
  }
});

const triggerUpload = (inputRef) => {
  if (inputRef) inputRef.click();
};


const onAvatarChange = (event) => {
  const file = event.target.files[0];
  const allowedTypes = ['image/jpeg', 'image/png'];

  if (file) {
    if (!allowedTypes.includes(file.type)) {
      isError.value = true
      toastText.value = "Chỉ chấp nhận ảnh định dạng JPG, PNG."
      toastVisible.value = true
      event.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      isError.value = true
      toastText.value = "Kích thước ảnh quá lớn, chir cho phép tối đa 2MB."
      toastVisible.value = true
      event.target.value = '';
      return;
    }

    handleUploadAvatar(file);
  }
};
const handleRemoveAvatar = async () => {
  const isConfirmed = await confirmStore.show(
    "Xóa ảnh đại diện?",
    "Bạn có chắc chắn muốn thực hiện thao tác này? Ảnh đại diện này sẽ không được hiển thị trên trang cá nhân của bạn."
  );
  if (!isConfirmed) return;
  appStore.setAppLoading(true)
  try {
    await deleteAvatarApi()
  } catch (error) {
    console.error("Lỗi:", error);
  } finally {
    avatarUrl.value = null;
    appStore.isUpdateProfile = true
    appStore.setAppLoading(false)
  }
}
const handleUploadAvatar = async (file) => {
  const isConfirmed = await confirmStore.show(
    "Thay đổi đại diện?",
    "Bạn có chắc chắn muốn thực hiện thao tác này? Ảnh đại diện này sẽ được hiển thị trên trang cá nhân của bạn."
  );
  if (!isConfirmed) return;
  const form = new FormData();

  form.append('File', file)

  appStore.setAppLoading(true)
  try {
    const response = await updateAvatarApi(form)
    avatarUrl.value = response.data.avatarUrl
  } catch (error) {
    console.error("Lỗi:", error);
  } finally {
    appStore.isUpdateProfile = true
    appStore.setAppLoading(false)
  }
}
const toggleEdit = (field) => {
  editMode.value[field] = !editMode.value[field];
};

const closeModal = () => {
  emit('update:isOpen', false);
};

const handleSave = async () => {
  const isConfirmed = await confirmStore.show(
    "Thay đổi thông tin tài khoản?",
    "Bạn có chắc chắn muốn thực hiện thao tác này? Thông tin tài khoản sẽ được cập nhật lại, vui lòng ghi nhơ thông tin tài khoản."
  );
  if (!isConfirmed) return;
  emit('save', formData);
  closeModal();
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(244, 244, 244, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}


.fb-modal {
  background-color: #ffffff;
  width: 100%;
  max-width: 700px;
  border-radius: 8px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-header {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid #ced0d4;
}

.modal-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #050505;
}

.close-btn-circle {
  position: absolute;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #e4e6eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.close-btn-circle:hover {
  background-color: #d8dadf;
}

.modal-body {
  padding: 0 16px;
  overflow-y: auto;
}

.profile-section {
  padding: 20px 0;
  border-bottom: 1px solid #ced0d4;
}

.profile-section.border-none {
  border-bottom: none;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-header h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: #050505;
}

.edit-link-btn {
  background: none;
  border: none;
  color: #0866ff;
  font-size: 15px;
  font-weight: 400;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.edit-link-btn:hover {
  background-color: #f2f2f2;
}

.avatar-preview-container {
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.avatar-img {
  width: 168px;
  height: 168px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ced0d4;
  display: block;
}

.remove-avatar-btn {
  position: absolute;
  bottom: 0px;
  right: 260px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 1px solid #ced0d4;
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  padding: 0;
}

.remove-avatar-btn:hover {
  background-color: #fecaca;
}


.section-content {
  margin-top: 8px;
}

.text-value {
  font-size: 15px;
  color: #65676b;
}

.fb-input {
  width: 96%;
  padding: 12px;
  border: 1px solid #ced0d4;
  border-radius: 6px;
  font-size: 15px;
  outline: none;
}

.fb-input:focus {
  border-color: #0866ff;
}

.modal-footer {
  padding: 16px;
  border-top: 1px solid #ced0d4;
}

.btn-fb-primary {
  width: 100%;
  padding: 8px;
  background-color: #e7f3ff;
  color: #0866ff;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-fb-primary:hover {
  background-color: #dbe7f2;
}
</style>