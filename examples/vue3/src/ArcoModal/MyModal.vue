<script setup lang="ts">
import { Modal } from '@arco-design/web-vue';
import { useModal } from 'vue-nice-modal';
import '@arco-design/web-vue/es/modal/style/css.js';

interface IProps {
  title: string;
  content: string;
}

defineProps<IProps>();

const modal = useModal();

const handleCancel = () => {
  modal.reject('cancel');
  modal.hide();
};

const handleConfirm = async () => {
  modal.resolve('confirm');
  modal.hide();
};
</script>

<template>
  <Modal
    :visible="modal.visible.value"
    @cancel="handleCancel"
    @ok="handleConfirm"
    @close="modal.remove"
    show-cancel-button
  >
    <template #title>
      {{ title }}
    </template>
    <div>{{ content }}</div>
  </Modal>
</template>

<style scoped></style>
