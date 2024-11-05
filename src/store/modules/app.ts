import { defineStore } from 'pinia';
// import { useDark } from '@vueuse/core';
import {
  darkThemeOverrides,
  defaultLayout,
  lightThemeOverrides,
  naiveThemeOverrides,
} from '@/settings';
import { getRgb, lStorage, setLocale } from '@/utils';
import { useCssVar } from '@vueuse/core';
import chroma from 'chroma-js'; // 极小且零依赖的 JavaScript 颜色库
import _ from 'lodash';
import { type GlobalThemeOverrides } from 'naive-ui';

// 引用 HTML 文档的根元素
const docEle = ref(document.documentElement);

const { isFullscreen, toggle } = useFullscreen(docEle);

const { system, store } = useColorMode({
  emitAuto: true,
  storageKey: 'theme-mode',
  disableTransition: false, // 开启动画
});

export const useAppStore = defineStore('app', {
  state: () => ({
    footerText: 'Copyright © 2024 jay',
    collapsed: false, // 侧边栏是否折叠
    // isDark: useDark(),
    theme: naiveThemeOverrides as GlobalThemeOverrides,
    layout: defaultLayout, // 布局配置
    // naiveThemeOverrides, // naive-ui 主题配置
    lang: lStorage.getItem('lang') || 'zhCN', // 语言
    primaryColor: naiveThemeOverrides.common.primaryColor, // 主题色
    weakColor: false, // 弱色
    grayMode: false, // 黑白模式
    transitionAnimation: 'fade-slide' as App.TransitionAnimation,
    loadFlag: true, // 页面加载状态
    showLogo: true, // 是否显示 Logo
    showTabs: true, // 是否显示 Tabs
    showFooter: true, // 是否显示 Footer
    // showProgress: true, // 是否显示顶部进度条
    showBreadcrumb: true, // 是否显示面包屑
    showBreadcrumbIcon: true, // 是否显示面包屑图标
    showWatermark: false, // 是否显示水印
    loginSet: {
      formShowLabel: false,
    },
  }),
  getters: {
    fullScreen() {
      return isFullscreen.value;
    },
    storeColorMode() {
      return store.value;
    },
    colorMode() {
      return store.value === 'auto' ? system.value : store.value;
    },
    getLang() {
      return () => this.lang;
    },
  },
  actions: {
    // 切换侧边栏折叠状态
    switchCollapsed() {
      this.collapsed = !this.collapsed;
    },
    // 切换颜色模式
    setColorMode(mode: 'light' | 'dark' | 'auto') {
      store.value = mode;
      console.log('🚀 ~ setColorMode ~ store.value:', store.value);
      this.setPrimaryColor();
    },
    // 切换全屏
    toggleFullScreen() {
      toggle();
    },
    // 切换语言
    setAppLanguage(lang: App.lang) {
      setLocale(lang);
      this.lang = lang;
      lStorage.setItem('lang', lang);
    },

    // 提取主题变量并设置全局 CSS 变量
    setupCssVar() {
      const common: any = this.theme?.common || {};
      Object.keys(common).forEach((key) => {
        const value: string = common[key];
        const rgb = getRgb(value);
        // 全局css变量-十六进制
        useCssVar(`--${_.kebabCase(key)}`, document.documentElement).value = value || '';
        // 全局css变量-rgb, xx xx xx 形式, 如: 255 255 255,给uno使用
        useCssVar(`--${_.kebabCase(key)}-rgb`, document.documentElement).value =
          rgb.join(' ') || '';

        // 特别处理 primaryColor，将其存入本地存储
        if (key === 'primaryColor') {
          window.localStorage.setItem('__THEME_COLOR__', value || '');
        }
      });
    },
    // 设置主题色
    setPrimaryColor(color: string = '') {
      if (this.colorMode === 'dark') {
        this.theme = _.merge(this.theme, darkThemeOverrides);
      } else if (this.colorMode === 'light') {
        this.theme = _.merge(this.theme, lightThemeOverrides);
      }
      if (color) {
        const brightenColor = chroma(color).brighten(1).hex();
        const darkenColor = chroma(color).darken(1).hex();
        // this.primaryColor = color;
        _.set(this.theme, 'common.primaryColor', color);
        _.set(this.theme, 'common.primaryColorHover', brightenColor);
        _.set(this.theme, 'common.primaryColorPressed', darkenColor);
        _.set(this.theme, 'common.primaryColorSuppl', brightenColor);
      }

      this.setupCssVar();
    },
    /* 切换色弱模式 */
    toggleColorWeak() {
      docEle.value.classList.toggle('weak-color');
      this.weakColor = docEle.value.classList.contains('weak-color');
    },
    /* 切换黑白模式 */
    toggleGrayMode() {
      docEle.value.classList.toggle('gray-mode');
      this.grayMode = docEle.value.classList.contains('gray-mode');
    },

    /**
     * @description: 页面内容重载
     * @param {number} delay - 延迟毫秒数
     * @return {*}
     */
    async reloadPage(delay = 0) {
      this.loadFlag = false;
      await nextTick();
      if (delay) {
        setTimeout(() => {
          this.loadFlag = true;
        }, delay);
      } else {
        this.loadFlag = true;
      }
    },
  },
  // persist: {
  //   paths: ['collapsed', 'naiveThemeOverrides'],
  //   storage: sessionStorage,
  // },
  persist: true,
});
