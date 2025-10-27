<template>
  <div>
    <BasicForm @register="register" @submit="handleSubmit" ref="formRef"> </BasicForm>

    <n-divider dashed />

    <BasicTable
      ref="tableRef"
      :title="$t('modules.blog.config.table.title')"
      :columns="columns"
      :filters="queryParams"
      :request="loadConfigList"
      :rowKey="(row: NaiveUI.RowData) => row.id"
      :pagination="{ pageSize: 10 }"
      scroll-x="1800"
      :showAddBtn="true"
      @add="handleAdd"
    >
    </BasicTable>
    <ConfigModal @register="registerModal" @success="handleSuccess"> </ConfigModal>
  </div>
</template>

<script lang="tsx" setup>
import { BlogApi } from '@/api';
import { BasicForm, BasicTable, useForm, useModal } from '@/components';
import { $t } from '@/locales/i18n';
import { ConfigModal } from './components';
import { useConfigSchema } from './schema';

defineOptions({ name: 'UserManager' });

// 表格/表单配置  采用computed（适配i18n）
const tableRef = ref<any>(null);
const formRef = ref<any>(null);

// 请求参数
const queryParams = ref<Query.GetParams>({});

// 加载状态管理
const loadingStates = ref<Record<string, { system: boolean; public: boolean }>>({});

// 表格/表单方法
const schemaMethods = {
  handleEdit(record: NaiveUI.RowData) {
    openModal({ record, isUpdate: true });
  },
  handleDelete(record: NaiveUI.RowData) {
    BlogApi.deleteConfig(record.id)
      .then(() => {
        window.$message.success('删除成功');
        tableRef.value.reload();
      })
      .catch((error: any) => {
        window.$message.error(error);
      });
  },
  handleEnable(record: NaiveUI.RowData) {
    console.log('🚀 ~ record:', record);
  },
};

const handleAdd = () => {
  openModal({
    isUpdate: false,
  });
};
const [registerModal, { openModal }] = useModal();

// 表格/表单配置  采用computed（适配i18n）
const { columns, formSchemas } = useConfigSchema({ ...schemaMethods, loadingStates });

const [register, { getFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  schemas: formSchemas,
  submitOnReset: true,
  tableRef,
});

// 表格数据请求
const loadConfigList = async (data: Query.GetParams) => {
  data.filters = { ...(data.filters || {}), ...getFieldsValue() };
  return BlogApi.getConfigList(data);
};

// 表格数据刷新
const handleSuccess = () => {
  tableRef.value.reload();
};

// 表单提交
const handleSubmit = (data: any) => {
  data && tableRef.value.reload();
};
</script>
