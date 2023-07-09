import { createApp } from 'vue';
import { Icon } from 'vant';
import { VueNiceModalPluginForVue3 } from 'vue-nice-modal';
import App from './App.vue';
import 'vant/lib/index.css';

const app = createApp(App);

app.use(Icon);
// share the app context
app.use(VueNiceModalPluginForVue3);
app.mount('#app');
