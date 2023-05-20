<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const blogs = reactive([
  { id: 1, title: 'blog 1' },
  { id: 2, title: 'blog 2' },
  { id: 3, title: 'blog 3' },
]);
</script>

<template>
  <div>blog index page</div>
  <ul>
    <li v-for="{ id, title } in blogs" :key="id">
      <button @click="router.push(`/blog/${encodeURIComponent(id)}`)">
        <span class="text-green text-lg">{{ title }}</span>
      </button>
    </li>
  </ul>
</template>

<style scoped></style>
