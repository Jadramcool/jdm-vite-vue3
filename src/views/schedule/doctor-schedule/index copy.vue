<template>
  <div>
    <BasicForm @register="register" @submit="handleSubmit" ref="formRef"> </BasicForm>

    <n-divider dashed />

    <BasicTable
      ref="tableRef"
      :title="'排班列表'"
      :columns="columns"
      :filters="queryParams"
      :request="loadScheduleList"
      :rowKey="(row: NaiveUI.RowData) => row.id"
      :scroll-x="1200"
      @add="handleAdd"
    />

    <ScheduleModal @register="registerModal" @success="handleSuccess"> </ScheduleModal>
  </div>
</template>

<script lang="tsx" setup>
import { DoctorScheduleApi } from '@/api';
import { BasicForm, BasicTable, useForm, useModal } from '@/components';
import { ScheduleModal } from './components';
import { useDoctorScheduleSchema } from './schema';

defineOptions({ name: 'Schedule' });

// 表格/表单配置  采用computed（适配i18n）
const tableRef = ref<any>(null);
const formRef = ref<any>(null);

// 请求参数
const queryParams = ref<Query.GetParams>({});

// 表格/表单方法
const schemaMethods = {
  handleEdit(record: NaiveUI.RowData) {
    openModal({ record, isUpdate: true });
  },
  handleDelete(record: NaiveUI.RowData) {
    DoctorScheduleApi.deleteSchedule(record.id).then(() => {
      tableRef.value.reload();
    });
  },
};

const handleAdd = () => {
  openModal({
    isUpdate: false,
  });
};

const { columns, formSchemas } = useDoctorScheduleSchema(schemaMethods);

const [register, { getFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  schemas: formSchemas,
  submitOnReset: true,
});

const [registerModal, { openModal }] = useModal();

// 表格数据请求
const loadScheduleList = (data: Query.GetParams) => {
  data.filters = { ...(data.filters || {}), ...getFieldsValue() };
  return DoctorScheduleApi.list(data);
};

// 表单提交
const handleSubmit = (data: any) => {
  data && tableRef.value.reload();
};

// 新增/编辑成功回调
const handleSuccess = () => {
  tableRef.value.reload();
};
</script>
