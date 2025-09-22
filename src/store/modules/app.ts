import { defineStore } from 'pinia';
// import { useDark } from '@vueuse/core';
import {
  darkThemeOverrides,
  defaultFont,
  defaultLayout,
  fontOptions,
  lightThemeOverrides,
  naiveThemeOverrides,
} from '@/settings';
import { getRgb, isValidColor, setLocale } from '@/utils';
import { getLStorage } from '@/utils/storage';
import { useCssVar } from '@vueuse/core';
import chroma from 'chroma-js'; // 极小且零依赖的 JavaScript 颜色库
import _ from 'lodash';
import { type GlobalThemeOverrides } from 'naive-ui';
import { nextTick } from 'vue';

const lStorage = getLStorage();

// 移除防抖相关代码，改为同步更新主题

// 引用 HTML 文档的根元素
const docEle = ref(document.documentElement);

const { isFullscreen, toggle } = useFullscreen(docEle);

const { system, store } = useColorMode({
  emitAuto: true,
  storageKey: 'theme-mode',
  disableTransition: true, // 开启动画
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
    currentFont: lStorage.getItem('currentFont') || defaultFont, // 当前字体
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
      formShowLabel: true,
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
    /**
     * 设置颜色模式
     * @param mode - 主题模式：light(浅色) | dark(深色) | auto(跟随系统)
     */
    setColorMode(mode: 'light' | 'dark' | 'auto') {
      // 避免重复设置相同模式
      if (store.value === mode) return;

      // 更新模式并重新生成主题
      store.value = mode;
      this.setPrimaryColor(this.primaryColor);
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

    /**
     * 设置全局CSS变量
     */
    setupCssVar() {
      const common = this.theme?.common || {};
      const { documentElement } = document;

      Object.entries(common).forEach(([key, value]) => {
        const stringValue = value as string;

        if (isValidColor(stringValue)) {
          const rgb = getRgb(stringValue);
          const kebabKey = _.kebabCase(key);

          // 设置CSS变量
          documentElement.style.setProperty(`--${kebabKey}`, stringValue);
          documentElement.style.setProperty(`--${kebabKey}-rgb`, rgb.join(' '));

          // 保存主题色到本地存储
          if (key === 'primaryColor') {
            window.localStorage.setItem('__THEME_COLOR__', stringValue);
          }
        }
      });
    },

    /**
     * 设置字体
     * @param fontKey - 字体键值
     */
    setFont(fontKey: string) {
      if (fontOptions[fontKey]) {
        this.currentFont = fontKey;
        const fontValue = fontOptions[fontKey].value;

        // 更新主题中的字体
        _.set(this.theme, 'common.fontFamily', fontValue);

        // 更新全局CSS变量
        useCssVar('--font-family', document.documentElement).value = fontValue;

        // 保存到本地存储
        lStorage.setItem('currentFont', fontKey);

        // 重新设置CSS变量
        this.setupCssVar();
      }
    },

    /**
     * 设置主题色
     * @param color - 主题色值，为空时仅更新主题模式
     */
    setPrimaryColor(color: string = '') {
      // 获取基础主题配置
      const themeOverrides = this.colorMode === 'dark' ? darkThemeOverrides : lightThemeOverrides;

      // 合并主题配置
      this.theme = _.merge(_.cloneDeep(naiveThemeOverrides), _.cloneDeep(themeOverrides));

      // 更新主题色
      if (color && isValidColor(color)) {
        this.primaryColor = color;

        const brightenColor = chroma(color).brighten(1).hex();
        const darkenColor = chroma(color).darken(1).hex();

        // 更新主题色相关配置
        _.set(this.theme, 'common.primaryColor', color);
        _.set(this.theme, 'common.primaryColorHover', brightenColor);
        _.set(this.theme, 'common.primaryColorPressed', darkenColor);
        _.set(this.theme, 'common.primaryColorSuppl', brightenColor);
      }

      // 更新CSS变量
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
