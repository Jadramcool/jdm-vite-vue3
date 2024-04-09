import { defineStore } from 'pinia';
import { useDark } from '@vueuse/core';
import { defaultLayout, naiveThemeOverrides } from '@/settings';

export const useAppStore = defineStore('app', {
  state: () => ({
    collapsed: false, // 侧边栏是否折叠
    isDark: useDark(),
    layout: defaultLayout, // 布局配置
    naiveThemeOverrides, // naive-ui 主题配置
    showBreadcrumb: true, // 是否显示面包屑
  }),
  actions: {
    // 切换侧边栏折叠状态
    switchCollapsed() {
      this.collapsed = !this.collapsed;
    },
    // 设置侧边栏折叠状态
    setCollapsed(b: any) {
      this.collapsed = b;
    },
    // 切换暗黑模式
    toggleDark() {
      this.isDark = !this.isDark;
    },
  },
  persist: {
    paths: ['collapsed', 'naiveThemeOverrides'],
    storage: sessionStorage,
  },
});
