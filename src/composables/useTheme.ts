import { useMessage } from 'naive-ui';
import { nextTick, ref, watch } from 'vue';

// 主题配置
export interface ThemeConfig {
  name: string;
  label: string;
  key: string;
}

// 默认主题列表
const DEFAULT_THEMES: ThemeConfig[] = [
  { name: 'default', label: '默认', key: 'default' },
  { name: 'blue', label: '蓝色', key: 'blue' },
  { name: 'green', label: '绿色', key: 'green' },
  { name: 'purple', label: '紫色', key: 'purple' },
  { name: 'orange', label: '橙色', key: 'orange' },
  { name: 'dark', label: '深色', key: 'dark' },
];

// 存储键名
const STORAGE_KEY = 'blog-theme';

// 全局主题状态
const currentTheme = ref<string>('default');
const isThemeChanging = ref<boolean>(false);

/**
 * 主题管理组合式函数
 * @param options 配置选项
 */
export function useTheme(
  options: {
    themes?: ThemeConfig[];
    storageKey?: string;
    enableMessage?: boolean;
  } = {},
) {
  const { themes = DEFAULT_THEMES, storageKey = STORAGE_KEY, enableMessage = true } = options;

  const message = enableMessage ? useMessage() : null;

  /**
   * 切换主题
   * @param themeKey 主题键名
   */
  const switchTheme = async (themeKey: string) => {
    if (isThemeChanging.value) {
      message?.warning('主题切换中，请稍候...');
      return;
    }

    const targetTheme = themes.find((t) => t.key === themeKey || t.name === themeKey);
    if (!targetTheme) {
      message?.error(`未找到主题: ${themeKey}`);
      return;
    }

    if (currentTheme.value === targetTheme.key) {
      return; // 相同主题，无需切换
    }

    try {
      isThemeChanging.value = true;

      // 添加切换动画类
      document.body.classList.add('theme-switching');

      // 更新主题状态
      currentTheme.value = targetTheme.key;

      // 保存到本地存储
      localStorage.setItem(storageKey, targetTheme.key);

      // 等待DOM更新
      await nextTick();

      // 延迟移除动画类，确保过渡效果完成
      setTimeout(() => {
        document.body.classList.remove('theme-switching');
        isThemeChanging.value = false;
      }, 300);

      message?.success(`已切换到${targetTheme.label}主题`);
    } catch (error) {
      console.error('主题切换失败:', error);
      message?.error('主题切换失败，请重试');
      isThemeChanging.value = false;
      document.body.classList.remove('theme-switching');
    }
  };

  /**
   * 从本地存储加载主题
   */
  const loadThemeFromStorage = () => {
    try {
      const savedTheme = localStorage.getItem(storageKey);
      if (savedTheme && themes.some((t) => t.key === savedTheme || t.name === savedTheme)) {
        const theme = themes.find((t) => t.key === savedTheme || t.name === savedTheme);
        if (theme) {
          currentTheme.value = theme.key;
        }
      }
    } catch (error) {
      console.warn('加载主题设置失败:', error);
    }
  };

  /**
   * 重置主题为默认
   */
  const resetTheme = () => {
    switchTheme('default');
  };

  /**
   * 获取当前主题配置
   */
  const getCurrentThemeConfig = () => {
    return themes.find((t) => t.key === currentTheme.value) || themes[0];
  };

  /**
   * 检查是否为深色主题
   */
  const isDarkTheme = () => {
    return currentTheme.value === 'dark';
  };

  /**
   * 获取主题相关的CSS类名
   */
  const getThemeClass = () => {
    return `theme-${currentTheme.value}`;
  };

  /**
   * 监听主题变化
   * @param callback 回调函数
   */
  const watchTheme = (callback: (newTheme: string, oldTheme: string) => void) => {
    return watch(
      currentTheme,
      (value, oldValue) => callback(value.valueOf(), oldValue?.valueOf() || ''),
      {
        immediate: true,
      },
    );
  };

  return {
    // 状态
    currentTheme,
    isThemeChanging,
    themes,

    // 方法
    switchTheme,
    loadThemeFromStorage,
    resetTheme,
    getCurrentThemeConfig,
    isDarkTheme,
    getThemeClass,
    watchTheme,
  };
}

// 导出全局主题状态，供其他组件使用
export { currentTheme, isThemeChanging };
