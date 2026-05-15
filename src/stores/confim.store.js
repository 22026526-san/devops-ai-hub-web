import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useConfirmStore = defineStore('confirm', () => {
  const isOpen = ref(false);
  const title = ref('');
  const message = ref('');
  
  const resolvePromise = ref(null);

  const show = (modalTitle, modalMessage) => {
    title.value = modalTitle;
    message.value = modalMessage;
    isOpen.value = true;

    return new Promise((resolve) => {
      resolvePromise.value = resolve;
    });
  };

  const accept = () => {
    isOpen.value = false;
    if (resolvePromise.value) resolvePromise.value(true);
  };

  const cancel = () => {
    isOpen.value = false;
    if (resolvePromise.value) resolvePromise.value(false);
  };

  return { isOpen, title, message, show, accept, cancel };
});