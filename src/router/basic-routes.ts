export const basicRoutes = [
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录页',
      layout: 'empty',
    },
  },

  {
    name: 'Home',
    path: '/',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
    },
  },
  {
    name: '403',
    path: '/403',
    component: () => import('@/views/error/403.vue'),
    meta: {
      title: '没有权限',
      layout: 'empty',
    },
  },
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面飞走了',
      layout: 'empty',
    },
  },
  // 全匹配 404 页面
  {
    path: '/:pathMatch(.*)*',
    meta: {
      title: '页面飞走了',
      isHide: true,
      layout: 'empty',
    },
    component: () => import('@/views/error/404.vue'),
  },
];
