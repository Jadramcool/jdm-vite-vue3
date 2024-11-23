// 定义user数据
// store/modules/user.ts
import { defineStore } from 'pinia';

const defaultUser = {
  id: 0,
  username: '',
  name: '',
  status: 1,
};

interface UserState {
  userInfo: System.User;
}

// 第一个参数是应用程序中 store 的唯一 id
export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userInfo: defaultUser,
  }),
  getters: {
    getUser: (state) => state.userInfo,
  },
  actions: {
    setUser(info: any) {
      this.userInfo = { ...this.userInfo, ...info };
    },
    resetUser() {
      this.userInfo = defaultUser;
    },
  },

  // 开始数据持久化
  // userinfo不能持久化,不然刷新页面会丢失
  // persist: true,
  // https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/config.html  配置持久化
});
