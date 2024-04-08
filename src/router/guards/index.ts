import { createPageLoadingGuard } from './page-loading-guard';
import { createPageTitleGuard } from './page-title-guard';
import { createPermissionGuard } from './permission-guard';
import { createTabGuard } from './tab-guard';

export function setupRouterGuards(router: any) {
  createPageLoadingGuard(router);
  createPermissionGuard(router);
  createPageTitleGuard(router);
  createTabGuard(router);
}
