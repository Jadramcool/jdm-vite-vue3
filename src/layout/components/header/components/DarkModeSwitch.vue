<template>
  <n-popselect
    :value="appStore.storeColorMode"
    :options="options"
    :render-label="renderLabel"
    trigger="click"
    @update:value="appStore.setColorMode"
  >
    <CommonWrapper>
      <JayIcon :icon="'icon-park-outline:moon'" v-if="appStore.storeColorMode === 'dark'" />

      <JayIcon :icon="'icon-park-outline:sun-one'" v-if="appStore.storeColorMode === 'light'" />
      <JayIcon
        :icon="'icon-park-outline:laptop-computer'"
        v-if="appStore.storeColorMode === 'auto'"
      />
    </CommonWrapper>
  </n-popselect>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store';
import { renderIcon } from '@/utils/common';
import { NFlex } from 'naive-ui';

const { t } = useI18n();

const appStore = useAppStore();

const options = computed(() => {
  return [
    {
      label: t('app.light'),
      value: 'light',
      icon: 'icon-park-outline:sun-one',
    },
    {
      label: t('app.dark'),
      value: 'dark',
      icon: 'icon-park-outline:moon',
    },
    {
      label: t('app.system'),
      value: 'auto',
      icon: 'icon-park-outline:laptop-computer',
    },
  ];
});

function renderLabel(option: any) {
  return h(
    NFlex,
    { align: 'center' },
    {
      default: () => [renderIcon(option.icon)(), option.label],
    },
  );
}
</script>

<style scoped></style>
