/**
 * 过渡控制器选项
 */
export interface TransitionControllerOptions {
  /** 过渡持续时间（毫秒） */
  duration?: number;
  /** 缓动函数 */
  easing?: string;
  /** 延迟时间（毫秒） */
  delay?: number;
  /** 是否启用硬件加速 */
  useGPU?: boolean;
  /** 过渡属性列表 */
  properties?: string[];
}

/**
 * 组件过渡控制器
 * 提供更精细的主题切换过渡控制
 */
export class TransitionController {
  private static instance: TransitionController;

  private activeTransitions = new Set<string>();

  private transitionStyles = new Map<string, HTMLStyleElement>();

  /**
   * 获取单例实例
   */
  static getInstance(): TransitionController {
    if (!TransitionController.instance) {
      TransitionController.instance = new TransitionController();
    }
    return TransitionController.instance;
  }

  /**
   * 为指定选择器添加过渡效果
   * @param selector CSS选择器
   * @param options 过渡选项
   */
  addTransition(selector: string, options: TransitionControllerOptions = {}): void {
    const {
      duration = 200,
      easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
      delay = 0,
      useGPU = true,
      properties = ['background-color', 'color', 'border-color', 'box-shadow'],
    } = options;

    // 使用更现代的方式生成唯一ID
    const transitionId = `transition-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const style = document.createElement('style');
    style.id = transitionId;

    const transitionProperty = properties.join(', ');
    const transform = useGPU ? 'transform: translateZ(0);' : '';

    style.textContent = `
      ${selector} {
        transition: ${transitionProperty} ${duration}ms ${easing} ${delay}ms;
        ${transform}
        will-change: ${properties.join(', ')};
      }
    `;

    document.head.appendChild(style);
    this.transitionStyles.set(transitionId, style);
    this.activeTransitions.add(transitionId);

    // 自动清理
    setTimeout(() => this.removeTransition(transitionId), duration + delay + 100);
  }

  /**
   * 移除指定的过渡效果
   * @param transitionId 过渡ID
   */
  removeTransition(transitionId: string): void {
    const style = this.transitionStyles.get(transitionId);
    if (style && style.parentNode) {
      style.parentNode.removeChild(style);
    }
    this.transitionStyles.delete(transitionId);
    this.activeTransitions.delete(transitionId);
  }

  /**
   * 清除所有过渡效果
   */
  clearAllTransitions(): void {
    // 使用Array.from创建数组副本，避免在迭代时修改Map
    const styles = Array.from(this.transitionStyles.values());
    styles.forEach((style) => style.parentNode?.removeChild(style));
    this.transitionStyles.clear();
    this.activeTransitions.clear();
  }

  /**
   * 创建圆形扩散过渡效果
   * 从指定位置开始的圆形扩散颜色切换动画
   * @param clickX 点击位置的X坐标（像素）
   * @param clickY 点击位置的Y坐标（像素）
   * @param duration 动画持续时间（毫秒）
   * @param beforeThemeChange 主题切换前的回调函数
   */
  static async createCircularTransition(
    clickX: number,
    clickY: number,
    duration = 600,
    beforeThemeChange?: () => Promise<void>,
  ): Promise<void> {
    // 计算最大半径（确保能覆盖整个屏幕）
    const maxRadius = Math.sqrt(
      Math.max(clickX, window.innerWidth - clickX) ** 2 +
        Math.max(clickY, window.innerHeight - clickY) ** 2,
    );

    // 添加全局样式，禁用过渡效果但保持圆形动画可见
    const globalTransitionDisable = document.createElement('style');
    globalTransitionDisable.id = 'circular-transition-disable';
    globalTransitionDisable.textContent = `
      /* 禁用页面内容的过渡和动画效果 */
      body *:not(#circular-theme-overlay):not(#circular-theme-overlay *), 
      body *:not(#circular-theme-overlay):not(#circular-theme-overlay *)::before, 
      body *:not(#circular-theme-overlay):not(#circular-theme-overlay *)::after {
        transition: none !important;
        animation: none !important;
      }
      
      /* 允许遮罩层的圆形过渡动画 */
      #circular-theme-overlay {
        transition: clip-path ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      
      /* 禁用遮罩层内容的过渡，但不影响遮罩层本身 */
      #circular-theme-overlay * {
        transition: none !important;
        animation: none !important;
      }
    `;
    document.head.appendChild(globalTransitionDisable);

    // 定义主题切换的异步处理函数
    const executeThemeChange = async () => {
      if (beforeThemeChange) {
        await beforeThemeChange();
      }
    };

    // 始终先克隆当前主题的body，不执行主题切换
    const bodyClone = document.body.cloneNode(true) as HTMLElement;
    bodyClone.style.cssText = `
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    `;

    // 冻结克隆体的样式状态
    TransitionController.freezeClonedStyles(bodyClone);

    // 移除克隆体中可能存在的遮罩层和过渡禁用样式（避免递归）
    bodyClone.querySelector('#circular-theme-overlay')?.remove();
    bodyClone.querySelector('#circular-transition-disable')?.remove();

    // 创建遮罩层，显示旧主题内容
    const overlay = document.createElement('div');
    overlay.id = 'circular-theme-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
      clip-path: circle(${maxRadius}px at ${clickX}px ${clickY}px);
      transition: clip-path ${duration}ms cubic-bezier(0.4, 0, 0.2, 1);
    `;

    overlay.appendChild(bodyClone);
    document.body.appendChild(overlay);

    // 确保遮罩层完全渲染后开始动画
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // 在动画开始前执行主题切换
          executeThemeChange().then(() => {
            // 主题切换完成后开始动画
            overlay.style.clipPath = `circle(0px at ${clickX}px ${clickY}px)`;
            resolve();
          });
        });
      });
    });

    // 等待动画完成
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        // 移除遮罩层和过渡禁用样式
        overlay.parentNode?.removeChild(overlay);
        globalTransitionDisable.parentNode?.removeChild(globalTransitionDisable);
        resolve();
      }, duration);
    });
  }

  /**
   * 冻结克隆体样式状态的辅助方法
   * 通过计算并固化样式来确保过渡效果正常
   */
  private static freezeClonedStyles(clonedElement: HTMLElement) {
    const freezeElement = (element: Element) => {
      if (element instanceof HTMLElement) {
        const computed = window.getComputedStyle(element);
        // 固化所有关键样式属性
        const criticalStyles = [
          'background-color',
          'color',
          'border-color',
          'border-top-color',
          'border-right-color',
          'border-bottom-color',
          'border-left-color',
          'box-shadow',
          'text-shadow',
        ];

        criticalStyles.forEach((prop) => {
          const value = computed.getPropertyValue(prop);
          if (value && value !== 'initial' && value !== 'inherit') {
            element.style.setProperty(prop, value, 'important');
          }
        });
      }
      // 递归处理子元素
      Array.from(element.children).forEach(freezeElement);
    };
    freezeElement(clonedElement);
    // 强制重排，确保样式生效
    clonedElement.offsetHeight;
  }

  /**
   * 检查是否有活跃的过渡
   */
  hasActiveTransitions(): boolean {
    return this.activeTransitions.size > 0;
  }

  /**
   * 等待所有过渡完成
   */
  async waitForAllTransitions(): Promise<void> {
    return new Promise((resolve) => {
      const checkTransitions = () => {
        if (this.activeTransitions.size === 0) resolve();
        else setTimeout(checkTransitions, 50);
      };
      checkTransitions();
    });
  }
}

