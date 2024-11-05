<!--
 * @Author: Jay
 * @Date: 2024-07-23 11:10:53
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-26 17:20:13
 * @FilePath: \vite-vue3-jdm\src\components\jayTable\src\components\Toolbar.vue
 * @Description: 
 * 
-->
<template>
  <div class="flex justify-end my-1">
    <n-tooltip>
      <template #trigger>
        <div>
          <CommonWrapper>
            <jay-icon @click="handleRefresh" :icon="'icon-park-outline:refresh'" />
          </CommonWrapper>
        </div>
      </template>
      <span>{{ $t('table.refresh') }}</span>
    </n-tooltip>
    <n-tooltip trigger="hover">
      <template #trigger>
        <div>
          <n-dropdown
            :options="tableSizeOptions"
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
    <NPopover placement="bottom-end" trigger="click">
      <template #trigger>
        <n-tooltip>
          <template #trigger>
            <div>
              <CommonWrapper>
                <jay-icon :icon="'icon-park-outline:column'" />
              </CommonWrapper>
            </div>
          </template>
          {{ $t('table.columnSetting') }}
        </n-tooltip>
      </template>
      <VueDraggable v-model="columns" :animation="150" filter=".none_draggable">
        <div
          v-for="item in columns"
          :key="item.key"
          class="h-36px flex-y-center items-center rd-4px px-2px hover:(bg-primary bg-opacity-50 text-white)"
        >
          <jay-icon class="mr-2 hover:cursor-move" :icon="'si:drag-indicator-alt-duotone'" />
          <NCheckbox v-model:checked="item.checked" class="none_draggable flex-1">
            {{ item.title }}
          </NCheckbox>
        </div>
      </VueDraggable>
    </NPopover>
  </div>
</template>

<script setup lang="ts">
import { useComponentTableStore } from '@/store';
import { NCheckbox } from 'naive-ui';
import { VueDraggable } from 'vue-draggable-plus';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'Toolbar' });

const emit = defineEmits(['refresh']);

// props接受父组件传过来的参数columns
const columns = defineModel<NaiveUI.TableColumnCheck[]>('columns', {
  required: true,
});
const componentTableStore = useComponentTableStore();
const { t } = useI18n();

const tableSize = ref(componentTableStore.size);
const tableSizeOptions = computed(() => {
  return [
    { label: t('table.sizeType.small'), key: 'small' },
    { label: t('table.sizeType.medium'), key: 'medium' },
    { label: t('table.sizeType.large'), key: 'large' },
  ];
});

const handleSizeSelect = (key: string) => {
  tableSize.value = key;
  componentTableStore.setSize(key);
};

const handleRefresh = () => {
  emit('refresh');
};
</script>

<style lang="scss" scoped></style>
