import cityAddress from '@/assets/json/address.json';
import { defineStore } from 'pinia';

export const useConstantsStore = defineStore('constants', {
  state: () => ({
    cityAddress,
  }),
  getters: {
    getCityAddress: (state) => state.cityAddress,
  },
  actions: {},
});
