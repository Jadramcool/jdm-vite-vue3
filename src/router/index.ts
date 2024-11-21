import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import { basicRoutes } from './basic-routes';
import { setupRouterGuards } from './guards';

export const router = createRouter({
  history:
    import.meta.env.VITE_USE_HASH === 'true'
      ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH || '/')
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH || '/'),
  routes: basicRoutes, // 路由配置
  scrollBehavior: () => ({ left: 0, top: 0 }), // 滚动行为
});

export async function setupRouter(app: any) {
  app.use(router);
  setupRouterGuards(router);
  await router.isReady();
}
