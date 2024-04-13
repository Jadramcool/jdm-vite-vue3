<template>
  <div class="wh-full">
    <transition name="fade-slide" mode="out-in" appear>
      <slot />
    </transition>
    <!-- <slot v-if="$slots.footer" name="footer" /> -->
    <!-- <TheFooter v-else-if="showFooter" class="mb-12 mt-auto" /> -->
    <n-back-top :bottom="20" />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  full: {
    type: Boolean,
    default: false,
  },
  showFooter: {
    type: Boolean,
    default: false,
  },
});
</script>
