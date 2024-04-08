import * as NprogressFn from '@/utils/nprogress';

export function createPageLoadingGuard(router: any) {
  router.beforeEach(() => {
    NprogressFn.start();
  });

  router.afterEach(() => {
    setTimeout(() => {
      NprogressFn.close();
    }, 200);
  });

  router.onError(() => {
    NprogressFn.error();
  });
}
