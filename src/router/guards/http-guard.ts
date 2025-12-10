import { Router } from 'vue-router';
import httpRequest from '@/utils/http/axios';

export function createHttpGuard(router: Router) {
  router.beforeEach(async () => {
    // 切换路由时取消所有 pending 请求
    httpRequest.cancelAllRequest();
    return true;
  });
}
