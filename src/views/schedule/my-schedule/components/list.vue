<template>
  <div>
    <BasicTable
      ref="tableRef"
      :title="'我的排班'"
      :columns="columns"
      :filters="queryParams"
      :request="loadScheduleList"
      :rowKey="(row: NaiveUI.RowData) => row.id"
      :showAddBtn="false"
      :scroll-x="1000"
      @add="handleAdd"
    />

    <ScheduleModal @register="registerModal" @success="handleSuccess"> </ScheduleModal>
  </div>
</template>

<script lang="tsx" setup>
import { MyScheduleApi } from '@/api';
import { BasicTable, useModal } from '@/components';
import { useScheduleSchema } from '../schema';
import { ScheduleModal } from './index.ts';

defineOptions({ name: 'ScheduleList' });

const props = defineProps({
  queryParams: {
    type: Object,
    default: () => ({}),
  },
});

// 表格/表单配置  采用computed（适配i18n）
const tableRef = ref<any>(null);

// 表格/表单方法
const schemaMethods = {
  handleEdit(record: NaiveUI.RowData) {
    openModal({ record, isUpdate: true });
  },
  handleDelete(record: NaiveUI.RowData) {
    MyScheduleApi.deleteSchedule(record.id).then(() => {
      tableRef.value.reload();
    });
  },
};

const handleAdd = () => {
  openModal({
    isUpdate: false,
  });
};

const { columns } = useScheduleSchema(schemaMethods);

const [registerModal, { openModal }] = useModal();

// 表格数据请求
const loadScheduleList = async (data: Query.GetParams) => {
  data.filters = { ...(data.filters || {}), ...props.queryParams };
  return MyScheduleApi.list(data);
};

// 表单提交
const refresh = () => {
  tableRef.value.reload();
};

// 新增/编辑成功回调
const handleSuccess = () => {
  tableRef.value.reload();
};
defineExpose({ refresh });
</script>
