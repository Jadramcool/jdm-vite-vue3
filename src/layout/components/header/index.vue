<template>
  <div class="flex-x-center">
    <FullScreen v-if="props.showFullScreen"></FullScreen>
    <DarkModeSwitch v-if="props.showDarkMode"></DarkModeSwitch>
    <LanguageSwitch v-if="props.showLanguage"></LanguageSwitch>
    <Setting v-if="props.showSetting"></Setting>
    <UserCenter v-if="props.showUserCenter"></UserCenter>
  </div>
</template>

<script lang="ts" setup>
import { DarkModeSwitch, FullScreen, LanguageSwitch, Setting, UserCenter } from './components';

const props = defineProps({
  showFullScreen: {
    type: Boolean,
    default: true,
  },
  showDarkMode: {
    type: Boolean,
    default: true,
  },
  showLanguage: {
    type: Boolean,
    default: true,
  },
  showSetting: {
    type: Boolean,
    default: true,
  },
  showUserCenter: {
    type: Boolean,
    default: true,
  },
});
</script>

<style lang="scss" scoped></style>
