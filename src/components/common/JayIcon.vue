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
    :color="iconColor || props.color"
    :class="props.hover ? 'cursor-pointer' : ''"
  >
    <Icon :icon="props.icon" />
  </n-icon>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store';
import { Icon } from '@iconify/vue';

const appStore = useAppStore();

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

  type?: string;
}
const props = withDefaults(defineProps<iconProps>(), {
  size: 18,
});

// 获取全局的primaryColor
const iconColor = computed(() => {
  if (props.color) return props.color;
  const common: Recordable = appStore?.theme?.common || {};
  const typeColor: string = common[`${props.type}Color`] || '';
  return typeColor;
});
</script>

<style lang="scss" scoped></style>
