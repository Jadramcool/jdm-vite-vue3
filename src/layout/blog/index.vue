<!-- 博客 页面的布局 -->
<template>
  <n-layout class="wh-full flex" has-sider>
    <n-layout class="layout h-full" content-style="display: flex;flex-direction: column" embedded>
      <n-layout-header
        class="z-1 flex-x-center justify-between fixed bg-[#ffffff10] hover:bg-[#ffffff80]"
        content-style="transition: border-color 0.3s ease;"
      >
        <div class="flex-x-center p-x-xl">
          <SideLogo v-if="appStore.showLogo" />
        </div>
        <div class="info flex-x-center gap-1 h-full p-x-xl">
          <HeaderTools :showDarkMode="false" :showLanguage="false" :showUserCenter="false" />
        </div>
      </n-layout-header>
      <n-layout-content embedded class="h-full flex-1 overflow-hidden" :native-scrollbar="true">
        <div class="wh-full flex-col">
          <Transition :name="appStore.transitionAnimation" mode="out-in">
            <slot />
          </Transition>
        </div>
      </n-layout-content>
      <n-layout-footer bordered class="h-40px" v-if="appStore.showFooter">
        <AppCard class="flex-1 h-full flex-center">
          <Footer />
        </AppCard>
      </n-layout-footer>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { Footer, HeaderTools, SideLogo } from '@/layout/components';
import { useAppStore } from '@/store';

const appStore = useAppStore();
</script>

<style lang="scss" scoped>
.n-layout {
  background-color: rgb(255, 255, 255);
}
</style>
