<!--
 * @Author: Jay
 * @Date: 2024-05-30 13:50:03
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-31 17:43:42
 * @FilePath: \vite-vue3-jdm\src\components\Table\src\Table.vue
 * @Description: 自定义表格封装
 * @TODO: 1. 表格列ifShow控制
 * 
-->
<template>
  <!-- 自定义表格部分 -->
  <NCard :bordered="false" size="small">
    <template #header>
      <p class="card-header">{{ getProps.cardTitle }}</p>
    </template>
    <template #header-extra>
      <tool-bar
        v-model:columns="columnChecks"
        :showBatchDeleteBtn="getProps.showBatchDeleteBtn"
        :showAddBtn="getProps.showAddBtn"
        :showColumnsSetting="getProps.showColumnsSetting"
        @refresh="handleRefresh"
        @add="handleAdd"
        @batch-delete="handleBatchDelete"
      >
        <slot name="toolbar" />
      </tool-bar>
    </template>

    <NDataTable
      ref="dataTable"
      v-bind="getTableValue"
      :striped="isStriped"
      :bordered="isBordered"
      @update:page="updatePage"
      @update:page-size="updatePageSize"
    />
  </NCard>
</template>

<script setup lang="ts" name="BasicTable">
import { useComponentTableStore } from '@/store';
import { ToolBar } from './components';
import { useColumns, useDataSource, useLoading, usePagination } from './hooks';
import { basicProps } from './props';

defineOptions({ name: 'BasicTable' });

const emit = defineEmits(['add', 'batchDelete']);

// ********************自定义配置表格组件********************

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
  // 避免card的title和tableColumns的title冲突,将title改为tableTitle
  const cardTitle = props.title || '';
  // 去掉title属性
  const newProps = { ...props };
  delete newProps.title;
  return {
    ...customProps.value,
    ...newProps,
    cardTitle,
  };
  // return { ...props, ...customProps.value };
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
const pagination = computed(() => {
  return toRaw(unref(getPaginationInfo));
});

// -----------表格数据处理-----------
const { dataSourceRef, getDataSourceRef, reload, handleLocalPagination, fullDataSourceRef } =
  useDataSource(getProps, {
    getPaginationInfo,
    setPagination,
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
  if (!unref(getProps).localPagination) {
    reload(page);
  } else {
    dataSourceRef.value = handleLocalPagination(fullDataSourceRef.value);
  }
};

/**
 * @description: 每页显示数量切换
 * @param {*} size
 */
const updatePageSize = (size: any) => {
  setPagination({ page: 1, pageSize: size });
  if (!unref(getProps).localPagination) {
    reload({});
  } else {
    dataSourceRef.value = handleLocalPagination(fullDataSourceRef.value);
  }
};

/**
 * @description: 刷新表格
 */
const handleRefresh = async () => {
  await reload();
};

// 新增数据
const handleAdd = () => {
  emit('add');
};

const handleBatchDelete = () => {
  emit('batchDelete');
};

// 暴露方法
defineExpose({
  reload,
});
</script>

<style lang="scss" scoped>
.read-the-docs {
  color: #888;
}
</style>
