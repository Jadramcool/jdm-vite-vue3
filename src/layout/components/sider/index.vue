<!--
 * @Author: jdm
 * @Date: 2024-05-06 10:22:58
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-23 11:15:06
 * @FilePath: \vite-vue3-jdm\src\layout\components\sider\index.vue
 * @Description: 
 * 
-->
<template>
  <div class="sider-container">
    <SideLogo class="logo-section" />
    <SideMenu class="cus-scroll-y flex-1" />
  </div>
</template>

<script setup>
import { SideLogo, SideMenu } from '@/layout/components';
</script>

<style lang="scss" scoped>
/**
 * 侧边栏容器样式美化
 */
.sider-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

/**
 * Logo区域样式
 */
.logo-section {
  flex-shrink: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 16px;
    right: 16px;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(24, 160, 251, 0.3) 50%,
      transparent 100%
    );
  }
}

/**
 * 暗色模式适配
 */
.dark {
  .sider-container {
    background: linear-gradient(180deg, rgba(24, 24, 28, 0.98) 0%, rgba(31, 31, 35, 0.95) 100%);
  }

  .logo-section {
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);

    &::after {
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(24, 160, 251, 0.4) 50%,
        transparent 100%
      );
    }
  }
}
</style>
