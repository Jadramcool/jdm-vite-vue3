<!--
 * @Author: Jay
 * @Date: 2024-05-06 10:22:58
 * @LastEditors: Jay
 * @LastEditTime: 2024-08-01 17:31:15
 * @FilePath: \vite-vue3-jdm\src\App.vue
 * @Description: 
 * 
-->
<template>
  <n-config-provider
    class="wh-full"
    inline-theme-disabled
    :theme="appStore.colorMode === 'dark' ? darkTheme : null"
    :theme-overrides="appStore.theme"
    :locale="naiveLocale.locale"
    :date-locale="naiveLocale.dateLocale"
  >
    <Application>
      <router-view v-if="Layout" v-slot="{ Component, route: curRoute }">
        <component :is="Layout">
          <KeepAlive :include="keepAliveNames">
            <component :is="Component" v-if="appStore.loadFlag" :key="curRoute.fullPath" />
          </KeepAlive>
        </component>
      </router-view>
      <Watermark :show-watermark="appStore.showWatermark" />
    </Application>
  </n-config-provider>
</template>

<script setup lang="ts" name="App">
import { darkTheme } from 'naive-ui';
import { useAppStore, useTabStore } from '@/store';
import { naiveI18nOptions } from '@/utils';
import Application from './components/application/Application.vue';

console.log('🚀 ~ naiveI18nOptions:', naiveI18nOptions);

const route = useRoute();
const appStore = useAppStore();
const tabStore = useTabStore();

const layouts: any = new Map();

const naiveLocale = computed(() => {
  return naiveI18nOptions[appStore.lang] ? naiveI18nOptions[appStore.lang] : naiveI18nOptions.enUS;
});

onMounted(() => {
  // 初始化主题
  appStore.setPrimaryColor();
});
// 获取layout
const getLayout = (name: string): void => {
  // 利用map将加载过的layout缓存起来，防止重新加载layout导致页面闪烁
  if (layouts.get(name)) return layouts.get(name);
  const layout: any = markRaw(defineAsyncComponent(() => import(`@/layout/${name}/index.vue`)));
  layouts.set(name, layout);
  return layout;
};

// // 设置全局样式
// const setupCssVar = () => {
//   const common: any = appStore.naiveThemeOverrides?.common || {};
//   // 使用 Object.keys() 获取对象的键数组，然后对数组进行迭代
//   Object.keys(common).forEach((key) => {
//     const value: string = common[key];
//     useCssVar(`--${kebabCase(key)}`, document.documentElement).value = value || '';
//     if (key === 'primaryColor') {
//       window.localStorage.setItem('__THEME_COLOR__', value || '');
//     }
//   });
// };
// setupCssVar();

// 返回当前路由对应的layout
const Layout: any = computed(() => {
  if (!route.matched?.length) return null;
  return getLayout((route.meta?.layout as string) || appStore.layout);
});
// 获取keep-alive的所有组件名称
const keepAliveNames = computed(() => {
  return tabStore.tabs.filter((item: any) => item.keepAlive).map((item: any) => item?.name);
});
</script>

<style lang="scss"></style>
