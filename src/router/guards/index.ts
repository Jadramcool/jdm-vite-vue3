import { createHttpGuard } from './http-guard';
import { createPageLoadingGuard } from './page-loading-guard';
import { createPageTitleGuard } from './page-title-guard';
import { createPerformanceGuard } from './performance-guard';
import { createPermissionGuard } from './permission-guard';
import { createTabGuard } from './tab-guard';

export function setupRouterGuards(router: any) {
  if (import.meta.env.VITE_ENABLE_PERFORMANCE_MONITOR === 'true') {
    createPerformanceGuard(router); // 路由性能监控守卫
  }
  createHttpGuard(router);
  createPageLoadingGuard(router);
  createPermissionGuard(router);
  createPageTitleGuard(router);
  createTabGuard(router);
}
