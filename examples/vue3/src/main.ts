import { createApp } from 'vue';

import App from './App.vue';
import { Modal } from '@arco-design/web-vue';

import 'vant/lib/index.css';

const app = createApp(App);
Modal._context = app._context;
app.mount('#app');
