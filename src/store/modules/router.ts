import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

export const useRouterStore = defineStore('router', {
  state: () => ({
    router: useRouter(),
    route: useRouter().currentRoute,
  }),

  getters: {
    // 获取当前route
    currentRoute: (state) => state.route,
  },

  actions: {
    // 清空router
    resetRouter(accessRoutes: any[]) {
      accessRoutes.forEach((item: any) => {
        if (this.router.hasRoute(item.code)) {
          this.router.removeRoute(item.code);
        }
      });
      // 删除首页，因为首页会根据用户角色变化
      this.router.removeRoute('pageHome');
    },
  },
});
