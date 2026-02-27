import type { Router } from 'vue-router';
import { performanceMonitor } from '@/utils/performance';

/**
 * 创建性能监控守卫
 * 用于监控路由切换性能
 */
export function createPerformanceGuard(router: Router) {
  router.beforeEach((to, _from, next) => {
    // 开始测量路由切换时间
    performanceMonitor.startMeasure(`route-change:${to.path}`);
    next();
  });

  router.afterEach((to) => {
    // 页面加载完成后结束测量
    // 使用 requestAnimationFrame 确保在渲染完成后触发
    requestAnimationFrame(() => {
      // 再次 requestAnimationFrame 确保 Vue 渲染周期结束
      requestAnimationFrame(() => {
        performanceMonitor.endMeasure(`route-change:${to.path}`);
      });
    });
  });
}
