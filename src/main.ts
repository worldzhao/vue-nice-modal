import 'modern-normalize/modern-normalize.css';
import 'tailwindcss/tailwind.css';
import 'vant/lib/index.css';
import routes from 'virtual:generated-pages';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import { VueQueryPlugin } from '@tanstack/vue-query';

import App from './App.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from) => {
  if (to.path === '/') return { name: 'home' };
});

createApp(App).use(router).use(VueQueryPlugin).mount('#app');
