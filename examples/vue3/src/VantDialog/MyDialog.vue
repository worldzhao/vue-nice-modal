<script setup lang="ts">
import { Dialog } from 'vant';
import { useModal } from 'vue-nice-modal';

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
  <Dialog
    :show="modal.visible.value"
    @cancel="handleCancel"
    @confirm="handleConfirm"
    @closed="modal.remove"
    :title="title"
    :content="content"
    show-cancel-button
    class="demo-dialog"
  >
    <img
      :style="{ height: '256px' }"
      src="https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg"
    />
  </Dialog>
</template>

<style scoped>
.demo-dialog img {
  box-sizing: border-box;
  width: 100%;
  padding: 25px 20px 0;
}
</style>
