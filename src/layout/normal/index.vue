<template>
  <n-layout class="wh-full flex" has-sider>
    <n-layout-sider
      :collapsed="appStore.collapsed"
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      content-style="display: flex;flex-direction: column;min-height:100%;border-right: 1px solid #f0f0f0;"
    >
      <SideLogo />
      <n-scrollbar class="flex-1">
        <SideMenu />
      </n-scrollbar>
    </n-layout-sider>
    <n-layout
      class="h-full flex flex-col"
      content-style="display: flex;flex-direction: column;min-height:100%;"
      embedded
      :native-scrollbar="false"
    >
      <n-layout-header bordered class="flex items-center">
        <MenuCollapse />
        <Breadcrumb />

        <!-- <AppHeader class="h-60 flex-shrink-0" /> -->
        <!-- <Tab></Tab> -->
      </n-layout-header>
      <n-layout-content content-style="padding: 24px;">
        <slot name="default"></slot>
      </n-layout-content>
      <!-- <n-layout-footer>成府路</n-layout-footer> -->
    </n-layout>
  </n-layout>
</template>

<script setup>
import { useAppStore } from '@/store';
import { SideLogo, SideMenu, MenuCollapse, Breadcrumb } from '@/layout/components';

const appStore = useAppStore();
</script>

<style></style>
