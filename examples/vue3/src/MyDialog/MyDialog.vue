<script setup lang="ts">
import { ref } from 'vue';
import { Dialog } from 'vant';
import { INiceModalHandlers } from 'vue-nice-modal';
// inject hide/remove/callback methods by vue-nice-modal
interface IProps extends INiceModalHandlers<number> {
  visible: boolean;
  // props you need
  title: string;
  content: string;
}

interface IEmits {
  (e: 'update:visible', visible: boolean): void;
}

const props = defineProps<IProps>();

// @ts-ignore
const emit = defineEmits<IEmits>();

const loading = ref(false);

const handleCancel = () => {
  props.hide(); // or emit('update:visible', false)
  props.callback('cancel'); // reject the promise
};

const handleConfirm = async () => {
  // mock async function call
  const sleep = (ms: number): Promise<number> =>
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
};
</script>

<template>
  <Dialog
    :show="visible"
    @update:show="(val) => $emit('update:visible', val)"
    @cancel="handleCancel"
    @confirm="handleConfirm"
    @closed="remove"
    :title="title"
    :content="content"
    show-cancel-button
    class="demo-dialog"
  >
    <img src="https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg" />
  </Dialog>
</template>

<style scoped>
.demo-dialog img {
  box-sizing: border-box;
  width: 100%;
  padding: 25px 20px 0;
}
</style>
