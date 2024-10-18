<!--
 * @Author: Jay
 * @Date: 2024-07-23 11:10:53
 * @LastEditors: jdm
 * @LastEditTime: 2024-09-03 18:13:27
 * @FilePath: \vite-vue3-jdm\src\components\jayTable\src\components\toolbar.vue
 * @Description: 
 * 
-->
<template>
  <div class="flex justify-end">
    <n-tooltip>
      <template #trigger>
        <div>
          <CommonWrapper>
            <jay-icon :icon="'icon-park-outline:refresh'" />
          </CommonWrapper>
        </div>
      </template>
      <span>{{ $t('table.refresh') }}</span>
    </n-tooltip>
    <n-tooltip trigger="hover">
      <template #trigger>
        <div>
          <n-dropdown
            :options="options"
            trigger="click"
            v-model:value="tableSize"
            @select="handleSizeSelect"
          >
            <CommonWrapper>
              <jay-icon :icon="'mdi:human-male-height-variant'" />
            </CommonWrapper>
          </n-dropdown>
        </div>
      </template>
      <span>{{ $t('table.size') }}</span>
    </n-tooltip>
  </div>
</template>

<script setup lang="ts">
import { useComponentTableStore } from '@/store';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'Toolbar' });

const componentTableStore = useComponentTableStore();

const { t } = useI18n();

const tableSize = componentTableStore.size;

const options = [
  { label: `${t('table.sizeType.small')}`, key: 'small' },
  { label: `${t('table.sizeType.medium')}`, key: 'medium' },
  { label: `${t('table.sizeType.large')}`, key: 'large' },
];

const handleSizeSelect = (key: string) => {
  tableSize.value = key;
};
</script>

<style lang="scss" scoped></style>
