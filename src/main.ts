import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/index';
import store from './store/index'; // 在vue中使用pinia

const app = createApp(App);

app.use(router);

app.use(store);

app.mount('#app');
