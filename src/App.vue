<!--
 * @Author: Jay
 * @Date: 2024-05-06 10:22:58
 * @LastEditors: jdm
 * @LastEditTime: 2024-09-03 18:26:10
 * @FilePath: \vite-vue3-jdm\src\App.vue
 * @Description: 
 * 
-->
<template>
  <n-config-provider
    class="wh-full"
    inline-theme-disabled
    :theme="currentTheme"
    :theme-overrides="appStore.theme"
    :locale="naiveLocale.locale"
    :date-locale="naiveLocale.dateLocale"
  >
    <n-global-style />
    <Application>
      <router-view />
      <Watermark :show-watermark="appStore.showWatermark" :text="userStore.userInfo.username" />
    </Application>
  </n-config-provider>
</template>

<script setup lang="ts" name="App">
import { useAppStore, useUserStore } from '@/store';
import { naiveI18nOptions } from '@/utils';
import { darkTheme } from 'naive-ui';
import Application from './components/application/Application.vue';

const appStore = useAppStore();
const userStore = useUserStore();

/**
 * 计算当前语言对应的naive-ui国际化配置
 */
const naiveLocale = computed(() => {
  const { lang }: { lang: App.lang } = appStore;
  return naiveI18nOptions[lang] || naiveI18nOptions.enUS;
});

/**
 * 计算当前主题配置
 * 优化：使用计算属性缓存主题对象，避免频繁创建
 */
const currentTheme = computed(() => {
  return appStore.colorMode === 'dark' ? darkTheme : null;
});

/**
 * 初始化应用主题和字体
 */
onMounted(() => {
  // 初始化主题
  appStore.setPrimaryColor();
  // 初始化字体
  appStore.setFont(appStore.currentFont);
});
</script>

<style lang="scss"></style>
