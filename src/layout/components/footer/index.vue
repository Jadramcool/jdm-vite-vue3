<template>
  <n-text class="text-tips">{{ appStore.footerText }}</n-text>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store';

const appStore = useAppStore();
</script>

<style lang="scss" scoped></style>
