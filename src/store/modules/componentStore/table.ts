import componentSetting from '@/settings/componentSettings';
import { defineStore } from 'pinia';

const { table } = componentSetting;

const { tableLayout } = table;

export const useComponentTableStore = defineStore('table', {
  state: () => ({
    size: tableLayout.size,
  }),
  getters: {},
  actions: {},
  // persist: {
  //   paths: ['collapsed', 'naiveThemeOverrides'],
  //   storage: sessionStorage,
  // },
});
