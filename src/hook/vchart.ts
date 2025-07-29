import { useAppStore } from '@/store';
import type { ISpec, ITheme } from '@visactor/vchart';
import VChart from '@visactor/vchart';
import dark from '@visactor/vchart-theme/public/dark.json';
import light from '@visactor/vchart-theme/public/light.json';
import { tryOnUnmounted, useElementSize } from '@vueuse/core';
import { computed, effectScope, nextTick, ref, watch } from 'vue';

// register the theme
VChart.ThemeManager.registerTheme('light', light as ITheme);
VChart.ThemeManager.registerTheme('dark', dark as ITheme);

interface ChartHooks {
  onRender?: (chart: VChart) => void | Promise<void>;
  onUpdated?: (chart: VChart) => void | Promise<void>;
  onDestroy?: (chart: VChart) => void | Promise<void>;
}

export function useVChart<T extends ISpec>(specFactory: () => T, hooks: ChartHooks = {}) {
  // 创建一个 effect 作用域，可以捕获其中所创建的响应式副作用 (即计算属性和侦听器)，这样捕获到的副作用可以一起处理。
  const scope = effectScope();

  // 监听主题变化
  const appStore = useAppStore();
  const darkMode = computed(() => {
    return appStore.colorMode;
  });

  // DOM 引用
  const domRef = ref<HTMLElement | null>(null);
  // 获取 HTML 元素的响应式大小
  const { width, height } = useElementSize(domRef, { width: 0, height: 0 });

  // 定义图表实例
  let chart: VChart | null = null;

  // 创建图表配置,通过外部传值
  const spec: T = specFactory();

  // 自定义的一些方法
  const { onRender, onUpdated, onDestroy } = hooks;

  /**
   * 更新图表的数据配置
   * @param callback 回调函数，用于生成新的图表配置
   */
  async function updateSpec(callback: (opts: T, optsFactory: () => T) => ISpec = () => spec) {
    if (!isRendered()) {
      console.warn('图表尚未渲染，无法更新配置');
      return;
    }

    try {
      const updatedOpts = callback(spec, specFactory);

      // 更新本地配置
      Object.assign(spec, updatedOpts);

      // 直接更新图表配置，无需销毁重建
      chart?.updateSpec({ ...updatedOpts }, true);

      await onUpdated?.(chart!);
    } catch (error) {
      console.error('更新图表配置失败:', error);
      throw error;
    }
  }

  /**
   * 设置图表配置
   * @param newSpec 新的图表配置
   */
  function setSpec(newSpec: T) {
    try {
      if (chart && isRendered()) {
        // 图表已渲染，直接更新
        chart.updateSpec(newSpec, true);
      } else {
        // 图表尚未初始化，存储配置供后续渲染使用
        Object.assign(spec, newSpec);
      }
    } catch (error) {
      console.error('设置图表配置失败:', error);
      throw error;
    }
  }

  /**
   * 判断是否可以渲染
   * @returns 是否满足渲染条件
   */
  function canRender() {
    return domRef.value && width.value > 0 && height.value > 0;
  }

  /**
   * 判断是否已经渲染
   * @returns boolean
   */
  function isRendered() {
    return Boolean(domRef.value && chart);
  }

  /** 重新设置图表大小 */
  function resize() {
    if (chart && isRendered()) {
      chart.resize(width.value, height.value);
    }
  }

  /**
   * 渲染图表
   */
  async function render() {
    try {
      if (!isRendered() && canRender()) {
        // 设置主题
        VChart.ThemeManager.setCurrentTheme(darkMode.value);

        // 创建图表实例
        chart = new VChart(spec, {
          dom: domRef.value as HTMLElement,
        });

        // 同步渲染
        chart.renderSync();

        // 执行渲染回调
        await onRender?.(chart);
      } else if (isRendered()) {
        // 如果已经渲染，调整大小
        resize();
      }
    } catch (error) {
      console.error('渲染图表失败:', error);
      throw error;
    }
  }

  /**
   * 销毁图表实例
   */
  async function destroy() {
    if (!chart) return;

    try {
      // 执行自定义销毁回调
      await onDestroy?.(chart);

      // 释放图表资源
      chart.release();

      // 重置图表实例
      chart = null;
    } catch (error) {
      console.error('销毁图表失败:', error);
      // 即使出错也要重置chart实例
      chart = null;
      throw error;
    }
  }

  /**
   * 根据尺寸变化渲染或销毁图表
   * @param w 宽度
   * @param h 高度
   */
  async function renderChartBySize(w: number, h: number) {
    try {
      // 尺寸异常时销毁图表
      if (w <= 0 || h <= 0 || !domRef.value) {
        await destroy();
        return;
      }

      // 渲染或调整图表
      await render();
    } catch (error) {
      console.error('根据尺寸渲染图表失败:', error);
    }
  }

  /**
   * 切换图表主题
   */
  async function changeTheme() {
    if (!chart || !isRendered()) return;

    try {
      // 设置新主题
      VChart.ThemeManager.setCurrentTheme(darkMode.value);

      // 重新创建图表以应用新主题
      await destroy();

      // 等待下一个tick确保DOM更新
      await nextTick();

      // 重新渲染图表
      await render();

      // 执行更新回调
      await onUpdated?.(chart!);
    } catch (error) {
      console.error('切换图表主题失败:', error);
    }
  }

  // 在effect作用域中设置监听器
  scope.run(() => {
    // 监听尺寸变化，添加防抖处理
    watch(
      [width, height],
      ([newWidth, newHeight]) => {
        renderChartBySize(newWidth, newHeight);
      },
      { flush: 'post' }, // 在DOM更新后执行
    );

    // 监听主题变化
    watch(
      darkMode,
      () => {
        changeTheme();
      },
      { flush: 'post' },
    );
  });

  // 在组件卸载时自动清理资源
  tryOnUnmounted(async () => {
    try {
      // 销毁图表实例
      await destroy();
    } catch (error) {
      console.error('组件卸载时销毁图表失败:', error);
    } finally {
      // 停止effect作用域
      scope.stop();
    }
  });

  /**
   * 获取图表实例
   * @returns 图表实例或null
   */
  function getChart() {
    return chart;
  }

  /**
   * 获取当前图表配置
   * @returns 当前图表配置
   */
  function getSpec() {
    return spec;
  }

  return {
    // DOM引用
    domRef,
    // 图表操作方法
    updateSpec,
    setSpec,
    render,
    destroy,
    resize,
    // 获取方法
    getChart,
    getSpec,
    // 状态检查方法
    canRender,
    isRendered,
  };
}
