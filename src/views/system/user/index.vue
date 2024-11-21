<!--
 * @Author: Jay
 * @Date: 2024-05-30 10:29:46
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-31 17:04:41
 * @FilePath: \vite-vue3-jdm\src\views\system\user\index.vue
 * @Description: 
 * 
-->
<template>
  <div>
    <BasicForm @register="register" @submit="handleSubmit" ref="formRef"> </BasicForm>

    <n-divider dashed />

    <BasicTable
      ref="tableRef"
      :title="$t('modules.system.user.table.title')"
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

    <UserDrawer @register="registerDrawer" @success="handleSuccess"> </UserDrawer>
  </div>
</template>

<script lang="tsx" setup>
import { UserManagerApi } from '@/api/system';
import { BasicForm, BasicTable, useDrawer, useForm } from '@/components';
import { $t } from '@/locales/i18n';
import { hasPermission } from '@/utils';
import { UserDrawer } from './components';
import { useUserSchema } from './schema';

defineOptions({ name: 'UserManager' });

// 表格/表单配置  采用computed（适配i18n）
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
    UserManagerApi.deleteUser(record.id).then(() => {
      tableRef.value.reload();
    });
  },
  handleEnable(record: NaiveUI.RowData) {
    UserManagerApi.enableUser(record.id, record.status === 0 ? 1 : 0).then(() => {
      tableRef.value.reload();
    });
  },
};

const handleAdd = () => {
  openDrawer({
    isUpdate: false,
  });
};

// 表格/表单配置  采用computed（适配i18n）
const { columns, formSchemas } = useUserSchema(schemaMethods);

const [register, { getFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  schemas: formSchemas,
  submitOnReset: true,
});

const [registerDrawer, { openDrawer }] = useDrawer();

// 表格数据请求
const loadUserList = async (data: Query.GetParams) => {
  data.filters = { ...(data.filters || {}), ...getFieldsValue() };
  return UserManagerApi.userList(data);
};

// 表单提交
const handleSubmit = (data: any) => {
  console.log(getFieldsValue());
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
  UserManagerApi.batchDeleteUser(checkedRows.value).then(() => {
    checkedRows.value = [];
    tableRef.value.reload();
  });
};

const handleCheck = (keys: Array<string | number>) => {
  checkedRows.value = keys;
};
</script>
