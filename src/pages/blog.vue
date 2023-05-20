<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <h2>this is blog layout</h2>
  <RouterView />
</template>

<style scoped></style>

<route>
  {
    name: "blog",
    meta: {
      requiresAuth: true
    }
  }
  </route>
