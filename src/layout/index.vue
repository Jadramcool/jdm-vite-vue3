<template>
  <component :is="layoutComponent" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NormalLayout from './normal/index.vue';
import PublicLayout from './public/index.vue';
import BlogLayout from './blog/index.vue';
import EmptyLayout from './empty/index.vue';
import FullContentLayout from './full-content/index.vue';

const route = useRoute();

const layoutMap: Record<string, any> = {
  normal: NormalLayout,
  public: PublicLayout,
  blog: BlogLayout,
  empty: EmptyLayout,
  'full-content': FullContentLayout,
};

const layoutComponent = computed(() => {
  const layoutName = (route.meta?.layout as string) || 'normal';
  return layoutMap[layoutName] || NormalLayout;
});
</script>
