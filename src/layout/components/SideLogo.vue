<template>
  <router-link class="h-60 f-c-c" to="/">
    <!-- <img src="@/assets/images/logo.png" class="h-40" /> -->
    <TheLogo class="rounded-8!" />
    <h2
      v-show="!appStore.collapsed"
      class="ml-10 max-w-140 flex-shrink-0 text-16 color-primary font-bold"
    >
      {{ title }}
    </h2>
  </router-link>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store';

const appStore = useAppStore();

const title = import.meta.env.VITE_TITLE;
</script>
<style lang="scss"></style>
