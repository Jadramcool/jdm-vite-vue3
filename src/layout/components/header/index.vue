<template>
  <div class="flex-x-center">
    <FullScreen></FullScreen>
    <DarkModeSwitch></DarkModeSwitch>
    <LanguageSwitch></LanguageSwitch>
    <Setting></Setting>
  </div>
</template>

<script lang="ts" setup>
import { FullScreen, DarkModeSwitch, LanguageSwitch, Setting } from './components';
// import { useDark, useToggle, useFullscreen } from '@vueuse/core';
// import { useAppStore } from '@/store';
</script>

<style lang="scss" scoped></style>
