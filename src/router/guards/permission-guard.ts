import { useAuthStore, usePermissionStore, useUserStore } from '@/store';
import { getMenus, getOnlineMenus, getUserInfo } from '@/store/helper';

// ---------------判断是否需要登录---------------
const needLoginTag = import.meta.env.VITE_NEED_LOGIN === 'true';
const localRouteMode = import.meta.env.VITE_ROUTER_MODE;
// ---------------判断是否需要登录---------------

const WHITE_LIST = ['/login', '/404', '/403'];
export function createPermissionGuard(router: any) {
  let routes: any[] = [];
  router.beforeEach(async (to: any) => {
    try {
      const permissionStore = usePermissionStore();
      const authStore = useAuthStore();
      const { token } = authStore;

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
            // 路由初始化失败
            if (!menus) {
              window.$message.error('路由初始化失败，请刷新页面重试！');
              return;
            }

            // 设置权限
            permissionStore.setPermissions(menus);
            // 设置菜单
            permissionStore.setMenus(menus);
            // 设置路由
            permissionStore.setRoutes(menus);
            await router.addRoute(permissionStore.accessRoutes);
            routes = router.getRoutes();
            return { ...to, replace: true };
          }
          if (routes.find((route: any) => route.name === to.name)) return true;
          console.warn('没有权限，跳转到404页面');
          return { name: '404', query: { path: to.fullPath } };
        }
      }
      if (shouldUseLoginFlow) {
        // 登录流程
        // 无token的情况
        if (!token) {
          console.warn('没有token，跳转到登录页');
          if (WHITE_LIST.includes(to.path)) return true;
          // 如果在路由守卫中返回一个对象，那么会中断当前的导航，然后进行新的导航
          return { path: 'login', query: { ...to.query, redirect: to.path } };
        }

        // 如果有token，并且是登录页，那么直接跳转到首页
        if (to.path === '/login') return { path: '/' };

        if (WHITE_LIST.includes(to.path)) return true;
        const userStore = useUserStore();
        // 刷新页面时，pinia中的数据会丢失，所以需要重新获取用户信息和权限
        if (!userStore.userInfo || !userStore.userInfo.id) {
          const user: any = await getUserInfo();

          if (!user || (user && Object.keys(user).length === 0)) {
            window.$message.error('用户信息或权限初始化失败，请刷新页面重试！');
            authStore.resetLoginState();
            return { path: 'login', query: { ...to.query, redirect: to.path } };
          }
          userStore.setUser(user);

          const menus = await getMenus();
          // 路由初始化失败
          if (!menus) {
            window.$message.error('路由初始化失败，请刷新页面重试！');
            return;
          }
          // 设置权限
          permissionStore.setPermissions(menus);
          // 设置菜单
          permissionStore.setMenus(menus);
          // 设置路由
          permissionStore.setRoutes(menus);
          await router.addRoute(permissionStore.accessRoutes);
          routes = router.getRoutes();
          return { ...to, replace: true };
        }

        if (routes.find((route: any) => route.name === to.name)) return true;
        console.warn('没有权限，跳转到404页面');
        return { name: '404', query: { path: to.fullPath } };
      }
    } catch (error) {
      console.error(error);
    }
  });
}
