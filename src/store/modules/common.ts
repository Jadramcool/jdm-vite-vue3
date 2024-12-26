import { DepartmentApi } from '@/api';
import { defineStore } from 'pinia';

type State = {
  department: Hospital.Department[];
};

export const useCommonStore = defineStore('common', {
  state: (): State => ({
    department: [],
  }),
  getters: {
    getDepartment: (state) => {
      return state.department;
    },
    getDepartmentOptions: (state) => {
      const options = state.department.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      return options;
    },
  },
  actions: {
    async fetchDepartmentList() {
      const res = await DepartmentApi.departmentList({
        filters: {},
        options: {
          showPagination: false,
        },
      });
      this.department = res.data;
    },
  },
});