/**
 * 导出便捷的过渡控制器实例
 */
export const transitionController = TransitionController.getInstance();

/**
 * 过渡类型
 */
export type TransitionType = 'uniform' | 'circular' | 'none';

/**
 * 创建平滑的主题过渡
 * @param type 过渡类型
 * @param options 过渡选项
 */
export const createSmoothTransition = (
  type: TransitionType = 'uniform',
  options: TransitionControllerOptions & {
    clickX?: number;
    clickY?: number;
    beforeThemeChange?: () => Promise<void>;
  } = {},
) => {
  transitionController.clearAllTransitions();

  switch (type) {
    case 'circular':
      if (options.clickX !== undefined && options.clickY !== undefined) {
        return TransitionController.createCircularTransition(
          options.clickX,
          options.clickY,
          options.duration ?? 600,
          options.beforeThemeChange,
        );
      }
      return Promise.resolve();
    case 'none':
      // 不添加任何过渡效果
      return Promise.resolve();
    case 'uniform':
    default: {
      const duration = options.duration ?? 150;

      // 简单的全局过渡
      transitionController.addTransition('*', {
        duration,
        easing: 'ease-out',
        properties: ['background-color', 'color'],
        useGPU: false,
      });
      return Promise.resolve();
    }
  }
};

/**
 * 清除所有过渡效果
 */
export const clearTransitions = () => {
  transitionController.clearAllTransitions();
};
