<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <div>blog {{ route.params.id }}</div>
</template>

<style lang="scss" scoped></style>
