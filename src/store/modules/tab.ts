import { defineStore } from 'pinia';
import * as NprogressFn from '@/utils/nprogress';
import { useRouterStore } from './router';

export const useTabStore = defineStore('tab', {
  state: (): {
    tabs: Array<{
      path: string;
      keepAlive?: boolean;
      title?: string;
    }>;
    activeTab: string;
    reloading: boolean;
  } => ({
    tabs: [],
    activeTab: '',
    reloading: false,
  }),
  getters: {
    activeIndex(): number {
      return this.tabs.findIndex((item) => item.path === this.activeTab);
    },
  },
  actions: {
    async setActiveTab(path: string): Promise<void> {
      await nextTick(); // tab栏dom更新完再设置激活，让tab栏定位到新增的tab上生效
      this.activeTab = path;
    },
    setTabs(tabs: Array<{ path: string; keepAlive?: boolean }>): void {
      this.tabs = tabs;
    },
    addTab(tab: { path: string; keepAlive?: boolean } = { path: '' }): void {
      const findIndex = this.tabs.findIndex((item) => item.path === tab.path);
      console.log('🚀 ~ addTab ~ findIndex:', findIndex);
      // 如果 findIndex 返回的索引不是 -1，表示已经存在相同路径的标签页，此时需要更新现有标签页。
      if (findIndex !== -1) {
        this.tabs.splice(findIndex, 1, tab);
      } else {
        // 否则，将新的标签页添加到标签页数组中。
        this.setTabs([...this.tabs, tab]);
      }
      this.setActiveTab(tab.path);
    },
    async reloadTab(path: string, keepAlive: boolean): Promise<void> {
      const findItem = this.tabs.find((item) => item.path === path);
      if (!findItem) return;
      // 更新key可让keepAlive失效
      if (keepAlive) findItem.keepAlive = false;
      NprogressFn.start();
      this.reloading = true;
      await nextTick();
      this.reloading = false;
      findItem.keepAlive = !!keepAlive;
      setTimeout(() => {
        document.documentElement.scrollTo({ left: 0, top: 0 });
        NprogressFn.close();
      }, 100);
    },
    async removeTab(path: string): Promise<void> {
      this.setTabs(this.tabs.filter((tab) => tab.path !== path));
      if (path === this.activeTab) {
        useRouterStore().router?.push(this.tabs[this.tabs.length - 1].path);
      }
    },
    removeOther(curPath = this.activeTab): void {
      this.setTabs(this.tabs.filter((tab) => tab.path === curPath));
      if (curPath !== this.activeTab) {
        useRouterStore().router?.push(this.tabs[this.tabs.length - 1].path);
      }
    },
    removeLeft(curPath: string): void {
      const curIndex = this.tabs.findIndex((item) => item.path === curPath);
      const filterTabs = this.tabs.filter((item, index) => index >= curIndex);
      this.setTabs(filterTabs);
      if (!filterTabs.find((item) => item.path === this.activeTab)) {
        useRouterStore().router?.push(filterTabs[filterTabs.length - 1].path);
      }
    },
    removeRight(curPath: string): void {
      const curIndex = this.tabs.findIndex((item) => item.path === curPath);
      const filterTabs = this.tabs.filter((item, index) => index <= curIndex);
      this.setTabs(filterTabs);
      if (!filterTabs.find((item) => item.path === this.activeTab.value)) {
        useRouterStore().router?.push(filterTabs[filterTabs.length - 1].path);
      }
    },
    resetTabs(): void {
      this.$reset();
    },
  },
  persist: {
    paths: ['tabs'],
    storage: sessionStorage,
  },
});
