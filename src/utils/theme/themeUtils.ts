import { useAppStore } from '@/store';
import {
  clearTransitions,
  createSmoothTransition,
  transitionController,
  type TransitionType,
} from './transitionController';

/** 主题模式类型 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/** 导出过渡类型 */
export type { TransitionType };

/** 主题切换选项 */
export interface ThemeOptions {
  /** 是否启用过渡动画 */
  enableTransition?: boolean;
  /** 过渡动画持续时间 */
  transitionDuration?: number;
  /** 过渡类型 */
  transitionType?: TransitionType;
  /** 点击位置X坐标（用于circular过渡） */
  clickX?: number;
  /** 点击位置Y坐标（用于circular过渡） */
  clickY?: number;
  /** 切换开始回调 */
  onStart?: () => void;
  /** 切换完成回调 */
  onComplete?: (mode: ThemeMode) => void;
  /** 错误回调 */
  onError?: (error: Error) => void;
}

/**
 * 主题切换工具类
 */
export class ThemeManager {
  private static instance: ThemeManager;

  private isChanging = false;

  /**
   * 获取应用store实例
   */
  private static getAppStore() {
    return useAppStore();
  }

  /**
   * 获取单例实例
   */
  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  /**
   * 切换主题模式
   * @param mode - 目标主题模式
   * @param options - 切换选项
   */
  async switchTheme(mode: ThemeMode, options: ThemeOptions = {}): Promise<void> {
    const {
      enableTransition = true,
      transitionDuration = 200,
      transitionType = 'uniform',
      clickX,
      clickY,
      onStart,
      onComplete,
      onError,
    } = options;

    if (this.isChanging) {
      console.warn('主题正在切换中，请稍后再试');
      return;
    }

    const appStore = ThemeManager.getAppStore();

    if (appStore.storeColorMode === mode) {
      console.info(`当前已是 ${mode} 模式`);
      onComplete?.(mode);
      return;
    }

    try {
      this.isChanging = true;
      onStart?.();

      // 清除之前的过渡效果
      clearTransitions();

      if (enableTransition && transitionType !== 'none') {
        // 使用新的过渡控制器
        const transitionOptions: any = {
          duration: transitionDuration,
        };

        // 如果是circular类型，添加点击位置参数和主题切换回调
        if (transitionType === 'circular' && clickX !== undefined && clickY !== undefined) {
          transitionOptions.clickX = clickX;
          transitionOptions.clickY = clickY;
          // 将主题切换作为回调传递给圆形过渡
          transitionOptions.beforeThemeChange = async () => {
            await appStore.setColorMode(mode);
          };
        }
        const transitionPromise = createSmoothTransition(transitionType, transitionOptions);

        // 对于circular类型，主题切换已经在过渡动画中处理
        if (transitionType === 'circular' && transitionPromise) {
          // 等待整个动画完成
          await transitionPromise;
        } else {
          // 其他类型的过渡，立即切换主题
          await appStore.setColorMode(mode);

          // 等待动画完成
          if (enableTransition) {
            await transitionController.waitForAllTransitions();
          }
        }
      } else {
        // 没有过渡动画，直接切换
        await appStore.setColorMode(mode);
      }

      onComplete?.(mode);
      console.info(`主题已切换至 ${mode} 模式`);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('主题切换失败');
      console.error('主题切换失败:', err);
      onError?.(err);
    } finally {
      this.isChanging = false;
      // 清理过渡效果
      setTimeout(() => {
        clearTransitions();
      }, 100);
    }
  }

  /**
   * 循环切换主题（light -> dark -> auto -> light）
   */
  async cycleTheme(options?: ThemeOptions): Promise<void> {
    const appStore = ThemeManager.getAppStore();
    const currentMode = appStore.storeColorMode;
    const modeOrder: ThemeMode[] = ['light', 'dark', 'auto'];
    const currentIndex = modeOrder.indexOf(currentMode);
    const nextMode = modeOrder[(currentIndex + 1) % modeOrder.length];

    await this.switchTheme(nextMode, options);
  }

  /**
   * 获取当前主题模式
   */
  static getCurrentMode(): ThemeMode {
    const appStore = ThemeManager.getAppStore();
    return appStore.storeColorMode;
  }

  /**
   * 获取实际生效的主题模式（处理auto模式）
   */
  static getEffectiveMode(): 'light' | 'dark' {
    const appStore = ThemeManager.getAppStore();
    return appStore.colorMode;
  }

  /**
   * 检查是否为深色模式
   */
  static isDarkMode(): boolean {
    return ThemeManager.getEffectiveMode() === 'dark';
  }

  /**
   * 检查是否正在切换主题
   */
  isThemeChanging(): boolean {
    const appStore = ThemeManager.getAppStore();
    return this.isChanging || appStore.isThemeChanging;
  }

  /**
   * 预加载主题资源（如果需要）
   */
  static async preloadThemeResources(): Promise<void> {
    // 这里可以预加载主题相关的资源，如图片、字体等
    console.info('主题资源预加载完成');
  }
}

/**
 * 导出便捷的主题切换函数
 */
export const themeManager = ThemeManager.getInstance();

/**
 * 切换到指定主题模式
 * @param mode - 目标主题模式
 * @param options - 切换选项
 */
export const switchTheme = (mode: ThemeMode, options?: ThemeOptions) => {
  return themeManager.switchTheme(mode, options);
};

/**
 * 循环切换主题
 * @param options - 切换选项
 */
export const cycleTheme = (options?: ThemeOptions) => {
  return themeManager.cycleTheme(options);
};

/**
 * 获取当前主题模式
 */
export const getCurrentTheme = () => {
  return ThemeManager.getCurrentMode();
};

/**
 * 检查是否为深色模式
 */
export const isDarkMode = () => {
  return ThemeManager.isDarkMode();
};
