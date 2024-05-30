<template>
  <n-button @click="updatePage">测试</n-button>
  <n-data-table
    v-bind="getTableValue"
    :columns="columns"
    :pagination="pagination"
    :bordered="false"
    @update:page="updatePage"
  />
</template>

<script setup lang="ts">
import { usePagination, useDataSource } from './hooks';
import { basicProps } from './props';

defineOptions({ name: 'JayTable' });

const props = defineProps(basicProps);
// 获取props
const getProps = computed(() => {
  return { ...props };
});
const { getDataSourceRef, reload } = useDataSource(getProps);
const { getPaginationInfo } = usePagination(getProps);
const pagination = computed(() => toRaw(unref(getPaginationInfo)));
console.log('🚀 ~ pagination:', pagination);

const getTableValue = computed(() => {
  const tableData = unref(getDataSourceRef);
  return {
    ...props,
    data: tableData,
    pagination: getPaginationInfo.value,
  };
});

// 页码切换
function updatePage(page: any) {
  // setPagination({ page: page });
  reload(page);
}
</script>

<style lang="scss" scoped>
.read-the-docs {
  color: #888;
}
</style>
