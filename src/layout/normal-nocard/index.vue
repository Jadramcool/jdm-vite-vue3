<template>
  <n-layout class="wh-full flex" has-sider>
    <n-layout-sider
      :collapsed="appStore.collapsed"
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      content-style="display: flex;flex-direction: column;min-height:100%;border-right: 1px solid var(--n-border-color); transition: border-color 0.3s ease;"
    >
      <SideLogo v-if="appStore.showLogo" />
      <n-scrollbar class="flex-1">
        <SideMenu />
      </n-scrollbar>
    </n-layout-sider>
    <n-layout class="layout h-full" content-style="display: flex;flex-direction: column" embedded>
      <n-layout-header
        bordered
        class="layout-header z-1 flex-x-center justify-between backdrop-blur-sm"
      >
        <div class="flex-x-center h-60px">
          <div class="flex-x-center h-full">
            <MenuCollapse />
            <Breadcrumb v-if="appStore.showBreadcrumb" />
          </div>
        </div>
        <div class="info flex-x-center gap-1 h-full p-x-xl">
          <HeaderTools />
        </div>
      </n-layout-header>
      <n-layout-header embedded class="tab-header backdrop-blur-sm">
        <TabBar v-if="appStore.showTabs"></TabBar>
      </n-layout-header>
      <n-layout-content embedded class="h-full flex-1 overflow-hidden" :native-scrollbar="true">
        <div class="wh-full flex-col p-12px">
          <Transition :name="appStore.transitionAnimation" mode="out-in">
            <slot />
          </Transition>
        </div>
        <!-- <slot name="default"></slot> -->
      </n-layout-content>
      <n-layout-footer bordered class="h-40px" v-if="appStore.showFooter">
        <AppCard
          class="flex-1 h-full flex-center"
          style="box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05)"
        >
          <Footer />
        </AppCard>
      </n-layout-footer>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import {
  Breadcrumb,
  Footer,
  HeaderTools,
  MenuCollapse,
  SideLogo,
  SideMenu,
  TabBar,
} from '@/layout/components';
import { useAppStore } from '@/store';

const appStore = useAppStore();
</script>

<style lang="scss" scoped>
/**
 * 布局头部样式美化
 * 添加渐变背景和阴影效果
 */
.layout-header {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

/**
 * 标签栏头部样式
 */
.tab-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}
</style>
