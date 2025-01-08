<template>
  <div>
    <BasicForm @register="register" @submit="handleSubmit" ref="formRef"> </BasicForm>

    <n-divider dashed />

    <BasicTable
      ref="tableRef"
      :title="$t('modules.notice.notice.table.title')"
      :columns="columns"
      :filters="queryParams"
      :request="loadNoticeList"
      :rowKey="(row: NaiveUI.RowData) => row.id"
      scroll-x="1400"
      @update:checked-row-keys="handleCheck"
      @add="handleAdd"
    />

    <NoticeModal @register="registerModal" @success="handleSuccess"> </NoticeModal>
    <SendNoticeModal @register="registerSendModal" @success="handleSuccess"> </SendNoticeModal>
  </div>
</template>

<script lang="tsx" setup>
import { NoticeApi } from '@/api';
import { BasicForm, BasicTable, useForm, useModal } from '@/components';
import { $t } from '@/locales';
import { NoticeModal, SendNoticeModal } from './components';
import { useNoticeSchema } from './schema';

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
  handleEdit(record: NaiveUI.RowData) {
    openModal({ record, isUpdate: true });
  },
  handleDelete(record: NaiveUI.RowData) {
    NoticeApi.deleteNotice(record.id).then(() => {
      window.$message?.success($t('common.delete') + $t('common.success'));
      tableRef.value.reload();
    });
  },
  handleSend(record: NaiveUI.RowData) {
    openSendModal({ record });
  },
};

const handleAdd = () => {
  openModal({
    isUpdate: false,
  });
};

// 表格/表单配置  采用computed（适配i18n）
const { columns, formSchemas } = useNoticeSchema(schemaMethods);

const [register, { getFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  schemas: formSchemas,
  submitOnReset: true,
});

const [registerModal, { openModal }] = useModal();

const [registerSendModal, { openModal: openSendModal }] = useModal();

// 表格数据请求
const loadNoticeList = async (data: Query.GetParams) => {
  data.filters = { ...(data.filters || {}), ...getFieldsValue() };
  return NoticeApi.noticeList(data);
};

const handleSuccess = () => {
  tableRef.value.reload();
};
// 表单提交
const handleSubmit = (data: any) => {
  data && tableRef.value.reload();
};

const handleCheck = (keys: Array<string | number>, rows: object[]) => {
  console.log(keys, rows);
};
</script>
