<template>
    <Teleport to="body">
        <div v-if="confirmStore.isOpen" class="confirm-overlay" @click="confirmStore.cancel">

            <div class="confirm-modal" @click.stop>
                <div class="confirm-title">{{ confirmStore.title }}</div>
                <div class="confirm-message">{{ confirmStore.message }}</div>

                <div class="confirm-actions">
                    <button class="btn-text btn-cancel" @click="confirmStore.cancel">Huỷ</button>
                    <button class="btn-text btn-danger" @click="confirmStore.accept">Có</button>
                </div>
            </div>

        </div>
    </Teleport>
</template>

<script setup>
import { useConfirmStore } from '@/stores/confim.store';
const confirmStore = useConfirmStore();
</script>

<style scoped>
.confirm-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
}

.confirm-modal {
    background-color: #f0f4f9;
    width: 90%;
    max-width: 400px;
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
}

.confirm-title {
    font-size: 20px;
    color: #1f1f1f;
    margin-bottom: 12px;
}

.confirm-message {
    font-size: 14px;
    color: #444746;
    margin-bottom: 24px;
    line-height: 1.5;
}

.confirm-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}

.btn-text {
    background: none;
    border: none;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-text:hover {
    background-color: #e2e7ec;
}

.btn-cancel {
    color: #0b57d0;
}

.btn-danger {
    color: #ea4335;
}

/* Màu đỏ cho nút Xóa */
</style>