<template>
  <div>
    <BasicForm @register="register" @submit="handleSubmit" ref="formRef"> </BasicForm>

    <n-divider dashed />

    <!-- 总开关控制区域 -->
    <div style="margin-bottom: 16px; display: flex; align-items: center; gap: 12px">
      <n-button
        :type="globalEncryptionState ? 'warning' : 'primary'"
        @click="toggleGlobalEncryption"
        size="medium"
      >
        {{ globalEncryptionState ? '全部显示明文' : '全部显示加密' }}
      </n-button>
      <n-text depth="3" style="font-size: 14px">
        当前状态: {{ globalEncryptionState ? '加密模式' : '明文模式' }}
      </n-text>
    </div>

    <BasicTable
      ref="tableRef"
      title="kb"
      :columns="columns"
      :filters="queryParams"
      :request="loadNoticeList"
      :rowKey="(row: NaiveUI.RowData) => row.id"
      @update:checked-row-keys="handleCheck"
      @add="handleAdd"
    />
  </div>
</template>

<script lang="tsx" setup>
import { U3C3Api } from '@/api';
import { BasicForm, BasicTable, useForm } from '@/components';
import { NButton, NText } from 'naive-ui';
import { $t } from '@/locales';
import { useResourceSchema } from './schema';

defineOptions({ name: 'Notice' });
onMounted(() => {
  // 获取表格数据
});

const tableRef = ref<any>(null);
const formRef = ref<any>(null);

// 请求参数
const queryParams = ref<Query.GetParams>({});

// 控制每行是否显示加密内容的状态映射
const rowEncryptionState = ref<Record<string | number, boolean>>({});

// 全局加密状态控制（true: 加密模式, false: 明文模式）
const globalEncryptionState = ref<boolean>(true);

// 表格/表单方法
const schemaMethods = {
  handleDelete(record: NaiveUI.RowData) {
    U3C3Api.deleteData(record.id).then(() => {
      window.$message?.success($t('common.delete') + $t('common.success'));
      tableRef.value.reload();
    });
  },

  // 切换单行的加密/解密显示模式
  toggleRowEncryption(record: NaiveUI.RowData) {
    const rowId = record.id;
    const currentState = rowEncryptionState.value[rowId] ?? globalEncryptionState.value;
    rowEncryptionState.value[rowId] = !currentState;
  },

  // 获取指定行的显示模式
  getRowEncryptionState(rowId: string | number) {
    return rowEncryptionState.value[rowId] ?? globalEncryptionState.value;
  },

  // 获取全局加密状态
  getGlobalEncryptionState() {
    return globalEncryptionState.value;
  },
};

const handleAdd = () => {};

// 切换全局加密/解密状态
const toggleGlobalEncryption = () => {
  globalEncryptionState.value = !globalEncryptionState.value;
  // 清空所有单独设置的行状态，让它们使用全局状态
  rowEncryptionState.value = {};
};

const { columns, formSchemas } = useResourceSchema(
  schemaMethods,
  rowEncryptionState,
  globalEncryptionState,
);

const [register, { getFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  schemas: formSchemas,
  submitOnReset: true,
});

// 表格数据请求
const loadNoticeList = async (data: Query.GetParams) => {
  data.filters = { ...(data.filters || {}), ...getFieldsValue() };
  const res = await U3C3Api.list(data);
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
