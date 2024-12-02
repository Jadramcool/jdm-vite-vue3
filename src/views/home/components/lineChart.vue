<template>
  <div id="container">
    <div ref="testRef" class="h-300px w-400px" />
  </div>
</template>

<script setup lang="ts">
import { useVChart } from '@/hook';
import { spec } from './data';

defineOptions({ name: 'LineChart' });
const { domRef: testRef } = useVChart(() => spec);
</script>

<style lang="scss" scoped></style>
