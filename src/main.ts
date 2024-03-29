import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import VueKonva from 'vue-konva';
import App from './App.vue';

import 'ant-design-vue/dist/antd.css';
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(Antd);
app.use(VueKonva);
app.mount('#app');
