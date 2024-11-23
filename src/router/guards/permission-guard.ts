/*
 * @Author: jdm
 * @Date: 2024-05-06 10:22:58
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-21 11:50:36
 * @FilePath: \vite-vue3-jdm\src\router\guards\permission-guard.ts
 * @Description:
 *
 */
import { useAuthStore, usePermissionStore, useUserStore } from '@/store';
import { getMenus, getUserInfo } from '@/store/helper';

const WHITE_LIST = ['/login', '/404'];
export function createPermissionGuard(router: any) {
  router.beforeEach(async (to: any) => {
    try {
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
      const permissionStore = usePermissionStore();
      // 刷新页面时，pinia中的数据会丢失，所以需要重新获取用户信息和权限
      if (!userStore.userInfo || !userStore.userInfo.id) {
        // const [user, permissions] = await Promise.all([getUserInfo(), getMenus()]);
        const user = await getUserInfo();
        const menus = await getMenus();
        userStore.setUser(user);
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
        router.addRoute(permissionStore.accessRoutes);
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
    } catch (error) {
      console.error(error);
    }
  });
}
