<script setup lang="ts">
import { useAppStore } from '@/store';

const appStore = useAppStore();
</script>

<template>
  <n-tooltip placement="bottom" trigger="hover">
    <template #trigger>
      <CommonWrapper @click="appStore.toggleFullScreen()">
        <jay-icon :icon="'material-symbols:fullscreen-exit'" v-if="appStore.fullScreen" />
        <jay-icon :icon="'material-symbols:fullscreen'" v-else />
      </CommonWrapper>
    </template>
    <span>{{ $t('app.toggleFullScreen') }}</span>
  </n-tooltip>
</template>

<style scoped></style>
