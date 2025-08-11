<template>
  <div>
    <BasicForm @register="register" @submit="handleSubmit" ref="formRef"> </BasicForm>

    <n-divider dashed />

    <BasicTable
      ref="tableRef"
      title="爬取日志"
      :columns="columns"
      :filters="queryParams"
      :request="loadLogList"
      :rowKey="(row: NaiveUI.RowData) => row.id"
      @update:checked-row-keys="handleCheck"
    />
  </div>
</template>

<script lang="tsx" setup>
import { U3C3Api } from '@/api';
import { BasicForm, BasicTable, useForm } from '@/components';
import { useLogSchema } from './schema';

defineOptions({ name: 'U3C3Log' });

const tableRef = ref<any>(null);
const formRef = ref<any>(null);

// 请求参数
const queryParams = ref<Query.GetParams>({});

// 表格/表单方法
const schemaMethods = {
  /**
   * 删除日志记录
   * @param record 表格行数据
   */
  handleDelete() {
    // 这里可以根据实际需要实现删除功能
    window.$message?.warning('删除功能暂未实现');
  },

  /**
   * 查看详细信息
   * @param record 表格行数据
   */
  handleViewDetail(record: NaiveUI.RowData) {
    // 这里可以实现查看详细信息的功能
    console.log('查看详情:', record);
    window.$message?.info('查看详情功能暂未实现');
  },

  /**
   * 重新执行爬取任务
   * @param record 表格行数据
   */
  handleRetry(record: NaiveUI.RowData) {
    // 这里可以实现重新执行爬取任务的功能
    console.log('重新执行:', record);
    window.$message?.info('重新执行功能暂未实现');
  },
};

const { columns, formSchemas } = useLogSchema(schemaMethods);

const [register, { getFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  schemas: formSchemas,
  submitOnReset: true,
  tableRef,
});

/**
 * 表格数据请求
 * @param data 查询参数
 */
const loadLogList = async (data: Query.GetParams) => {
  data.filters = { ...(data.filters || {}), ...getFieldsValue() };
  console.log('🚀 ~ loadLogList ~ data.filters:', data.filters);
  const res = await U3C3Api.logData(data);
  return res;
};

/**
 * 表单提交
 * @param data 表单数据
 */
const handleSubmit = (data: any) => {
  data && tableRef.value.reload();
};

/**
 * 处理表格行选择
 * @param keys 选中的行键
 * @param rows 选中的行数据
 */
const handleCheck = (keys: Array<string | number>, rows: object[]) => {
  console.log(keys, rows);
};
</script>
