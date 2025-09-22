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
const tabStore = useTabStore();
const userStore = useUserStore();

// 布局缓存，防止重新加载导致页面闪烁
const layouts: Map<string, any> = new Map();

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

// TODO 待删除 获取组件实例
const onVNodeMounted = (vnode: { type: any }) => {
  console.log('Component:', vnode.type.name);
};

/**
 * 初始化应用主题和字体
 */
onMounted(() => {
  // 初始化主题
  appStore.setPrimaryColor();
  // 初始化字体
  appStore.setFont(appStore.currentFont);
});

/**
 * 获取并缓存布局组件
 * @param name - 布局名称
 * @returns 布局组件
 */
const getLayout = (name: string) => {
  // 利用map将加载过的layout缓存起来，防止重新加载layout导致页面闪烁
  if (layouts.has(name)) {
    return layouts.get(name);
  }

  const layout = markRaw(defineAsyncComponent(() => import(`@/layout/${name}/index.vue`)));
  layouts.set(name, layout);
  return layout;
};

/**
 * 计算当前路由对应的布局组件
 */
const Layout = computed(() => {
  if (!route.matched?.length) return null;
  return getLayout((route.meta?.layout as string) || appStore.layout);
});

/**
 * 计算当前路由的额外数据
 */
const routeExtraData = computed(() => {
  return route.meta?.extraData || null;
});

/**
 * 计算需要keep-alive的组件名称列表
 */
const keepAliveNames = computed(() => {
  return tabStore.tabs.filter((item: any) => item.keepAlive).map((item: any) => item?.name);
});
</script>

<style lang="scss"></style>
