import { useAppStore } from '@/store';
import type { ISpec, ITheme } from '@visactor/vchart';
import VChart from '@visactor/vchart';
import dark from '@visactor/vchart-theme/public/dark.json';
import light from '@visactor/vchart-theme/public/light.json';
import { tryOnUnmounted, useElementSize } from '@vueuse/core';
import { computed, effectScope, nextTick, ref, watch } from 'vue';

VChart.ThemeManager.registerTheme('light', light as ITheme);
VChart.ThemeManager.registerTheme('dark', dark as ITheme);

interface ChartHooks {
  onRender?: (chart: VChart) => void | Promise<void>;
  onUpdated?: (chart: VChart) => void | Promise<void>;
  onDestroy?: (chart: VChart) => void | Promise<void>;
}

export function useVChart<T extends ISpec>(specFactory: () => T, hooks: ChartHooks = {}) {
  const scope = effectScope();

  const appStore = useAppStore();
  const darkMode = computed(() => {
    return appStore.colorMode;
  });

  const domRef = ref<HTMLElement | null>(null);
  const { width, height } = useElementSize(domRef, { width: 0, height: 0 });

  let chart: VChart | null = null;

  const spec: T = specFactory();

  const { onRender, onUpdated, onDestroy } = hooks;

  async function updateSpec(callback: (opts: T, optsFactory: () => T) => ISpec = () => spec) {
    if (!isRendered()) {
      console.warn('图表尚未渲染，无法更新配置');
      return;
    }

    try {
      const updatedOpts = callback(spec, specFactory);

      Object.assign(spec, updatedOpts);

      chart?.updateSpec({ ...updatedOpts }, true);

      await onUpdated?.(chart!);
    } catch (error) {
      console.error('更新图表配置失败:', error);
      throw error;
    }
  }

  function setSpec(newSpec: T) {
    try {
      if (chart && isRendered()) {
        chart.updateSpec(newSpec, true);
      } else {
        Object.assign(spec, newSpec);
      }
    } catch (error) {
      console.error('设置图表配置失败:', error);
      throw error;
    }
  }

  function canRender() {
    return domRef.value && width.value > 0 && height.value > 0;
  }

  function isRendered() {
    return Boolean(domRef.value && chart);
  }

  function resize() {
    if (chart && isRendered()) {
      chart.resize(width.value, height.value);
    }
  }

  async function render() {
    try {
      if (!isRendered() && canRender()) {
        VChart.ThemeManager.setCurrentTheme(darkMode.value);

        chart = new VChart(spec, {
          dom: domRef.value as HTMLElement,
        });

        chart.renderSync();

        await onRender?.(chart);
      } else if (isRendered()) {
        resize();
      }
    } catch (error) {
      console.error('渲染图表失败:', error);
      throw error;
    }
  }

  async function destroy() {
    if (!chart) return;

    try {
      await onDestroy?.(chart);

      chart.release();

      chart = null;
    } catch (error) {
      console.error('销毁图表失败:', error);
      chart = null;
      throw error;
    }
  }

  async function renderChartBySize(w: number, h: number) {
    try {
      if (w <= 0 || h <= 0 || !domRef.value) {
        await destroy();
        return;
      }

      await render();
    } catch (error) {
      console.error('根据尺寸渲染图表失败:', error);
    }
  }

  async function changeTheme() {
    if (!chart || !isRendered()) return;

    try {
      VChart.ThemeManager.setCurrentTheme(darkMode.value);

      await destroy();

      await nextTick();

      await render();

      await onUpdated?.(chart!);
    } catch (error) {
      console.error('切换图表主题失败:', error);
    }
  }

  scope.run(() => {
    watch(
      [width, height],
      ([newWidth, newHeight]) => {
        renderChartBySize(newWidth, newHeight);
      },
      { flush: 'post' },
    );

    watch(
      darkMode,
      () => {
        changeTheme();
      },
      { flush: 'post' },
    );
  });

  tryOnUnmounted(async () => {
    try {
      await destroy();
    } catch (error) {
      console.error('组件卸载时销毁图表失败:', error);
    } finally {
      scope.stop();
    }
  });

  function getChart() {
    return chart;
  }

  function getSpec() {
    return spec;
  }

  return {
    domRef,
    updateSpec,
    setSpec,
    render,
    destroy,
    resize,
    getChart,
    getSpec,
    canRender,
    isRendered,
  };
}
