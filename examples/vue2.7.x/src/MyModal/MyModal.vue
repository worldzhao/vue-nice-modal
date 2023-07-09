<script setup>
import { Modal } from 'ant-design-vue';
import { ref } from 'vue';

const props = defineProps([
  // inject by vue-nice-modal
  'visible',
  'hide',
  'remove',
  'callback',
  // props you need
  'title',
  'content',
]);

const emit = defineEmits(['update:visible']);

const loading = ref(false);

const handleCancel = () => {
  props.hide(); // or emit('update:visible', false)
  props.callback('cancel', 'cancel payload'); // reject the promise
};

const handleConfirm = async () => {
  // mock async function call
  const sleep = (ms) =>
    new Promise((res) =>
      setTimeout(() => {
        res(ms);
      }, ms)
    );
  loading.value = true;
  const payload = await sleep(1000);
  loading.value = false;

  // resolve the promise with payload
  props.callback('confirm', payload);
  props.hide();
};
</script>
<script>
export default {
  model: {
    prop: 'visible',
    event: 'update:visible',
  },
};
</script>
<template>
  <Modal
    :visible="visible"
    @input="(val) => $emit('update:visible', val)"
    :title="title"
    :afterClose="remove"
    :confirm-loading="loading"
    @cancel="handleCancel"
    @ok="handleConfirm"
  >
    <p>Ant Design Vue Modal</p>
    <p>{{ content }}</p>
  </Modal>
</template>
