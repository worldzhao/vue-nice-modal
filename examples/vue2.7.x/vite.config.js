import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'vue-demi': path.resolve(__dirname, './node_modules/vue-demi'),
    },
  },
});
