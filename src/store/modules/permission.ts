import { arrayToTree, isExternal, renderIcon } from '@/utils/common'; // 导入自定义的 isExternal 函数，用于判断链接是否为外部链接
import { hyphenate } from '@vueuse/core'; // 导入 Vue 通用实用函数库中的 hyphenate 函数
import _ from 'lodash';
import { defineStore } from 'pinia'; // 导入 Pinia 库中的 defineStore 函数

export const routeComponents = import.meta.glob('/src/views/**/*.vue');
// 定义一个名为 usePermissionStore 的 Pinia store
export const usePermissionStore = defineStore('permission', {
  // 定义 store 的初始状态
  state: () => ({
    accessRoutes: <any>{}, // 存储访问路由的数组
    permissions: <any[]>[], // 存储权限的数组
    menus: <any[]>[], // 存储菜单的数组
    buttonPermissions: <any[]>[],
    buttonPermissionKeys: <string[]>[],
  }),
  getters: {
    getButtonPermissionKeys: (state) => state.buttonPermissionKeys,
  },
  // 定义 store 中的 actions
  actions: {
    // 设置权限的
    async setPermissions(menus: System.Menu[]) {
      this.permissions = _.cloneDeep(menus);
    },

    // 设置菜单的
    async setMenus(menus: System.Menu[]) {
      const cloneMenus = _.cloneDeep(menus);

      this.menus = arrayToTree(
        cloneMenus
          .filter((item) => item.type !== 'BUTTON')
          .map((item) => this.getMenuItem(item))
          .filter((item) => !!item)
          .sort(
            (a: System.Menu, b: System.Menu): any => (a.order ?? Infinity) - (b.order ?? Infinity),
          ),
      );
    },

    async setRoutes(menus: System.Menu[]) {
      const cloneMenus = _.cloneDeep(menus);
      this.createRoutes(cloneMenus);
    },

    createRoutes(menus: System.Menu[]) {
      if (!Array.isArray(menus)) {
        throw new Error('无效的参数，请传入菜单数组');
      }
      const btnPermissions: System.Menu[] = []; // 按钮权限
      const nonButtonMenus: System.Menu[] = []; // 非按钮菜单

      const routeCache: { [key: string]: any } = {};

      menus.forEach((item) => {
        if (item.type === 'BUTTON') {
          btnPermissions.push(item);
        } else {
          nonButtonMenus.push(item);
        }
      });

      this.buttonPermissions = btnPermissions;
      this.buttonPermissionKeys = btnPermissions.map((item) => item.code);

      //  非按钮权限
      const formatSortMenus = nonButtonMenus
        .map((item) => {
          if (routeCache[item.id]) {
            return routeCache[item.id];
          }
          const route = this.generateRoute(item);
          if (route && typeof route === 'object') {
            routeCache[item.id] = route;
            return route;
          }
          return null;
        })
        .filter((item) => !!item)
        .sort((a, b) => a.order - b.order);

      const accessRoutes = arrayToTree(formatSortMenus);
      this.accessRoutes = {
        path: '/',
        name: 'pageHome',
        redirect: import.meta.env.VITE_HOME_PATH,
        component: undefined,
        meta: {
          title: '首页',
          icon: 'icon-park-outline:home',
        },
        children: accessRoutes,
      };
    },

    getMenuItem(item: System.Menu) {
      let originPath;
      if (item.path && isExternal(item.path)) {
        originPath = item.path;
        item.component = '/src/views/iframe/index.vue';
        item.path = `/iframe/${hyphenate(item.code)}`;
      }
      if (!item.show) return null;
      const menuItem: any = {
        id: item.id,
        label: item.name,
        key: item.code,
        path: item.path,
        originPath,
        icon: item.icon ? renderIcon(item.icon) : undefined,
        order: item.order ?? 0,
        pid: item.pid || null,
      };
      return menuItem; // 返回菜单项对象
    },

    // 生成路由对象的 action
    generateRoute(item: any): any {
      let originPath; // 原始路径
      if (isExternal(item.path)) {
        // 如果路径为外部链接
        originPath = item.path; // 将原始路径设置为路径值
        item.component = '/src/views/iframe/index.vue'; // 将组件路径设置为内置的 iframe 组件
        item.path = `/iframe/${hyphenate(item.code)}`; // 将路径设置为以 /iframe/ 开头并将权限项的 code 转为连字符分隔的形式
      }

      return {
        id: item.id, // 路由的唯一标识符
        name: item.code, // 路由的名称
        path: item.path, // 路由的路径
        redirect: item.redirect, // 路由的重定向路径
        component: routeComponents[item.component] || undefined, // 路由对应的组件
        pid: item.pid || null, // 父路由的唯一标识符
        meta: {
          originPath, // 原始路径
          icon: item.icon, // 路由对应的图标
          // icon: item.icon ? renderIcon(item.icon) : undefined, // 菜单项的图标
          title: item.name, // 路由的标题
          layout: item.layout || null, // 路由的布局
          keepAlive: !!item.keepAlive, // 是否缓存路由组件
          extraData: JSON.parse(item.extraData) || null, // 额外数据
        },
      };
    },
    // 重置权限的 action
    resetPermission() {
      this.$reset(); // 重置 store 中的状态
    },
  },
});
