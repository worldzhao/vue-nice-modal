<script setup>
import * as MyModal from './MyModal';
import { Button } from 'ant-design-vue';
import { ref } from 'vue';

const result = ref();

const showDialog = async () => {
  try {
    result.value = await MyModal.show({
      title: 'My Dialog Title',
      content: 'My Dialog Content',
    });
  } catch (error) {
    console.log('reject', error);
  }
};
</script>

<template>
  <div class="demo">
    <Button type="primary" @click="showDialog">Show Dialog</Button>
    <p>result:{{ result || '-' }}</p>
  </div>
</template>

<style scoped>
.demo {
  margin-top: 72px;
  margin-left: 120px;
}
</style>
