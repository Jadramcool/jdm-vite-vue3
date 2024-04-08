<template>
  <n-config-provider
    class="wh-full"
    :theme="appStore.isDark ? darkTheme : undefined"
    :theme-overrides="appStore.naiveThemeOverrides"
  >
    <AppProvider>
      <router-view v-if="Layout" v-slot="{ Component, route: curRoute }">
        <component :is="Layout">
          <KeepAlive :include="keepAliveNames">
            <CommonPage show-footer>
              <component :is="Component" :key="curRoute.fullPath" />
            </CommonPage>
          </KeepAlive>
        </component>

        <!-- <LayoutSetting class="fixed right-12 top-1/2 z-999" /> -->
      </router-view>
      <router-view v-else></router-view>
    </AppProvider>
  </n-config-provider>
</template>

<script setup lang="ts" name="App">
import { darkTheme } from 'naive-ui';
import { AppProvider } from '@/components/application';
import { useCssVar } from '@vueuse/core';
import { kebabCase } from 'lodash';
import { useAppStore, useTabStore } from '@/store';

const route = useRoute();
const appStore = useAppStore();
const tabStore = useTabStore();

const layouts: any = new Map();

// 获取layout
const getLayout = (name: string): void => {
  // 利用map将加载过的layout缓存起来，防止重新加载layout导致页面闪烁
  if (layouts.get(name)) return layouts.get(name);
  const layout: any = markRaw(defineAsyncComponent(() => import(`@/layout/${name}/index.vue`)));
  layouts.set(name, layout);
  console.log(layout);
  return layout;
};

const setupCssVar = () => {
  const common: any = appStore.naiveThemeOverrides?.common || {};
  // 使用 Object.keys() 获取对象的键数组，然后对数组进行迭代
  Object.keys(common).forEach((key) => {
    const value: string = common[key];
    useCssVar(`--${kebabCase(key)}`, document.documentElement).value = value || '';
    if (key === 'primaryColor') window.localStorage.setItem('__THEME_COLOR__', value || '');
  });
};

setupCssVar();

// 返回当前路由对应的layout
const Layout: any = computed(() => {
  if (!route.matched?.length) return null;
  return getLayout((route.meta?.layout as string) || appStore.layout);
  // const layout: any = markRaw(defineAsyncComponent(() => import(`@/layout/normal/index.vue`)));
  // return layout;
});
// 获取keep-alive的所有组件名称
const keepAliveNames = computed(() => {
  console.log('tabStore.tabs', tabStore.tabs);
  return tabStore.tabs.filter((item: any) => item.keepAlive).map((item) => item.name);
});
</script>

<style lang="scss" scoped></style>
