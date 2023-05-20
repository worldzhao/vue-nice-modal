import path from 'node:path';
import { defineConfig } from 'vite';
import { checker } from 'vite-plugin-checker';
import inspect from 'vite-plugin-inspect';
import pages from 'vite-plugin-pages';
import svgLoader from 'vite-svg-loader';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  plugins: [vue(), vueJsx(), svgLoader(), pages({ importMode: 'async' }), checker({ vueTsc: true }), inspect()],
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
});
