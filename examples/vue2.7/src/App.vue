<template>
  <NiceModalProvider>
    <Example />
  </NiceModalProvider>
</template>

<script setup>
import { Provider as NiceModalProvider } from 'vue-nice-modal';
import Example from './Example.vue';
</script>
