<!--
 * @Author: jdm
 * @Date: 2024-05-06 10:22:58
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-23 11:15:06
 * @FilePath: \vite-vue3-jdm\src\layout\components\sider\index.vue
 * @Description: 
 * 
-->
<template>
  <SideLogo border-b="1px solid light_border dark:dark_border" />
  <SideMenu class="cus-scroll-y mt-4px h-0 flex-1" />
</template>

<script setup>
import { SideLogo, SideMenu } from '@/layout/components';
</script>
