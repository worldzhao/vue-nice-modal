<script setup lang="ts">
import { Provider as NiceModalProvider } from 'vue-nice-modal';
import Example from './Example.vue';
</script>

<template>
  <NiceModalProvider>
    <Example />
  </NiceModalProvider>
</template>
