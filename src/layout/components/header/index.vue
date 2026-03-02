<!--
 * @Author: jdm 1051780106@qq.com
 * @Date: 2025-09-22 10:05:44
 * @LastEditors: jdm 1051780106@qq.com
 * @LastEditTime: 2025-12-18 18:02:56
 * @FilePath: \jdm-vite-vue3\src\layout\components\header\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="flex items-center">
    <FullScreen v-if="props.showFullScreen" />
    <DarkModeSwitch v-if="props.showDarkMode" />
    <LanguageSwitch v-if="props.showLanguage" />
    <FontSelector v-if="props.showFontSelector" />
    <Setting v-if="props.showSetting" />
    <UserCenter v-if="props.showUserCenter" />
  </div>
</template>

<script lang="ts" setup>
import {
  DarkModeSwitch,
  FontSelector,
  FullScreen,
  LanguageSwitch,
  Setting,
  UserCenter,
} from './components';

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
  showFontSelector: {
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
