// 定义user数据
// store/modules/user.ts
import { defineStore } from 'pinia';

// 第一个参数是应用程序中 store 的唯一 id
export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
  }),
  getters: {},
  actions: {
    setUser(info: any) {
      this.userInfo = info;
    },
  },

  // 开始数据持久化
  // userinfo不能持久化,不然刷新页面会丢失
  // persist: true,
  // https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/config.html  配置持久化
});
