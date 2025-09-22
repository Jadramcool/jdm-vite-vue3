<!--
 * @Author: jdm
 * @Date: 2024-12-19 10:00:00
 * @LastEditors: jdm
 * @LastEditTime: 2024-12-19 10:00:00
 * @FilePath: \vite-vue3-jdm\src\layout\components\header\components\FontSelector.vue
 * @Description: 字体选择器组件
 * 
-->
<script setup lang="ts">
import { fontOptions } from '@/settings';
import { useAppStore } from '@/store';

const appStore = useAppStore();

/**
 * 字体选项配置
 */
const options = computed(() => {
  return Object.entries(fontOptions).map(([key, option]) => ({
    label: option.name,
    value: key,
  }));
});

/**
 * 处理字体选择
 * @param fontKey - 字体键值
 */
const handleFontSelect = (fontKey: string) => {
  appStore.setFont(fontKey);
  // 显示切换成功提示
  const selectedFont = fontOptions[fontKey as keyof typeof fontOptions];
  if (selectedFont) {
    window.$message?.success(`已切换到 ${selectedFont.description}`);
  }
};
</script>

<template>
  <n-popselect
    :value="appStore.currentFont"
    :options="options"
    trigger="click"
    @update:value="handleFontSelect"
  >
    <CommonWrapper>
      <JayIcon :icon="'material-symbols:font-download-outline'" />
    </CommonWrapper>
  </n-popselect>
</template>

<style scoped></style>
