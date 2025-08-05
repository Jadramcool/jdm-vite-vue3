/*
 * @Author: jdm
 * @Date: 2024-08-01 18:30:07
 * @LastEditors: jdm
 * @LastEditTime: 2024-09-24 11:07:31
 * @FilePath: \vite-vue3-jdm\src\main.ts
 * @Description: main.ts
 *
 */
import { i18n } from '@/locales';
import store from '@/store';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import calendar from 'dayjs/plugin/calendar';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import 'virtual:uno.css';
import { createApp } from 'vue';
import App from './App.vue';
import setDirectives from './directives';
import { setupRouter } from './router';
import './style.css';

const start = async () => {
  const app = createApp(App);

  // 初始化 i18n 实例
  // const i18n = await createI18nInstance();
  app.config.globalProperties.$t = i18n.global.t;
  app.use(i18n);

  app.use(store);

  // 注册路由
  await setupRouter(app);

  app.use(setDirectives);

  dayjs.locale('zh-cn');
  dayjs.extend(isSameOrAfter);
  dayjs.extend(isSameOrBefore);
  dayjs.extend(calendar);

  app.mount('#app');

  // 在生产环境中使用mock服务
  // if (process.env.NODE_ENV === 'production') {
  //   import('./mockProdServer').then(({ setupProdMockServer }) => {
  //     setupProdMockServer();
  //   });
  // }
};

start();
