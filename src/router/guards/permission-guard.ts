import { useAuthStore, usePermissionStore, useUserStore } from '@/store';
// import api from '@/api';
import { getPermissions, getUserInfo } from '@/store/helper';

const WHITE_LIST = ['/login', '/404'];
export function createPermissionGuard(router: any) {
  router.beforeEach(async (to: any) => {
    const authStore = useAuthStore();
    const { token } = authStore;
    // TODO 无token的情况
    if (!token) {
      console.log('没有token，跳转到登录页');
      if (WHITE_LIST.includes(to.path)) return true;
      // 如果在路由守卫中返回一个对象，那么会中断当前的导航，然后进行新的导航
      return { path: 'login', query: { ...to.query, redirect: to.path } };
    }

    // TODO 如果有token，并且是登录页，那么直接跳转到首页
    if (to.path === '/login') return { path: '/' };

    if (WHITE_LIST.includes(to.path)) return true;

    const userStore = useUserStore();
    const permissionStore = usePermissionStore();
    // 刷新页面时，vuex中的数据会丢失，所以需要重新获取用户信息和权限
    if (!userStore.userInfo) {
      const [user, permissions] = await Promise.all([getUserInfo(), getPermissions()]);
      userStore.setUser(user);
      permissionStore.setPermissions(permissions);
      const routeComponents = import.meta.glob('@/views/**/*.vue');
      permissionStore.accessRoutes.forEach((route) => {
        route.component = routeComponents[route.component] || undefined;
        if (!router.hasRoute(route.name)) {
          router.addRoute(route);
        }
        // !router.hasRoute(route.name) && router.addRoute(route);
      });
      return { ...to, replace: true };
    }

    const routes = router.getRoutes();
    console.log('🚀 ~ router.beforeEach ~ routes:', routes);
    if (routes.find((route: any) => route.name === to.name)) return true;
    console.log('没有权限，跳转到403页面');
    return { name: '404', query: { path: to.fullPath } };

    // 判断是无权限还是404
    // const { data: hasMenu } = await api.validateMenuPath(to.path);
    // return hasMenu
    //   ? { name: '403', query: { path: to.fullPath }, state: { from: 'permission-guard' } }
    //   : { name: '404', query: { path: to.fullPath } };
  });
}
