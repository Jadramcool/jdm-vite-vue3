<template>
  <n-el
    tag="div"
    class="rounded-8px"
    :class="{ 'card-border': bordered, 'card-hover': hoverable }"
    style="background-color: var(--card-color)"
  >
    <slot />
  </n-el>
</template>

<script lang="ts" setup>
// 设置默认值
defineProps({
  bordered: {
    type: Boolean,
    default: false,
  },
  hoverable: {
    type: Boolean,
    default: false,
  },
});
</script>
