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
        if (this.router.hasRoute(item.name)) {
          this.router.removeRoute(item.name);
        }
      });
    },
  },
});
