<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <h1 class="bg-gray-600">HomePage</h1>
  <button @click="router.push('/blog')">to blog index page</button>
</template>

<route>
  {
    name: "home",
    meta: {
      requiresAuth: false
    }
  }
  </route>
