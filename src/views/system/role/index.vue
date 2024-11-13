<template>
  <div>
    <NCard :title="$t('common.search')" size="small">
      <BasicForm @register="register" @submit="handleSubmit" ref="formRef"> </BasicForm>
    </NCard>

    <BasicTable
      ref="tableRef"
      :title="$t('modules.system.role.table.title')"
      :columns="columns"
      :filters="queryParams"
      :request="loadRoleList"
      :rowKey="(row: NaiveUI.RowData) => row.id"
      @update:checked-row-keys="handleCheck"
      @add="handleAdd"
    />

    <RoleDrawer @register="registerDrawer" @success="handleSuccess"> </RoleDrawer>
  </div>
</template>

<script lang="tsx" setup>
import { RoleApi } from '@/api';
import { BasicForm, BasicTable, useDrawer, useForm } from '@/components';
import { RoleDrawer } from './components';
import { useRoleSchema } from './schema';

defineOptions({ name: 'Role' });

// 表格/表单配置  采用computed（适配i18n）
const tableRef = ref<any>(null);
const formRef = ref<any>(null);

// 请求参数
const queryParams = ref<Query.GetParams>({});

// 表格/表单方法
const schemaMethods = {
  handleEdit(record: NaiveUI.RowData) {
    openDrawer({ record, isUpdate: true });
  },
};

const handleAdd = () => {
  openDrawer({
    isUpdate: false,
  });
};

// 表格/表单配置  采用computed（适配i18n）
const { columns, formSchemas } = useRoleSchema(schemaMethods);

const [register, { getFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  schemas: formSchemas,
  submitOnReset: true,
});

const [registerDrawer, { openDrawer }] = useDrawer();

// 表格数据请求
const loadRoleList = async (data: Query.GetParams) => {
  data.filters = { ...(data.filters || {}), ...getFieldsValue() };
  return RoleApi.roleList(data);
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
