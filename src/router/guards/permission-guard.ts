import { useAuthStore, useConfigStore, usePermissionStore, useUserStore } from '@/store';
import { getMenus, getOnlineMenus, getUserInfo } from '@/store/helper';

const WHITE_LIST = ['/login', '/404', '/403'];

const needLoginTag = import.meta.env.VITE_NEED_LOGIN === 'true';
const localRouteMode = import.meta.env.VITE_ROUTER_MODE;

function checkRouteExists(router: any, to: { name: unknown }) {
  return router.getRoutes().some((route: { name: unknown }) => route.name === to.name);
}

function createAccessDeniedHandler(to: { fullPath: string }) {
  console.warn('没有权限，跳转到404页面');
  return { name: '404', query: { path: to.fullPath } };
}

export function createPermissionGuard(router: any) {
  router.beforeEach(async (to: any) => {
    try {
      const permissionStore = usePermissionStore();
      const authStore = useAuthStore();
      const configStore = useConfigStore();
      const { token } = authStore;

      // 初始化全局配置
      try {
        await configStore.initConfig();
      } catch (error) {
        console.warn('全局配置初始化失败，但不影响正常使用:', error);
      }

      // 混合模式：根据token存在与否决定走哪种流程
      const shouldUseLoginFlow = needLoginTag || !!token;
      if (!shouldUseLoginFlow) {
        // 不登录流程
        if (localRouteMode === 'local') {
          if (permissionStore.menus.length === 0) {
            const localRouter: any = await import(`../local-router/router-config.ts`);
            permissionStore.setMenusLocal(localRouter?.default);
            permissionStore.setRoutesLocal(localRouter?.default);
            await router.addRoute(permissionStore.accessRoutes);
            return { ...to };
          }
        } else {
          if (permissionStore.menus.length === 0) {
            const menus = await getOnlineMenus();
            if (!menus) {
              window.$message.error('路由初始化失败，请刷新页面重试！');
              return;
            }

            permissionStore.setPermissions(menus);
            permissionStore.setMenus(menus);
            permissionStore.setRoutes(menus);
            await router.addRoute(permissionStore.accessRoutes);
            return { ...to, replace: true };
          }
          if (checkRouteExists(router, to)) return true;
          return createAccessDeniedHandler(to);
        }
      }
      if (shouldUseLoginFlow) {
        if (!token) {
          console.warn('没有token，跳转到登录页');
          if (WHITE_LIST.includes(to.path)) return true;
          return { path: 'login', query: { ...to.query, redirect: to.path } };
        }

        if (to.path === '/login') return { path: '/' };

        if (WHITE_LIST.includes(to.path)) return true;
        const userStore = useUserStore();
        if (!userStore.userInfo || !userStore.userInfo.id) {
          const [user, menus] = await Promise.all([
            getUserInfo(),
            getMenus(),
            configStore.initConfig().catch((err) => console.warn('全局配置初始化失败:', err)),
          ]);

          if (!user || (user && Object.keys(user).length === 0)) {
            window.$message.error('用户信息或权限初始化失败，请刷新页面重试！');
            authStore.resetLoginState();
            return { path: 'login', query: { ...to.query, redirect: to.path } };
          }
          userStore.setUser(user);

          if (!menus) {
            window.$message.error('路由初始化失败，请刷新页面重试！');
            return;
          }

          permissionStore.setPermissions(menus);
          permissionStore.setMenus(menus);
          permissionStore.setRoutes(menus);
          await router.addRoute(permissionStore.accessRoutes);
          return { ...to, replace: true };
        }

        if (checkRouteExists(router, to)) return true;
        return createAccessDeniedHandler(to);
      }
    } catch (error) {
      console.error(error);
    }
  });
}
