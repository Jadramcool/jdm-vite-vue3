<template>
  <n-popselect
    :value="appStore.storeColorMode"
    :options="options"
    :render-label="renderLabel"
    trigger="click"
    @update:value="handleThemeChange"
  >
    <CommonWrapper>
      <Transition name="theme-icon" mode="out-in">
        <JayIcon :key="appStore.storeColorMode" :icon="currentIcon" class="theme-icon" />
      </Transition>
    </CommonWrapper>
  </n-popselect>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store';
import { renderIcon } from '@/utils/common';
import { switchTheme, type ThemeMode } from '@/utils/theme';
import { NFlex } from 'naive-ui';

const { t } = useI18n();
const appStore = useAppStore();

// 主题图标映射
const themeIconMap = {
  light: 'icon-park-outline:sun-one',
  dark: 'icon-park-outline:moon',
  auto: 'icon-park-outline:laptop-computer',
} as const;

/**
 * 计算当前主题对应的图标
 */
const currentIcon = computed(() => {
  return themeIconMap[appStore.storeColorMode] || themeIconMap.auto;
});

/**
 * 主题选项配置
 */
const options = computed(() => {
  return [
    {
      label: t('app.light'),
      value: 'light',
      icon: themeIconMap.light,
    },
    {
      label: t('app.dark'),
      value: 'dark',
      icon: themeIconMap.dark,
    },
    {
      label: t('app.system'),
      value: 'auto',
      icon: themeIconMap.auto,
    },
  ];
});

/**
 * 处理主题切换
 * @param mode - 新的主题模式
 */
const handleThemeChange = async (mode: ThemeMode) => {
  try {
    await switchTheme(mode, {
      enableTransition: true,
      transitionDuration: 150, // 优化过渡时间
      transitionType: 'uniform', // 明确使用优化的默认过渡
      onComplete: (newMode) => {
        console.info(`主题已切换至 ${newMode} 模式`);
      },
      onError: (error) => {
        console.error('主题切换失败:', error);
        // 这里可以添加用户提示，比如使用 naive-ui 的 message
      },
    });
  } catch (error) {
    console.error('主题切换异常:', error);
  }
};

/**
 * 渲染选项标签
 * @param option - 选项配置
 */
function renderLabel(option: any) {
  return h(
    NFlex,
    { align: 'center' },
    {
      default: () => [renderIcon(option.icon)(), option.label],
    },
  );
}
</script>

<style scoped>
.theme-icon {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 主题图标切换动画 */
.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}

.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}

.theme-icon-enter-to,
.theme-icon-leave-from {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}

/* 悬停效果 */
.theme-icon:hover {
  transform: scale(1.1);
}
</style>
