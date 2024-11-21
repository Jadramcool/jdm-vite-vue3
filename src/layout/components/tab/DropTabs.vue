<script setup lang="ts">
import { useTabStore } from '@/store';
import { renderIcon } from '@/utils';

const tabStore = useTabStore();

function renderDropTabsLabel(option: any) {
  return option.title;
}
function renderDropTabsIcon(option: any) {
  return renderIcon(option.icon)!();
}

const router = useRouter();
function handleDropTabs(_key: string, option: any) {
  router.push(option.path);
}
</script>

<template>
  <n-dropdown
    :options="tabStore.tabs"
    :render-label="renderDropTabsLabel"
    :render-icon="renderDropTabsIcon"
    trigger="click"
    size="medium"
    @select="handleDropTabs"
  >
    <CommonWrapper>
      <JayIcon :icon="'icon-park-outline:application-menu'" />
    </CommonWrapper>
  </n-dropdown>
</template>

<style scoped></style>
