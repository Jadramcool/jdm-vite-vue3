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
    />
  </div>
</template>

<script lang="tsx" setup>
import { MyScheduleApi } from '@/api';
import { BasicTable } from '@/components';
import { useScheduleSchema } from '../schema';

defineOptions({ name: 'ScheduleList' });

const props = defineProps({
  queryParams: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['detail']);

const tableRef = ref<any>(null);

const schemaMethods = {
  handleDetail(record: NaiveUI.RowData) {
    emit('detail', record);
  },
};

const { columns } = useScheduleSchema(schemaMethods);

// 表格数据请求
const loadScheduleList = async (data: Query.GetParams) => {
  data.filters = { ...(data.filters || {}), ...props.queryParams };
  return MyScheduleApi.list(data);
};

// 表单提交
const refresh = () => {
  tableRef.value.reload();
};

defineExpose({ refresh });
</script>
