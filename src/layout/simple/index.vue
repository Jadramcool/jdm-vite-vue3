<template>
  <div class="wh-full flex">
    <article class="w-0 flex-col flex-1">
      <AppHeader class="h-60 flex-shrink-0" />
      <slot name="default"></slot>
    </article>
  </div>
</template>

<script setup>
import AppHeader from './header/index.vue';
</script>

<style></style>
