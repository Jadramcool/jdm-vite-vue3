<!-- 博客 页面的布局 -->
<template>
  <n-layout class="wh-full flex" has-sider>
    <n-layout class="layout h-full" content-style="display: flex;flex-direction: column" embedded>
      <n-layout-header
        class="h-60px z-1 flex-x-center justify-between fixed transition-all duration-300 ease-in-out"
        :style="{
          backgroundColor: `rgba(255, 255, 255, ${headerOpacity})`,
          boxShadow: headerOpacity > 0.1 ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
        }"
        content-style="transition: border-color 0.3s ease;"
      >
        <div class="flex-x-center p-x-xl">
          <SideLogo v-if="appStore.showLogo" />
        </div>
        <div class="info flex-x-center gap-1 h-full p-x-xl">
          <HeaderTools :showDarkMode="true" :showLanguage="false" :showUserCenter="false" />
        </div>
      </n-layout-header>
      <n-layout-content
        ref="contentRef"
        embedded
        class="h-full flex-1"
        :native-scrollbar="false"
        :on-scroll="handleScroll"
      >
        <div class="wh-full flex-col">
          <Transition :name="appStore.transitionAnimation" mode="out-in">
            <slot />
          </Transition>
        </div>
      </n-layout-content>
      <n-layout-footer bordered class="h-40px" v-if="appStore.showFooter">
        <AppCard class="flex-1 h-full flex-center">
          <Footer />
        </AppCard>
      </n-layout-footer>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { Footer, HeaderTools, SideLogo } from '@/layout/components';
import { useAppStore } from '@/store';
import { nextTick, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const appStore = useAppStore();
const route = useRoute();

// 滚动状态管理
const headerOpacity = ref(0.1);
const contentRef = ref<any>(null);
let scrollTimer: NodeJS.Timeout | null = null;

/**
 * 滚动到页面顶部
 */
const scrollToTop = () => {
  if (contentRef.value) {
    contentRef.value.scrollTo({ top: 0, behavior: 'auto' });
    headerOpacity.value = 0.1;
  }
};

// 监听路由变化，自动滚动到顶部
watch(
  () => route.fullPath,
  async () => {
    await nextTick();
    scrollToTop();
  },
);

/**
 * 缓动函数 - 三次贝塞尔曲线，提供更优雅的过渡效果
 * @param t 进度值 (0-1)
 * @returns 缓动后的值
 */
const easeOutCubic = (t: number): number => {
  return 1 - (1 - t) ** 3;
};

/**
 * 处理滚动事件
 * @param e 滚动事件对象
 */
const handleScroll = (e: any) => {
  // 防抖优化，避免频繁计算
  if (scrollTimer) {
    clearTimeout(scrollTimer);
  }

  scrollTimer = setTimeout(() => {
    // 获取页面滚动距离
    const { scrollTop } = e.target;

    // 定义滚动范围和透明度范围
    const maxScrollDistance = 300; // 减少到300px，让过渡更快
    const minOpacity = 0.05; // 最小透明度
    const maxOpacity = 0.95; // 最大透明度，避免完全不透明

    // 计算滚动进度 (0-1)
    const progress = Math.min(scrollTop / maxScrollDistance, 1);

    // 使用缓动函数计算优雅的透明度变化
    const easedProgress = easeOutCubic(progress);
    const opacity = minOpacity + (maxOpacity - minOpacity) * easedProgress;

    headerOpacity.value = opacity;

    // 开发环境下的调试信息
    // if (import.meta.env.DEV) {
    //   console.log('📊 滚动信息:', {
    //     scrollTop,
    //     progress: progress.toFixed(3),
    //     easedProgress: easedProgress.toFixed(3),
    //     opacity: opacity.toFixed(3),
    //   });
    // }
  }, 0); // 10ms防抖，保持流畅性
};
</script>

<style lang="scss" scoped>
.n-layout {
  background-color: rgb(255, 255, 255);
}
</style>
