import { hyphenate } from '@vueuse/core'; // 导入 Vue 通用实用函数库中的 hyphenate 函数
import { defineStore } from 'pinia'; // 导入 Pinia 库中的 defineStore 函数
import { isExternal } from '@/utils/common'; // 导入自定义的 isExternal 函数，用于判断链接是否为外部链接

// 定义一个名为 usePermissionStore 的 Pinia store
export const usePermissionStore = defineStore('permission', {
  // 定义 store 的初始状态
  state: () => ({
    accessRoutes: <any[]>[], // 存储访问路由的数组
    permissions: <any[]>[], // 存储权限的数组
    menus: <any[]>[], // 存储菜单的数组
  }),
  // 定义 store 中的 actions
  actions: {
    // 设置权限的 action
    setPermissions(permissions: any) {
      this.permissions = permissions; // 将传入的权限设置到 store 中
      // 从权限中筛选出菜单项，并转换为菜单对象存储到 store 中的 menus 数组中
      this.menus = this.permissions
        .filter((item) => item.type === 'MENU') // 过滤出类型为 MENU 的项
        .map((item) => this.getMenuItem(item, '')) // 将每一项转换为菜单对象
        .filter((item) => !!item) // 过滤掉空对象
        .sort((a, b): any => a.order - b.order); // 根据 order 字段排序
    },
    // 获取菜单项的 action
    getMenuItem(item: any, parent: any): any {
      const route = this.generateRoute(item, item.show ? null : parent?.key); // 根据权限项生成路由对象
      if (item.enable && route.path && !route.path.startsWith('http'))
        this.accessRoutes.push(route); // 如果权限项启用且路由路径有效且不是外部链接，则将路由对象存储到 accessRoutes 数组中
      if (!item.show) return null; // 如果权限项不显示，则返回空
      const menuItem: any = {
        label: route.meta.title, // 菜单项的标题
        key: route.name, // 菜单项的唯一标识符
        path: route.path, // 菜单项对应的路径
        originPath: route.meta.originPath, // 原始路径
        icon: () => h('i', { class: `${route.meta.icon} text-16` }), // 菜单项的图标
        order: item.order ?? 0, // 菜单项的排序值，默认为 0
      };
      // 如果权限项有子菜单，则递归处理子菜单
      const children = item.children?.filter((item: any) => item.type === 'MENU') || [];
      if (children.length) {
        menuItem.children = children
          .map((child: any) => this.getMenuItem(child, menuItem)) // 递归获取子菜单项
          .filter((item: any) => !!item) // 过滤掉空对象
          .sort((a: any, b: any) => a.order - b.order); // 根据 order 字段排序
        if (!menuItem.children.length) delete menuItem.children; // 如果子菜单为空，则删除 children 字段
      }
      return menuItem; // 返回菜单项对象
    },
    // 生成路由对象的 action
    generateRoute(item: any, parentKey: any): any {
      let originPath; // 原始路径
      if (isExternal(item.path)) {
        // 如果路径为外部链接
        originPath = item.path; // 将原始路径设置为路径值
        item.component = '/src/views/iframe/index.vue'; // 将组件路径设置为内置的 iframe 组件
        item.path = `/iframe/${hyphenate(item.code)}`; // 将路径设置为以 /iframe/ 开头并将权限项的 code 转为连字符分隔的形式
      }
      return {
        name: item.code, // 路由的名称
        path: item.path, // 路由的路径
        redirect: item.redirect, // 路由的重定向路径
        component: item.component, // 路由对应的组件
        meta: {
          originPath, // 原始路径
          icon: item.icon + ({ bg: '', mask: '?mask' }[item.iconMode] ?? '?mask'), // 路由对应的图标
          title: item.name, // 路由的标题
          layout: item.layout, // 路由的布局
          keepAlive: !!item.keepAlive, // 是否缓存路由组件
          parentKey, // 父路由的唯一标识符
          btns: item.children
            ?.filter((item: any) => item.type === 'BUTTON') // 过滤出类型为 BUTTON 的子权限项
            .map((item: any) => ({ code: item.code, name: item.name })), // 转换为按钮对象数组
        },
      };
    },
    // 重置权限的 action
    resetPermission() {
      this.$reset(); // 重置 store 中的状态
    },
  },
});
