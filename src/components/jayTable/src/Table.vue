<!--
 * @Author: Jay
 * @Date: 2024-05-30 13:50:03
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-28 11:25:06
 * @FilePath: \vite-vue3-jdm\src\components\jayTable\src\Table.vue
 * @Description: 自定义表格封装
 * 
-->
<template>
  <NCard title="搜索表格" size="small">
    <BasicForm> </BasicForm>
  </NCard>
  <!-- 自定义表格部分 -->
  <n-card :bordered="false" :title="props.title" size="small">
    <template #header-extra>
      <tool-bar v-model:columns="columnChecks" @refresh="handleRefresh" />
    </template>

    <n-data-table
      ref="dataTable"
      v-bind="getTableValue"
      :striped="isStriped"
      :bordered="isBordered"
      @update:page="updatePage"
      @update:page-size="updatePageSize"
    />
  </n-card>
</template>

<script setup lang="ts">
import { BasicForm } from '@/components';
import { useComponentTableStore } from '@/store';
import { ToolBar } from './components';
import { useColumns, useDataSource, useLoading, usePagination } from './hooks';
import { basicProps } from './props';

defineOptions({ name: 'JayTable' });

const dataTable = ref<any>(null);
const componentTableStore = useComponentTableStore();

// 初始化默认props
const props = defineProps(basicProps);

// 自定义变化的props，比如size，别的参数在此添加
const customProps = computed(() => {
  return {
    size: componentTableStore.size, // 表格尺寸
  };
});

// 获取props
const getProps: any = computed(() => {
  return { ...props, ...customProps.value };
});

// -----------自定义配置-----------
const isStriped = ref(true); // 是否显示斑马线标识符
const isBordered = ref(false); // 是否显示边框
// -----------自定义配置-----------

// -----------工具栏处理-
const { columnChecks, getColumns } = useColumns(getProps);

// -----------loading处理-----------
// 获取表格加载动画的钩子函数
const { getLoading, setLoading } = useLoading(getProps);

// -----------分页处理-----------
const { getPaginationInfo, setPagination } = usePagination(getProps);
// 分页数据
const pagination = computed(() => toRaw(unref(getPaginationInfo)));

// -----------表格数据处理-----------
const { getDataSourceRef, reload } = useDataSource(getProps, {
  getPaginationInfo,
  setPagination,
  useLoading,
  setLoading,
});

// 表格数据,组装表格信息
const getTableValue: any = computed(() => {
  const tableData = unref(getDataSourceRef);
  return {
    ...unref(getProps),
    data: tableData,
    columns: unref(getColumns),
    pagination: pagination.value,
    loading: unref(getLoading),
    remote: true,
  };
});

/**
 * @description: 更新页面（切换页面）
 * @param {*} page
 */
const updatePage = (page: any) => {
  setPagination({ page });
  reload(page);
};

/**
 * @description: 每页显示数量切换
 * @param {*} size
 */
const updatePageSize = (size: any) => {
  setPagination({ page: 1, pageSize: size });
  reload({});
};

/**
 * @description: 刷新表格
 */
const handleRefresh = async () => {
  await reload();
};
</script>

<style lang="scss" scoped>
.read-the-docs {
  color: #888;
}
</style>
