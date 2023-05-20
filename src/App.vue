<script setup lang="ts">
import { RouterView } from 'vue-router';

import { HelloWorldTSX } from '@/components/HelloWorld';
import HelloWorldSFC from '@/components/HelloWorld.vue';
</script>

<template>
  <main class="bg-gray-100 p-6 text-center text-gray-700">
    <RouterView />
    <HelloWorldTSX
      class="p-4"
      msg="Hello TSX World"
      @click="
        (emitMessage) => {
          console.log(emitMessage);
        }
      "
    />
    <HelloWorldSFC msg="Hello SFC World" />
  </main>
</template>
