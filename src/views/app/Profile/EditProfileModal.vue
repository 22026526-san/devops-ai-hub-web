<template>
    <Teleport to="body">
        <div v-if="isOpen" class="modal-overlay" @click="closeModal">

            <div class="edit-modal" @click.stop>

                <div class="modal-header">
                    <h2 class="modal-title">Chỉnh sửa chi tiết</h2>
                    <X @click="closeModal"/>
                </div>

                <div class="modal-body">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" v-model="formData.fullName" placeholder="Ví dụ: Nguyen Van A" />
                    </div>

                    <div class="form-group">
                        <label>Công việc</label>
                        <input type="text" v-model="formData.jobTitle" placeholder="Ví dụ: Backend Developer" />
                    </div>

                    <div class="form-group">
                        <label>Link GitHub</label>
                        <input type="url" v-model="formData.githubUrl" placeholder="https://github.com/your-username" />
                    </div>

                    <div class="form-group">
                        <label>Link Bio</label>
                        <input v-model="formData.bio" rows="3" placeholder="https://bio.com/your-bio"></input>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-cancel" @click="closeModal">Hủy</button>
                    <button class="btn btn-save" @click="handleSave">Lưu thay đổi</button>
                </div>

            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { X } from 'lucide-vue-next';
import { ref,watch } from 'vue';

const props = defineProps({
    isOpen: { type: Boolean, required: true },
    userData: { type: Object, required: true }
});


const emit = defineEmits(['update:isOpen', 'save']);

const formData = ref({
    fullName: '',
    jobTitle: '',
    bio: '',
    githubUrl: '',
});

watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        formData.value = {
            fullName: props.userData?.fullName !== 'string' ? props.userData?.fullName : '',
            jobTitle: props.userData?.jobTitle !== 'string' ? props.userData?.jobTitle : '',
            bio: props.userData?.bio !== 'string' ? props.userData?.bio : '',
            githubUrl: props.userData?.githubUrl !== 'string' ? props.userData?.githubUrl : '',
        };
    }
});


const closeModal = () => {
    emit('update:isOpen', false);
};

const handleSave = () => {
    emit('save', formData.value);
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
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
}


.edit-modal {
    background-color: #ffffff;
    width: 90%;
    max-width: 500px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    max-height: 90vh;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e5e7eb;
}

.modal-title {
    margin: 0;
    font-size: 20px;
    color: #1f2937;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: #6b7280;
    cursor: pointer;
    transition: color 0.2s;
}

.close-btn:hover {
    color: #1f2937;
}

.modal-body {
    padding: 20px;
    overflow-y: auto;
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 6px;
}

.form-group input {
    width: 94%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    color: #1f2937;
    outline: none;
    transition: border-color 0.2s;
    font-family: inherit;
}

.form-group input:focus {
    border-color: #3b82f6;
}

.disabled-input {
    background-color: #f3f4f6;
    color: #9ca3af !important;
    cursor: not-allowed;
}

.modal-footer {
    padding: 16px 20px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.btn {
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 6px;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
}

.btn-cancel {
    background-color: #f3f4f6;
    color: #4b5563;
}

.btn-cancel:hover {
    background-color: #e5e7eb;
}

.btn-save {
    background-color: #1877f2;
    color: #ffffff;
}

.btn-save:hover {
    background-color: #166fe5;
}
</style>