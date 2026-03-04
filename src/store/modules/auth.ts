import { usePermissionStore, useRouterStore, useTabStore, useUserStore } from '@/store';
import {
  removeToken,
  setToken as setTokenLocal,
  setRefreshToken,
  removeRefreshToken,
} from '@/utils';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: undefined,
  }),
  actions: {
    setToken({ accessToken, refreshToken, token }: any) {
      if (accessToken) {
        this.token = accessToken;
        setTokenLocal(accessToken);
      } else if (token) {
        // 兼容旧版接口
        this.token = token;
        setTokenLocal(token);
      }
      if (refreshToken) {
        setRefreshToken(refreshToken);
      }
    },
    resetToken() {
      this.$reset();
      removeRefreshToken();
    },
    toLogin() {
      const { router, route } = useRouterStore();
      router.replace({
        path: '/login',
        query: route.query,
      });
    },
    async switchCurrentRole(data: any) {
      this.resetLoginState();
      await nextTick();
      this.setToken(data);
    },
    resetLoginState() {
      const { resetUser } = useUserStore();
      const { resetPermission, permissions } = usePermissionStore();
      const { resetRouter } = useRouterStore();
      const { resetTabs } = useTabStore();
      // 重置路由
      resetRouter(permissions);
      // 重置用户
      resetUser();
      // 重置权限
      resetPermission();
      // 重置Tabs
      resetTabs();
      // 重置token
      this.resetToken();
      removeToken();
    },
    async logout() {
      this.resetLoginState();
      this.toLogin();
    },
  },
  persist: true,
});
