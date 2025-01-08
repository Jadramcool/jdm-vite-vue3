<template>
  <div>
    <BasicForm @register="register" @submit="handleSubmit" ref="formRef"> </BasicForm>

    <n-divider dashed />

    <BasicTable
      ref="tableRef"
      :title="'患者列表'"
      :columns="columns"
      :filters="queryParams"
      :request="loadUserList"
      :rowKey="(row: NaiveUI.RowData) => row.id"
      :pagination="{ pageSize: 10 }"
      :showAddBtn="hasPermission('system:user:create')"
      :showBatchDeleteBtn="true"
      :checked-row-keys="checkedRows"
      :scroll-x="1500"
      @update:checked-row-keys="handleCheck"
      @add="handleAdd"
      @batchDelete="handleBatchDelete"
    >
    </BasicTable>

    <PatientDrawer @register="registerDrawer" @success="handleSuccess"> </PatientDrawer>
    <UserDetailModal @register="registerUserDetailModal" :roleType="'patient'"></UserDetailModal>
  </div>
</template>

<script lang="tsx" setup>
import { PatientApi } from '@/api';
import { BasicForm, BasicTable, useDrawer, useForm, useModal } from '@/components';
import { $t } from '@/locales/i18n';
import { hasPermission } from '@/utils';
import { PatientDrawer } from './components';
import { usePatientSchema } from './schema';

defineOptions({ name: 'Patient' });

const tableRef = ref<any>(null);
const formRef = ref<any>(null);

const checkedRows = ref<Array<number | string>>([]);

// 请求参数
const queryParams = ref<Query.GetParams>({});

// 表格/表单方法
const schemaMethods = {
  handleEdit(record: NaiveUI.RowData) {
    openDrawer({
      record,
      isUpdate: true,
    });
  },
  handleDelete(record: NaiveUI.RowData) {
    PatientApi.deletePatient(record.id).then(() => {
      tableRef.value.reload();
    });
  },

  handleDetail(record: NaiveUI.RowData) {
    openUserDetailModal(record);
  },
  handleEnable(record: NaiveUI.RowData) {
    PatientApi.enable(record.id, record.user.status === 0 ? 1 : 0).then(() => {
      tableRef.value.reload();
    });
  },
};

const handleAdd = () => {
  openDrawer({
    isUpdate: false,
  });
};

const { columns, formSchemas } = usePatientSchema(schemaMethods);

const [register, { getFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  schemas: formSchemas,
  submitOnReset: true,
});

const [registerDrawer, { openDrawer }] = useDrawer();
const [registerUserDetailModal, { openModal: openUserDetailModal }] = useModal();

// 表格数据请求
const loadUserList = async (data: Query.GetParams) => {
  data.filters = { ...(data.filters || {}), ...getFieldsValue() };

  return PatientApi.list(data);
};

// 表单提交
const handleSubmit = (data: any) => {
  data && tableRef.value.reload();
};

// 新增/编辑成功回调
const handleSuccess = () => {
  tableRef.value.reload();
};

// 批量删除
const handleBatchDelete = () => {
  if (!checkedRows.value.length) {
    window.$message.error($t('message.pleaseSelectDeleteUser'));
    return;
  }
  PatientApi.batchDelete(checkedRows.value).then(() => {
    checkedRows.value = [];
    tableRef.value.reload();
  });
};

const handleCheck = (keys: Array<string | number>) => {
  checkedRows.value = keys;
};
</script>
