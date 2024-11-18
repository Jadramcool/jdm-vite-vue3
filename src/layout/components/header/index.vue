<template>
  <div class="flex-x-center">
    <FullScreen></FullScreen>
    <DarkModeSwitch></DarkModeSwitch>
    <LanguageSwitch></LanguageSwitch>
    <Setting></Setting>
    <UserCenter></UserCenter>
  </div>
</template>

<script lang="ts" setup>
import { DarkModeSwitch, FullScreen, LanguageSwitch, Setting, UserCenter } from './components';
// import { useDark, useToggle, useFullscreen } from '@vueuse/core';
// import { useAppStore } from '@/store';
</script>

<style lang="scss" scoped></style>
