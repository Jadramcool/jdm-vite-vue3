<template>
  <div>
    <BasicForm @register="register" @submit="handleSubmit" ref="formRef"> </BasicForm>

    <n-divider dashed />

    <BasicTable
      ref="tableRef"
      title="kb"
      :columns="columns"
      :filters="queryParams"
      :request="loadNoticeList"
      :rowKey="(row: NaiveUI.RowData) => row.id"
      scroll-x="1400"
      @update:checked-row-keys="handleCheck"
      @add="handleAdd"
    />
  </div>
</template>

<script lang="tsx" setup>
import { U3C3Api } from '@/api';
import { BasicForm, BasicTable, useForm } from '@/components';
// import { $t } from '@/locales';
import { useResourceSchema } from './schema';

defineOptions({ name: 'Notice' });
onMounted(() => {
  // 获取表格数据
});

const tableRef = ref<any>(null);
const formRef = ref<any>(null);

// 请求参数
const queryParams = ref<Query.GetParams>({});

// 表格/表单方法
const schemaMethods = {
  handleDelete(record: NaiveUI.RowData) {
    console.log('🚀 ~ handleDelete ~ record:', record);
    // U3C3Api.deleteNotice(record.id).then(() => {
    //   window.$message?.success($t('common.delete') + $t('common.success'));
    //   tableRef.value.reload();
    // });
  },
};

const handleAdd = () => {};

const { columns, formSchemas } = useResourceSchema(schemaMethods);

const [register, { getFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  schemas: formSchemas,
  submitOnReset: true,
});

// 表格数据请求
const loadNoticeList = async (data: Query.GetParams) => {
  data.filters = { ...(data.filters || {}), ...getFieldsValue() };
  const res = await U3C3Api.list(data);
  console.log('🚀 ~ loadNoticeList ~ res:', res);
  return res;
};

// 表单提交
const handleSubmit = (data: any) => {
  data && tableRef.value.reload();
};

const handleCheck = (keys: Array<string | number>, rows: object[]) => {
  console.log(keys, rows);
};
</script>
