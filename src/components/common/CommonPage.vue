<template>
  <main class="h-full flex-1 overflow-hidden bg-#f5f6fb dark:bg-#121212">
    <div class="h-full flex-col">
      <transition name="fade-slide" mode="out-in" appear>
        <AppCard class="cus-scroll m-12 h-0 flex-1 rounded-8 p-24" bordered>
          <slot />
        </AppCard>
      </transition>
    </div>
  </main>

  <footer class="bg-#f5f6fb dark:bg-#121212">
    <slot v-if="$slots.footer" name="footer" />
    <AppCard v-else-if="showFooter" class="py-12">
      <TheFooter />
    </AppCard>
  </footer>
</template>

<script setup>
defineProps({
  back: {
    type: Boolean,
    default: false,
  },
  showFooter: {
    type: Boolean,
    default: false,
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: undefined,
  },
});
</script>
