<template>
  <n-tooltip placement="bottom" trigger="hover">
    <template #trigger>
      <CommonWrapper @click="openSetting()">
        <jay-icon :icon="'solar:settings-outline'" />
      </CommonWrapper>
    </template>
    <span>{{ $t('app.setting') }}</span>
  </n-tooltip>
  <n-drawer v-model:show="drawerActive" :width="360" placement="right">
    <n-drawer-content :title="t('app.setting')">
      <n-divider title-placement="left">
        <p class="divider-style">{{ $t('app.themeSetting') }}</p>
      </n-divider>
      <n-space vertical>
        <n-space justify="space-between">
          {{ $t('app.weakColor') }}:
          <n-switch :value="appStore.weakColor" @update:value="appStore.toggleColorWeak"></n-switch>
        </n-space>
        <n-space justify="space-between">
          {{ $t('app.blackAndWhite') }}:
          <n-switch :value="appStore.grayMode" @update:value="appStore.toggleGrayMode"></n-switch>
        </n-space>
        <n-space justify="space-between">
          {{ $t('app.themeColor') }}:
          <n-color-picker
            class="w-200px"
            :swatches="palette"
            v-model:value="appStore.primaryColor"
            @update:value="appStore.setPrimaryColor"
          />
        </n-space>
        <n-space align="center" justify="space-between">
          {{ $t('app.pageTransition') }}
          <n-select
            v-model:value="appStore.transitionAnimation"
            class="w-10em"
            :options="transitionSelectorOptions"
            @update:value="appStore.reloadPage"
          />
        </n-space>

        <n-divider title-placement="left">
          <p class="divider-style">{{ $t('app.themeSetting') }}</p>
        </n-divider>

        <n-space vertical>
          <n-space justify="space-between">
            {{ $t('app.logoDisplay') }}:
            <n-switch v-model:value="appStore.showLogo"></n-switch>
          </n-space>
          <!-- <n-space justify="space-between">
            {{ $t('app.topProgress') }}:
            <n-switch v-model:value="appStore.showProgress"></n-switch>
          </n-space> -->
          <n-space justify="space-between">
            {{ $t('app.multitab') }}:
            <n-switch v-model:value="appStore.showTabs"></n-switch>
          </n-space>
          <n-space justify="space-between">
            {{ $t('app.bottomCopyright') }}:
            <n-switch v-model:value="appStore.showFooter"></n-switch>
          </n-space>
          <n-space justify="space-between">
            {{ $t('app.breadcrumb') }}:
            <n-switch v-model:value="appStore.showBreadcrumb"></n-switch>
          </n-space>
          <n-space justify="space-between">
            {{ $t('app.BreadcrumbIcon') }}:
            <n-switch v-model:value="appStore.showBreadcrumbIcon"></n-switch>
          </n-space>
          <n-space justify="space-between">
            {{ $t('app.watermake') }}:
            <n-switch v-model:value="appStore.showWatermark"></n-switch>
          </n-space>
        </n-space>
      </n-space>
      <template #footer>
        <n-button type="primary" @click="handleResetSetting">{{ $t('common.reset') }}</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store';

const appStore = useAppStore();
const { t } = useI18n();

const palette = [
  '#ffb8b8',
  '#d03050',
  '#F0A020',
  '#fff200',
  '#ffda79',
  '#18A058',
  '#006266',
  '#22a6b3',
  '#18dcff',
  '#2080F0',
  '#c56cf0',
  '#be2edd',
  '#706fd3',
  '#4834d4',
  '#130f40',
  '#4b4b4b',
];

const transitionSelectorOptions = [
  {
    label: t('app.transitionNull'),
    value: '',
  },
  {
    label: t('app.transitionFadeSlide'),
    value: 'fade-slide',
  },
  {
    label: t('app.transitionFadeBottom'),
    value: 'fade-bottom',
  },
  {
    label: t('app.transitionFadeScale'),
    value: 'fade-scale',
  },
  {
    label: t('app.transitionZoomFade'),
    value: 'zoom-fade',
  },
  {
    label: t('app.transitionZoomOut'),
    value: 'zoom-out',
  },
  {
    label: t('app.transitionSoft'),
    value: 'fade',
  },
];

const drawerActive = ref<boolean>(false);
// 打开设置
function openSetting() {
  drawerActive.value = !drawerActive.value;
}

// 重置样式
function handleResetSetting() {
  window.$dialog.warning({
    title: '提示',
    content: '是否重置为默认样式？',
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: () => {
      appStore.setPrimaryColor('#409eff');
    },
  });
}
</script>

<style scoped></style>
