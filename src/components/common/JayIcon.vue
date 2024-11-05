<!--
 * @Author: jdm
 * @Date: 2024-09-03 16:58:20
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-28 17:19:49
 * @FilePath: \vite-vue3-jdm\src\components\common\JayIcon.vue
 * @Description: 
 * 
-->
<template>
  <n-icon
    v-if="props.icon"
    :size="props.size"
    :depth="props.depth"
    :color="props.color"
    :class="props.hover ? 'cursor-pointer' : ''"
  >
    <Icon :icon="props.icon" />
  </n-icon>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

interface iconProps {
  /* 图标名称 */
  icon?: string | undefined;
  /* 图标颜色 */
  color?: string;
  /* 图标大小 */
  size?: number;
  /* 图标深度 */
  depth?: 1 | 2 | 3 | 4 | 5;
  /* 其他属性 */
  hover?: boolean;
}
const props = withDefaults(defineProps<iconProps>(), {
  size: 18,
});
</script>

<style scoped></style>
