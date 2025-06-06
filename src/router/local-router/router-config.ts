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
