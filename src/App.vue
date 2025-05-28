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
    :theme="appStore.colorMode === 'dark' ? darkTheme : null"
    :theme-overrides="appStore.theme"
    :locale="naiveLocale.locale"
    :date-locale="naiveLocale.dateLocale"
  >
    <n-global-style />
    <Application>
      <router-view v-if="Layout" v-slot="{ Component, route: curRoute }">
        <component :is="Layout" v-bind="routeExtraData">
          <KeepAlive :include="keepAliveNames">
            <component
              :is="Component"
              v-if="appStore.loadFlag"
              :key="curRoute.fullPath"
              @vue:mounted="onVNodeMounted"
            />
          </KeepAlive>
        </component>
      </router-view>
      <Watermark :show-watermark="appStore.showWatermark" :text="userStore.userInfo.username" />
    </Application>
  </n-config-provider>
</template>

<script setup lang="ts" name="App">
import { useAppStore, useTabStore, useUserStore } from '@/store';
import { naiveI18nOptions } from '@/utils';
import { darkTheme } from 'naive-ui';
import Application from './components/application/Application.vue';

const route = useRoute();
const appStore = useAppStore();
console.log('🚀 ~ appStore:', appStore.theme);
const tabStore = useTabStore();
const userStore = useUserStore();

const layouts: any = new Map();

const naiveLocale: any = computed(() => {
  const { lang }: { lang: App.lang } = appStore;
  return naiveI18nOptions[lang] ? naiveI18nOptions[lang] : naiveI18nOptions.enUS;
});

// TODO 待删除 获取组件实例
const onVNodeMounted = (vnode: { type: any }) => {
  console.log('Component:', vnode.type.name);
};

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

// 返回当前路由对应的layout
const Layout: any = computed(() => {
  if (!route.matched?.length) return null;
  return getLayout((route.meta?.layout as string) || appStore.layout);
});

// 返回当前路由额外数据
const routeExtraData: any = computed(() => {
  return route.meta?.extraData || null;
});
// 获取keep-alive的所有组件名称
const keepAliveNames = computed(() => {
  // console.log(tabStore.tabs);
  // console.log(tabStore.tabs.filter((item: any) => item.keepAlive).map((item: any) => item?.name));
  return tabStore.tabs.filter((item: any) => item.keepAlive).map((item: any) => item?.name);
});
</script>

<style lang="scss"></style>
