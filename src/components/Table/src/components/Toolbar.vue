<!--
 * @Author: Jay
 * @Date: 2024-07-23 11:10:53
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-26 17:20:13
 * @FilePath: \vite-vue3-jdm\src\components\Table\src\components\Toolbar.vue
 * @Description: 
 * 
-->
<template>
  <div class="flex justify-end my-1">
    <NSpace>
      <slot></slot>
      <NButton @click="handleAdd" type="primary" ghost size="small" v-if="attrs.showAddBtn">
        <template #icon>
          <jay-icon :icon="'icon-park-outline:plus'" />
        </template>
        {{ $t('common.add') }}
      </NButton>
      <NButton
        @click="handleBatchDelete"
        type="error"
        ghost
        size="small"
        v-if="attrs.showBatchDeleteBtn"
      >
        <template #icon>
          <jay-icon :icon="'icon-park-outline:delete'" />
        </template>
        {{ $t('common.batch') + $t('common.delete') }}
      </NButton>
      <template v-if="tableOperateType === 'button'">
        <NButton @click="handleRefresh" ghost size="small">
          <template #icon>
            <jay-icon @click="handleRefresh" :icon="'icon-park-outline:refresh'" />
          </template>
          {{ $t('table.refresh') }}
        </NButton>
        <NPopover v-if="attrs.showColumnsSetting" placement="bottom-end" trigger="click">
          <template #trigger>
            <NButton ghost size="small">
              <template #icon>
                <jay-icon :icon="'icon-park-outline:column'" />
              </template>
              {{ $t('table.columnSetting') }}
            </NButton>
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
      </template>
    </NSpace>
    <div v-if="tableOperateType === 'icon'" class="flex justify-end my-1">
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
  </div>
</template>

<script setup lang="ts">
import { useComponentTableStore } from '@/store';
import { NCheckbox } from 'naive-ui';
import { VueDraggable } from 'vue-draggable-plus';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'Toolbar' });

const emit = defineEmits(['refresh', 'add', 'batchDelete']);

const attrs = useAttrs();
// props接受父组件传过来的参数columns
const columns = defineModel<NaiveUI.TableColumnCheck[]>('columns', {
  required: true,
});
const componentTableStore = useComponentTableStore();
const { t } = useI18n();

const tableSize = ref(componentTableStore.size);
const tableOperateType = ref(componentTableStore.operateType);
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

const handleBatchDelete = () => {
  emit('batchDelete');
};

const handleRefresh = () => {
  emit('refresh');
};

const handleAdd = () => {
  emit('add');
};
</script>
