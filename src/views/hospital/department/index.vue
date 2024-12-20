<template>
  <div>
    <BasicForm @register="register" @submit="handleSubmit" ref="formRef"> </BasicForm>
    <n-divider dashed />

    <BasicTable
      ref="tableRef"
      :title="'部门列表'"
      :columns="columns"
      :filters="queryParams"
      :request="loadDepartmentList"
      :rowKey="(row: NaiveUI.RowData) => row.id"
      :scroll-x="1200"
      @update:checked-row-keys="handleCheck"
      @add="handleAdd"
    />

    <DepartmentModal @register="registerModal" @success="handleSuccess"> </DepartmentModal>
  </div>
</template>

<script lang="tsx" setup>
import { DepartmentApi } from '@/api';
import { BasicForm, BasicTable, useForm, useModal } from '@/components';
import { DepartmentModal } from './components';
import { useDepartmentSchema } from './schema';

defineOptions({ name: 'Department' });

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
    DepartmentApi.deleteDepartment(record.id).then(() => {
      tableRef.value.reload();
    });
  },
  handleSetAuth(record: NaiveUI.RowData) {
    openModal({ record, isUpdate: true });
  },
};

const handleAdd = () => {
  openModal({
    isUpdate: false,
  });
};

// 表格/表单配置  采用computed（适配i18n）
const { columns, formSchemas } = useDepartmentSchema(schemaMethods);

const [register, { getFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  schemas: formSchemas,
  submitOnReset: true,
});

const [registerModal, { openModal }] = useModal();

// 表格数据请求
const loadDepartmentList = async (data: Query.GetParams) => {
  data.filters = { ...(data.filters || {}), ...getFieldsValue() };
  data.options = { with_menu: true };
  return DepartmentApi.departmentList(data);
};

// 表单提交
const handleSubmit = (data: any) => {
  data && tableRef.value.reload();
};

// 新增/编辑成功回调
const handleSuccess = () => {
  tableRef.value.reload();
};

const handleCheck = (keys: Array<string | number>, rows: object[]) => {
  console.log(keys, rows);
};
</script>
