<!--
 * @Author: Jay
 * @Date: 2024-04-13 15:45:42
 * @LastEditors: jdm
 * @LastEditTime: 2024-09-03 17:33:52
 * @FilePath: \vite-vue3-jdm\src\layout\components\tab\Reload.vue
 * @Description: 
 * 
-->
<template>
  <n-tooltip placement="bottom" trigger="hover">
    <template #trigger>
      <CommonWrapper @click="handleReload">
        <jay-icon :icon="'icon-park-outline:refresh'" :class="{ 'animate-spin': loading }" />
      </CommonWrapper>
    </template>
    <span>{{ $t('common.reload') }}</span>
  </n-tooltip>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store';

const appStore = useAppStore();

const loading = ref(false);

function handleReload() {
  loading.value = true;
  appStore.reloadPage();
  setTimeout(() => {
    loading.value = false;
  }, 800);
}
</script>

<style scoped></style>
