<template>
  <n-el
    tag="div"
    :class="{ 'card-border': bordered }"
    style="background-color: var(--card-color); transition: 0.3s var(--cubic-bezier-ease-in-out)"
  >
    <slot />
  </n-el>
  <!-- <div class="auto-bg" :class="{ 'card-border': bordered }">
    <slot />
  </div> -->
</template>

<script lang="ts" setup>
defineProps({
  bordered: Boolean,
});
</script>
