<template>
  <n-el
    tag="div"
    class="rounded-8px"
    :class="{ 'card-border': bordered }"
    style="background-color: var(--card-color)"
  >
    <slot />
  </n-el>
</template>

<script lang="ts" setup>
defineProps({
  bordered: Boolean,
});
</script>
