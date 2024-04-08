<template>
  <div class="auto-bg" :class="{ 'card-border': bordered }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  bordered: Boolean,
});
</script>
