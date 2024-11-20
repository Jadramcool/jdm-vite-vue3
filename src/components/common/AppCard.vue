<template>
  <n-el
    tag="div"
    class="rounded-8px"
    :class="{ 'card-border': bordered }"
    style="background-color: var(--card-color); transition: 0.3s var(--cubic-bezier-ease-in-out)"
  >
    <slot />
  </n-el>
</template>

<script lang="ts" setup>
defineProps({
  bordered: Boolean,
});
</script>
