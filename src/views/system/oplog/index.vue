<template>
  <div>
    <BasicForm @register="register" @submit="handleSubmit" ref="formRef"> </BasicForm>

    <n-divider dashed />

    <BasicTable
      ref="tableRef"
      :title="$t('modules.system.opLog.table.title')"
      :columns="columns"
      :filters="queryParams"
      :request="loadOpLogList"
      :rowKey="(row: NaiveUI.RowData) => row.id"
      :pagination="{ pageSize: 10 }"
      scroll-x="2000"
      :showAddBtn="false"
    >
    </BasicTable>

    <!-- 请求参数弹窗 -->
    <ParamsModal v-model:visible="paramsModalVisible" :params="currentParams" />

    <!-- 响应结果弹窗 -->
    <ResultModal v-model:visible="resultModalVisible" :result="currentResult" />

    <!-- 错误信息弹窗 -->
    <ErrorModal v-model:visible="errorModalVisible" :error-message="currentError" />
  </div>
</template>

<script lang="tsx" setup>
import { OpLogApi } from '@/api/system';
import { BasicForm, BasicTable, useForm } from '@/components';
import { $t } from '@/locales/i18n';
import ErrorModal from './components/ErrorModal.vue';
import ParamsModal from './components/ParamsModal.vue';
import ResultModal from './components/ResultModal.vue';
import { useOpLogSchema } from './schema';

defineOptions({ name: 'UserManager' });

// 表格/表单配置  采用computed（适配i18n）
const tableRef = ref<any>(null);
const formRef = ref<any>(null);

// 请求参数
const queryParams = ref<Query.GetParams>({});

// 加载状态管理
const loadingStates = ref<Record<string, { system: boolean; public: boolean }>>({});

// 弹窗状态管理
const paramsModalVisible = ref(false);
const resultModalVisible = ref(false);
const errorModalVisible = ref(false);
const currentParams = ref('');
const currentResult = ref('');
const currentError = ref('');

// 表格/表单方法
const schemaMethods = {
  handleDelete(record: NaiveUI.RowData) {
    OpLogApi.deleteOpLog(record.id)
      .then(() => {
        window.$message.success('删除成功');
        tableRef.value.reload();
      })
      .catch((error: any) => {
        window.$message.error(error);
      });
  },
  /**
   * 显示请求参数弹窗
   */
  showParamsModal(params: string) {
    currentParams.value = params;
    paramsModalVisible.value = true;
  },
  /**
   * 显示响应结果弹窗
   */
  showResultModal(result: string) {
    currentResult.value = result;
    resultModalVisible.value = true;
  },
  /**
   * 显示错误信息弹窗
   */
  showErrorModal(errorMessage: string) {
    currentError.value = errorMessage;
    errorModalVisible.value = true;
  },
};

// 表格/表单配置  采用computed（适配i18n）
const { columns, formSchemas } = useOpLogSchema({ ...schemaMethods, loadingStates });

const [register, { getFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  schemas: formSchemas,
  submitOnReset: true,
  tableRef,
});

// 表格数据请求
const loadOpLogList = async (data: Query.GetParams) => {
  data.filters = { ...(data.filters || {}), ...getFieldsValue() };
  return OpLogApi.getOpLogList(data);
};

// 表单提交
const handleSubmit = (data: any) => {
  data && tableRef.value.reload();
};
</script>
