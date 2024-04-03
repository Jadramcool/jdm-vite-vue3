// 定义user数据
// store/modules/user.ts
import { defineStore } from 'pinia';

// 第一个参数是应用程序中 store 的唯一 id
const useUserStore = defineStore('user', {
  state: () => ({
    name: 'hps',
  }),
  getters: {},
  actions: {},

  // 开始数据持久化
  persist: true,
  // https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/config.html  配置持久化
});

export default useUserStore;
