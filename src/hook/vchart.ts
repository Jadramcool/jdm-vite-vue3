import { useAppStore } from '@/store';
import type { ISpec, ITheme } from '@visactor/vchart';
import VChart from '@visactor/vchart';
import dark from '@visactor/vchart-theme/public/dark.json';
import light from '@visactor/vchart-theme/public/light.json';
import { useElementSize } from '@vueuse/core';

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

  // dom ref
  const domRef = ref<HTMLElement | null>(null);
  // 初始化size
  const initialSize = { width: 0, height: 0 };
  // 获取 HTML 元素的响应式大小。
  const { width, height } = useElementSize(domRef, initialSize);

  // 定义图表实例
  let chart: VChart | null = null;

  // 创建图表配置,通过外部传值
  const spec: T = specFactory();

  // 自定义的一些方法
  const { onRender, onUpdated, onDestroy } = hooks;

  /**
   * 更新图表的数据配置
   * @param callback callback function
   */
  async function updateSpec(callback: (opts: T, optsFactory: () => T) => ISpec = () => spec) {
    if (!isRendered()) return;

    const updatedOpts = callback(spec, specFactory);

    Object.assign(spec, updatedOpts);

    if (isRendered()) {
      // 销毁图表
      chart?.release();
    }

    chart?.updateSpec({ ...updatedOpts }, true);

    await onUpdated?.(chart!);
  }

  function setSpec(newSpec: T) {
    chart?.updateSpec(newSpec);
  }

  /**
   * 判断是否可以渲染
   * @returns boolean
   */
  function canRender() {
    return domRef.value && initialSize.width > 0 && initialSize.height > 0;
  }

  /**
   * 判断是否已经渲染
   * @returns boolean
   */
  function isRendered() {
    return Boolean(domRef.value && chart);
  }

  /** 重新设置图表大小 */
  /**
   * **异步方法**，图表尺寸更新方法。
   * @param width 宽度
   * @param height 高度
   * @returns VChart 当前实例
   */
  function resize() {
    // chart?.resize();
  }

  async function render() {
    if (!isRendered()) {
      // 设置主题
      if (darkMode.value) {
        VChart.ThemeManager.setCurrentTheme(darkMode.value);
      }

      chart = new VChart(spec, { dom: domRef.value as HTMLElement });
      chart.renderSync();

      await onRender?.(chart);
    }
  }

  /** 销毁charts */
  async function destroy() {
    if (!chart) return;

    // 如果有自定义的销毁方法，则执行之
    await onDestroy?.(chart);
    // 执行默认销毁逻辑
    chart?.release();
    // 重置 chart
    chart = null;
  }

  async function renderChartBySize(w: number, h: number) {
    initialSize.width = w;
    initialSize.height = h;

    // size is abnormal, destroy chart
    if (!canRender()) {
      await destroy();

      return;
    }

    // TODO 改变图表尺寸
    if (isRendered()) {
      resize();
    }

    // render chart
    await render();
  }

  async function changeTheme() {
    await destroy();
    await render();
    await onUpdated?.(chart!);
  }

  scope.run(() => {
    watch([width, height], ([newWidth, newHeight]) => {
      renderChartBySize(newWidth, newHeight);
    });

    watch(darkMode, () => {
      changeTheme();
    });
  });
  return {
    domRef,
    updateSpec,
    setSpec,
  };
}
