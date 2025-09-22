import { useAppStore } from '@/store';

/** 主题模式类型 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/** 主题切换选项 */
export interface ThemeOptions {
  /** 是否启用过渡动画 */
  enableTransition?: boolean;
  /** 过渡动画持续时间 */
  transitionDuration?: number;
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
  /**
   * 获取应用store实例
   */
  private static getAppStore() {
    return useAppStore();
  }

  /**
   * 切换主题模式
   * @param mode - 目标主题模式
   * @param options - 切换选项
   */
  static switchTheme(mode: ThemeMode, options: ThemeOptions = {}): void {
    const { onStart, onComplete, onError } = options;
    const appStore = ThemeManager.getAppStore();

    if (appStore.storeColorMode === mode) {
      onComplete?.(mode);
      return;
    }

    try {
      onStart?.();
      appStore.setColorMode(mode);
      onComplete?.(mode);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('主题切换失败');
      onError?.(err);
    }
  }

  /**
   * 循环切换主题（light -> dark -> auto -> light）
   */
  static cycleTheme(options?: ThemeOptions): void {
    const appStore = ThemeManager.getAppStore();
    const modeOrder: ThemeMode[] = ['light', 'dark', 'auto'];
    const currentIndex = modeOrder.indexOf(appStore.storeColorMode);
    const nextMode = modeOrder[(currentIndex + 1) % modeOrder.length];

    ThemeManager.switchTheme(nextMode, options);
  }

  /**
   * 获取当前主题模式
   */
  static getCurrentMode(): ThemeMode {
    return ThemeManager.getAppStore().storeColorMode;
  }

  /**
   * 获取实际生效的主题模式（处理auto模式）
   */
  static getEffectiveMode(): 'light' | 'dark' {
    return ThemeManager.getAppStore().colorMode;
  }

  /**
   * 检查是否为深色模式
   */
  static isDarkMode(): boolean {
    return ThemeManager.getEffectiveMode() === 'dark';
  }
}

/**
 * 切换到指定主题模式
 * @param mode - 目标主题模式
 * @param options - 切换选项
 */
export const switchTheme = (mode: ThemeMode, options?: ThemeOptions) => {
  return ThemeManager.switchTheme(mode, options);
};

/**
 * 循环切换主题
 * @param options - 切换选项
 */
export const cycleTheme = (options?: ThemeOptions) => {
  return ThemeManager.cycleTheme(options);
};

/**
 * 获取当前主题模式
 */
export const getCurrentTheme = () => ThemeManager.getCurrentMode();

/**
 * 检查是否为深色模式
 */
export const isDarkMode = () => ThemeManager.isDarkMode();
