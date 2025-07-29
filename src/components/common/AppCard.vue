<template>
  <n-el
    tag="div"
    class="rounded-8px app-card"
    :class="{ 'card-border': bordered, 'card-hover': hoverable }"
    style="background-color: var(--card-color)"
  >
    <slot />
  </n-el>
</template>

<script lang="ts" setup>
/**
 * AppCard组件属性定义
 * @param bordered 是否显示边框
 * @param hoverable 是否启用悬停效果
 */
defineProps({
  bordered: {
    type: Boolean,
    default: false,
  },
  hoverable: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
/**
 * AppCard组件样式
 * 为卡片组件添加平滑的过渡效果，优化主题切换时的视觉体验
 */
.app-card {
  /* 为背景色、边框色和阴影添加平滑过渡效果 */
  transition:
    background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* 启用GPU加速以提升动画性能 */
  will-change: background-color, border-color, box-shadow;
}

/**
 * 悬停效果优化
 * 为card-hover类添加更平滑的过渡
 */
.app-card.card-hover {
  transition:
    background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
