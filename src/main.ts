import { createApp } from 'vue';
import './style.css';
import './assets/styles/style.scss';
import i18n from '@/locales/index';
import App from './App.vue';
import { setupRouter } from './router';
import store from './store/index'; // 在vue中使用pinia
import 'virtual:uno.css';

const start = async () => {
  const app = createApp(App);

  app.use(i18n);

  app.use(store);

  // 注册路由
  await setupRouter(app);

  app.mount('#app');

  // 在生产环境中使用mock服务
  if (process.env.NODE_ENV === 'production') {
    import('./mockProdServer').then(({ setupProdMockServer }) => {
      setupProdMockServer();
    });
  }
};

start();
