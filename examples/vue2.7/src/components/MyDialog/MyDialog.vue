<template>
  <el-dialog
    :title="title"
    :visible="modal.visible.value"
    width="30%"
    @close="handleCancel"
    @closed="modal.remove"
  >
    <span>这是一段信息 {{ content }}</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script setup>
import { useModal } from 'vue-nice-modal';

const modal = useModal();
defineProps(['title', 'content']);

const handleCancel = () => {
  modal.reject('cancel');
  modal.hide();
};

const handleConfirm = () => {
  modal.resolve('confirm');
  modal.hide();
};
</script>
