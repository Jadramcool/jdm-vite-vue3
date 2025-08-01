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
import { getLStorage } from '@/utils/storage';
import { getRgb, isValidColor, setLocale } from '@/utils';
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
    // 主题切换状态
    isThemeChanging: false,
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
    // 移除防抖方法，改为直接同步调用 setupCssVar

    // 切换侧边栏折叠状态
    switchCollapsed() {
      this.collapsed = !this.collapsed;
    },
    /**
     * 设置颜色模式
     * 优化：确保主题模式、主题色和CSS变量同步更新，并添加平滑的过渡动画
     * @param mode - 主题模式：light(浅色) | dark(深色) | auto(跟随系统)
     */
    async setColorMode(mode: 'light' | 'dark' | 'auto') {
      // 避免重复设置相同模式
      if (store.value === mode || this.isThemeChanging) return;

      /**
       * 添加主题切换的过渡动画样式
       */
      const addThemeTransition = () => {
        const style = document.createElement('style');
        style.id = 'theme-transition';
        style.innerHTML = `
          * {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
          }
          .n-card {
            transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
          }
          .n-button {
            transition: all 0.3s ease !important;
          }
          .n-input {
            transition: all 0.3s ease !important;
          }
        `;
        document.head.appendChild(style);
      };

      /**
       * 移除主题切换的过渡动画样式
       */
      const removeThemeTransition = () => {
        const style = document.getElementById('theme-transition');
        if (style) {
          style.remove();
        }
      };

      try {
        this.isThemeChanging = true;

        // 添加过渡动画效果
        addThemeTransition();

        // 批量更新所有主题相关状态
        store.value = mode;

        // 立即重新生成主题配置
        this.setPrimaryColor(this.primaryColor);

        // 立即更新CSS变量
        this.setupCssVar();

        // 强制触发响应式更新，确保所有组件都能同步
        await nextTick();
        await nextTick();

        // 等待过渡动画完成后移除过渡样式
        setTimeout(() => {
          removeThemeTransition();
        }, 350); // 稍微长于过渡时间，确保动画完成
      } catch (error) {
        console.error('主题切换失败:', error);
        // 发生错误时也要移除过渡样式
        removeThemeTransition();
      } finally {
        // 延迟重置状态，确保过渡完成
        setTimeout(() => {
          this.isThemeChanging = false;
        }, 350);
      }
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
     * 提取主题变量并设置全局CSS变量
     * 优化：同步更新，确保主题切换时所有组件同步变化
     */
    setupCssVar() {
      const common: any = this.theme?.common || {};
      const { documentElement } = document;

      try {
        // 同步处理所有CSS变量，确保主题切换的一致性
        Object.entries(common).forEach(([key, value]) => {
          const stringValue = value as string;

          if (isValidColor(stringValue)) {
            try {
              const rgb = getRgb(stringValue);
              const kebabKey = _.kebabCase(key);

              // 立即同步更新CSS变量，避免视觉不一致
              documentElement.style.setProperty(`--${kebabKey}`, stringValue || '');
              documentElement.style.setProperty(`--${kebabKey}-rgb`, rgb.join(' ') || '');

              // 特别处理主题色相关变量，确保与 vars.ts 中的定义一致
              if (key === 'primaryColor') {
                documentElement.style.setProperty('--primary-color-rgb', rgb.join(' ') || '');
              } else if (key === 'infoColor') {
                documentElement.style.setProperty('--info-color-rgb', rgb.join(' ') || '');
              } else if (key === 'successColor') {
                documentElement.style.setProperty('--success-color-rgb', rgb.join(' ') || '');
              } else if (key === 'warningColor') {
                documentElement.style.setProperty('--warning-color-rgb', rgb.join(' ') || '');
              } else if (key === 'errorColor') {
                documentElement.style.setProperty('--error-color-rgb', rgb.join(' ') || '');
              }
            } catch (error) {
              console.warn(`处理颜色值失败: ${key}=${stringValue}`, error);
            }
          }

          // 特别处理 primaryColor，将其存入本地存储
          if (key === 'primaryColor' && stringValue) {
            try {
              window.localStorage.setItem('__THEME_COLOR__', stringValue);
            } catch (error) {
              console.warn('保存主题色到本地存储失败:', error);
            }
          }
        });
      } catch (error) {
        console.error('设置CSS变量失败:', error);
      }
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
      // 深拷贝基础主题配置，避免污染原始配置
      let themeOverrides = {};

      if (this.colorMode === 'dark') {
        themeOverrides = _.cloneDeep(darkThemeOverrides);
      } else if (this.colorMode === 'light') {
        themeOverrides = _.cloneDeep(lightThemeOverrides);
      }

      // 合并主题配置
      this.theme = _.merge(_.cloneDeep(naiveThemeOverrides), themeOverrides);

      // 如果指定了颜色，则更新主题色
      if (color && isValidColor(color)) {
        try {
          const brightenColor = chroma(color).brighten(1).hex();
          const darkenColor = chroma(color).darken(1).hex();

          this.primaryColor = color;

          // 批量更新主题色相关配置
          const colorConfig = {
            'common.primaryColor': color,
            'common.primaryColorHover': brightenColor,
            'common.primaryColorPressed': darkenColor,
            'common.primaryColorSuppl': brightenColor,
          };

          Object.entries(colorConfig).forEach(([path, value]) => {
            _.set(this.theme, path, value);
          });
        } catch (error) {
          console.warn('设置主题色失败:', error);
        }
      }

      // 立即更新CSS变量，确保主题切换同步
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
