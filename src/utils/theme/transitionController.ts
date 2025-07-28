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

    const transitionId = `transition-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // 创建过渡样式
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
    setTimeout(
      () => {
        this.removeTransition(transitionId);
      },
      duration + delay + 100,
    );
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
    this.transitionStyles.forEach((style) => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    });
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
  static createCircularTransition(
    clickX: number,
    clickY: number,
    duration: number = 600,
    beforeThemeChange?: () => Promise<void>,
  ): Promise<void> {
    return new Promise((resolve) => {
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

      /**
       * 冻结克隆体样式状态的辅助函数
       * 通过计算并固化样式来避免UnoCSS dark类动态变化的影响
       */
      const freezeClonedStyles = (clonedElement: HTMLElement) => {
        // 由于UnoCSS的dark类在html元素上，而我们克隆的是body元素
        // 当html元素的dark类发生变化时，会影响到克隆体中元素的样式
        // 因此需要在主题切换前固化克隆体中所有元素的计算样式

        // 递归遍历所有元素，将计算样式固化为内联样式
        const freezeElementStyles = (element: Element) => {
          if (element instanceof HTMLElement) {
            const computedStyle = window.getComputedStyle(element);

            // 固化所有可能受dark类影响的样式属性
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
              'fill',
              'stroke',
              'outline-color',
            ];

            criticalStyles.forEach((property) => {
              const value = computedStyle.getPropertyValue(property);
              if (value && value !== 'initial' && value !== 'inherit' && value !== 'transparent') {
                element.style.setProperty(property, value, 'important');
              }
            });
          }

          // 递归处理子元素
          Array.from(element.children).forEach(freezeElementStyles);
        };

        freezeElementStyles(clonedElement);

        // 强制重新计算样式
        if (clonedElement.offsetHeight) {
          // 触发重排
        }
      };

      // 先克隆当前页面内容（旧主题）
      const bodyClone = document.body.cloneNode(true) as HTMLElement;
      bodyClone.style.cssText = `
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      `;
      // 冻结克隆体的样式状态，避免UnoCSS dark类的动态影响
      freezeClonedStyles(bodyClone);

      // 移除克隆体中可能存在的遮罩层（避免递归）
      const existingOverlay = bodyClone.querySelector('#circular-theme-overlay');
      if (existingOverlay) {
        existingOverlay.remove();
      }

      // 移除克隆体中的过渡禁用样式（避免重复）
      const existingDisableStyle = bodyClone.querySelector('#circular-transition-disable');
      if (existingDisableStyle) {
        existingDisableStyle.remove();
      }

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

      // 确保遮罩层完全渲染并覆盖页面后再执行主题切换
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // 使用更长的延迟确保遮罩层完全生效
          setTimeout(async () => {
            // 执行主题切换
            if (beforeThemeChange) {
              await beforeThemeChange();
            }

            // 再次确保主题切换完成后才开始动画
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                overlay.style.clipPath = `circle(0px at ${clickX}px ${clickY}px)`;
              });
            });
          }, 16); // 约一帧的时间
        });
      });

      // 动画完成后清理
      setTimeout(() => {
        // 移除遮罩层
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }

        // 移除过渡禁用样式
        if (globalTransitionDisable.parentNode) {
          globalTransitionDisable.parentNode.removeChild(globalTransitionDisable);
        }

        resolve();
      }, duration);
    });
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
        if (this.activeTransitions.size === 0) {
          resolve();
        } else {
          setTimeout(checkTransitions, 50);
        }
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
          options.duration || 600,
          options.beforeThemeChange,
        );
      }
      break;
    case 'none':
      // 不添加任何过渡效果
      break;
    case 'uniform':
    default: {
      const duration = options.duration || 150;

      // 简单的全局过渡
      transitionController.addTransition('*', {
        duration,
        easing: 'ease-out',
        properties: ['background-color', 'color'],
        useGPU: false,
      });
      break;
    }
  }
};

/**
 * 清除所有过渡效果
 */
export const clearTransitions = () => {
  transitionController.clearAllTransitions();
};
