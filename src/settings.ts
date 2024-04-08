export const defaultLayout = 'normal';

export const naiveThemeOverrides = {
  common: {
    primaryColor: 'rgba(49, 108, 114, 1)',
    primaryColorHover: 'rgba(49, 108, 114, 0.89)',
    primaryColorPressed: 'rgba(43, 76, 89, 1)',
    primaryColorSuppl: 'rgba(49, 108, 114, 0.89)',

    infoColor: 'rgba(32, 128, 240, 1)',
    infoColorHover: 'rgba(64, 152, 252, 1)',
    infoColorPressed: 'rgba(16, 96, 201, 1)',
    infoColorSuppl: 'rgba(64, 152, 252, 1)',

    successColor: 'rgba(24, 160, 88, 1)',
    successColorHover: 'rgba(54, 173, 106, 1)',
    successColorPressed: 'rgba(12, 122, 67, 1)',
    successColorSuppl: 'rgba(54, 173, 106, 1)',

    warningColor: 'rgba(240, 160, 32, 1)',
    warningColorHover: 'rgba(252, 176, 64, 1)',
    warningColorPressed: 'rgba(201, 124, 16, 1)',
    warningColorSuppl: 'rgba(252, 176, 64, 1)',

    errorColor: 'rgba(208, 48, 80, 1)',
    errorColorHover: 'rgba(222, 87, 109, 1)',
    errorColorPressed: 'rgba(171, 31, 63, 1)',
    errorColorSuppl: 'rgba(222, 87, 109, 1)',
  },
};

export const basePermissions = [
  {
    code: 'ExternalLink',
    name: '外链(可内嵌打开)',
    type: 'MENU',
    icon: 'i-fe:external-link',
    order: 98,
    enable: true,
    show: true,
    children: [
      {
        code: 'ShowDocs',
        name: '项目文档',
        type: 'MENU',
        path: 'https://docs.isme.top/web/#/624306705/188522224',
        icon: 'i-me:docs',
        order: 1,
        enable: true,
        show: true,
      },
      {
        code: 'ApiFoxDocs',
        name: '接口文档',
        type: 'MENU',
        path: 'https://apifox.com/apidoc/shared-ff4a4d32-c0d1-4caf-b0ee-6abc130f734a',
        icon: 'i-me:apifox',
        iconMode: 'bg',
        order: 2,
        enable: true,
        show: true,
      },
      {
        code: 'NaiveUI',
        name: 'Naive UI',
        type: 'MENU',
        path: 'https://www.naiveui.com/zh-CN/os-theme',
        icon: 'i-me:naiveui',
        iconMode: 'bg',
        order: 3,
        enable: true,
        show: true,
      },
      {
        code: 'MyBlog',
        name: '博客-掘金',
        type: 'MENU',
        path: 'https://juejin.cn/user/1961184475483255/posts',
        icon: 'i-simple-icons:juejin',
        order: 4,
        enable: true,
        show: true,
      },
    ],
  },
];
