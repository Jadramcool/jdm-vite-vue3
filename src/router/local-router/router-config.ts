export default [
  {
    name: 'Home',
    path: '/home',
    component: '/src/views/home/normalHome.vue',
    meta: {
      title: '首页',
      layout: 'normal-nocard',
      icon: 'fe:home',
    },
  },
  {
    name: 'Base',
    path: '/base',
    redirect: '/base/component',
    meta: {
      title: '基础功能',
      icon: 'solar:box-minimalistic-line-duotone',
    },
    children: [
      {
        name: 'Component',
        path: '/base/component',
        component: '/src/views/base/basic-component.vue',
        meta: {
          title: '基本组件',
          icon: 'solar:sticker-smile-circle-2-broken',
        },
      },
      {
        name: 'Icon',
        path: 'https://icones.js.org/',
        meta: {
          title: '图标-Iconify',
          icon: 'solar:sticker-smile-circle-2-broken',
        },
      },
      {
        name: 'Unocss',
        path: '/base/unocss',
        component: '/src/views/base/unocss.vue',
        meta: {
          title: 'Unocss',
          icon: 'solar:sticker-smile-circle-2-broken',
        },
      },
      {
        name: 'KeepAlive',
        path: '/base/keep-alive',
        component: '/src/views/base/keep-alive.vue',
        meta: {
          title: 'KeepAlive',
          icon: 'solar:sticker-smile-circle-2-broken',
          keepAlive: true,
        },
      },
      {
        name: 'ThemeDemo',
        path: '/base/theme-demo',
        component: '/src/views/base/ThemeDemo.vue',
        meta: {
          title: '主题演示',
          icon: 'icon-park-outline:theme',
          keepAlive: true,
        },
      },
      {
        name: 'Features',
        path: '/base/features',
        component: '/src/views/base/features.vue',
        meta: {
          title: '功能展示',
          icon: 'solar:sticker-smile-circle-2-broken',
          keepAlive: true,
        },
      },
      {
        name: 'Chart',
        path: '/base/chart',
        redirect: '/base/chart/index',
        meta: {
          title: '图表示例',
          icon: 'solar:sticker-smile-circle-2-broken',
        },
        children: [
          {
            name: 'ChartIndex',
            path: '/base/chart/index',
            component: '/src/views/base/chart/index.vue',
            meta: {
              title: '图表总览',
              icon: 'solar:chart-2-line-duotone',
            },
          },
        ],
      },
    ],
  },
  {
    name: 'System',
    path: '/system',
    redirect: '/system/user',
    meta: {
      icon: 'fe:layout',
      title: '系统管理',
      layout: 'normal',
    },
    children: [
      {
        name: 'User',
        path: '/system/user',
        component: '/src/views/system/user/index.vue',
        meta: {
          icon: 'fe:layout',
          title: '用户管理',
          layout: 'normal',
          keepAlive: true,
        },
      },
      {
        name: 'MenuManager',
        path: '/system/menu',
        component: '/src/views/system/menu/index.vue',
        meta: {
          icon: 'solar:checklist-broken',
          title: '菜单管理',
          layout: 'normal',
          keepAlive: true,
        },
      },
      {
        name: 'Role',
        path: '/system/role',
        component: '/src/views/system/role/index.vue',
        meta: {
          icon: 'solar:user-speak-outline',
          title: '角色管理',
          layout: 'normal',
          keepAlive: true,
        },
      },
    ],
  },
];
