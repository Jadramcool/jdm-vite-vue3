<template>
  <router-link class="h-60px flex-center logo-container" to="/">
    <!-- <img src="@/assets/images/logo.png" class="h-40px" /> -->
    <div class="logo-wrapper">
      <TheLogo class="rounded-8px! logo-icon" />
    </div>
    <h2
      v-show="!appStore.collapsed"
      class="ml-10px max-w-140px flex-shrink-0 text-16px color-primary font-bold logo-text"
    >
      {{ title }}
    </h2>
  </router-link>
</template>

<script lang="ts" setup>
import { useAppStore, useConfigStore } from '@/store';

const appStore = useAppStore();
const configStore = useConfigStore();
const title = configStore.getConfigValue('system.siteName') || import.meta.env.VITE_TITLE;
</script>
<style lang="scss" scoped>
/**
 * Logo容器样式美化
 */
.logo-container {
  padding: 0 16px;
  margin: 8px 12px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(24, 160, 251, 0.05) 0%, rgba(24, 160, 251, 0.02) 100%);
    border-radius: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(24, 160, 251, 0.15);

    &::before {
      opacity: 1;
    }

    .logo-icon {
      transform: scale(1.05) rotate(5deg);
    }

    .logo-text {
      color: var(--primary-color);
      transform: translateX(2px);
    }
  }
}

/**
 * Logo图标包装器
 */
.logo-wrapper {
  position: relative;
  z-index: 1;
}

/**
 * Logo图标样式
 */
.logo-icon {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/**
 * Logo文字样式
 */
.logo-text {
  position: relative;
  z-index: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, var(--primary-color) 0%, #1890ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/**
 * 暗色模式适配
 */
.dark {
  .logo-container {
    &::before {
      background: linear-gradient(
        135deg,
        rgba(24, 160, 251, 0.08) 0%,
        rgba(24, 160, 251, 0.04) 100%
      );
    }

    &:hover {
      box-shadow: 0 8px 25px rgba(24, 160, 251, 0.2);
    }
  }

  .logo-text {
    background: linear-gradient(135deg, #4dabf7 0%, #1890ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}
</style>
