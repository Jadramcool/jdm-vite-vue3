import { defineStore } from 'pinia';
import { useDark } from '@vueuse/core';
import { defaultLayout, naiveThemeOverrides } from '@/settings';

export const useAppStore = defineStore('app', {
  state: () => ({
    collapsed: false,
    isDark: useDark(),
    layout: defaultLayout,
    naiveThemeOverrides,
  }),
  actions: {
    switchCollapsed() {
      this.collapsed = !this.collapsed;
    },
    setCollapsed(b: any) {
      this.collapsed = b;
    },
    toggleDark() {
      this.isDark = !this.isDark;
    },
  },
  persist: {
    paths: ['collapsed', 'naiveThemeOverrides'],
    storage: sessionStorage,
  },
});
