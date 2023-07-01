<script setup lang="ts">
import * as MyDialog from './MyDialog';
import { Button } from 'vant';
import { ref } from 'vue';

const result = ref<number>();

const showDialog = async () => {
  try {
    result.value = (await MyDialog.show({
      title: 'My Dialog Title',
      content: 'My Dialog Content',
    })) as number;
  } catch (error) {
    console.log('reject', error);
  }
};
</script>

<template>
  <div class="demo">
    <Button @click="showDialog">Show Dialog</Button>
    <p>result:{{ result || '-' }}</p>
  </div>
</template>

<style scoped>
.demo {
  margin-top: 72px;
  margin-left: 120px;
}
</style>
