<template>
  <n-text class="text-tips">{{ footerText }}</n-text>
</template>

<script lang="ts" setup>
import { useAppStore, useConfigStore } from '@/store';

const appStore = useAppStore();
const configStore = useConfigStore();

const footerText = configStore.getConfigValue('copyright') || appStore.footerText;
</script>

<style lang="scss" scoped></style>
