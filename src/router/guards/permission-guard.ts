import { useAuthStore, usePermissionStore, useUserStore } from '@/store';
import { getMenus, getUserInfo } from '@/store/helper';

// ---------------判断是否需要登录---------------
const needLoginTag = import.meta.env.VITE_NEED_LOGIN === 'true';
const localRouteMode = import.meta.env.VITE_ROUTER_MODE;
// ---------------判断是否需要登录---------------

const WHITE_LIST = ['/login', '/404'];
export function createPermissionGuard(router: any) {
  router.beforeEach(async (to: any) => {
    try {
      const permissionStore = usePermissionStore();
      if (!needLoginTag) {
        // TODO 先做不登陆+本地路由
        if (localRouteMode === 'local') {
          if (permissionStore.menus.length === 0) {
            const localRouter = (
              await import(`../local-router/${import.meta.env.VITE_ROUTER_LOCAL_NAME}`)
            ).default;

            permissionStore.setMenusLocal(localRouter);
            permissionStore.setRoutesLocal(localRouter);
            await router.addRoute(permissionStore.accessRoutes);
            return { ...to };
          }
        }

        return true;
      }
      if (needLoginTag) {
        const authStore = useAuthStore();
        const { token } = authStore;
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
          // const [user, permissions] = await Promise.all([getUserInfo(), getMenus()]);
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
          permissionStore.setRoutes(menus, user);
          await router.addRoute(permissionStore.accessRoutes);
          return { ...to, replace: true };
        }

        const routes = router.getRoutes();
        if (routes.find((route: any) => route.name === to.name)) return true;
        console.warn('没有权限，跳转到404页面');
        return { name: '404', query: { path: to.fullPath } };

        // 判断是无权限还是404
        // const { data: hasMenu } = await api.validateMenuPath(to.path);
        // return hasMenu
        //   ? { name: '403', query: { path: to.fullPath }, state: { from: 'permission-guard' } }
        //   : { name: '404', query: { path: to.fullPath } };
      }
    } catch (error) {
      console.error(error);
    }
  });
}
