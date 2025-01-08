<template>
  <div>
    <BasicForm @register="register" @submit="handleSubmit" ref="formRef"> </BasicForm>

    <n-divider dashed />

    <BasicTable
      ref="tableRef"
      :size="'large'"
      :title="'我的挂号'"
      :columns="columns"
      :filters="queryParams"
      :request="loadAppointmentList"
      :rowKey="(row: NaiveUI.RowData) => row.id"
      :pagination="{ pageSize: 10 }"
      :showAddBtn="false"
    >
    </BasicTable>

    <n-flex class="mt-30px" align="center" justify="center">
      <n-button type="primary" @click="router.back()">返回</n-button>
    </n-flex>

    <UserDetailModal @register="registerModal"></UserDetailModal>
  </div>
</template>

<script lang="tsx" setup>
import { AppointmentApi } from '@/api';
import { BasicForm, BasicTable, useForm, useModal } from '@/components';
import { useUserStore } from '@/store';
import { useRouter } from 'vue-router';
import { useAppointmentSchema } from './schema';

defineOptions({ name: 'MyAppointment' });

const router = useRouter();
const userStore = useUserStore();

const patientId = computed(() => userStore.userInfo?.patient?.id);

const tableRef = ref<any>(null);
const formRef = ref<any>(null);

// 请求参数
const queryParams = ref<Query.GetParams>({});

// 表格/表单方法
const schemaMethods = {
  handleCancel: async (record: NaiveUI.RowData) => {
    await AppointmentApi.cancel(record.id);
    tableRef.value.reload();
  },

  handleDetail(record: NaiveUI.RowData) {
    openModal(record?.doctorSchedule?.doctor);
  },
};

const { columns, formSchemas } = useAppointmentSchema(schemaMethods);

const [register, { getFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  schemas: formSchemas,
  submitOnReset: true,
});
const [registerModal, { openModal }] = useModal();

// 表格数据请求
const loadAppointmentList = async (data: Query.GetParams) => {
  data.filters = { ...(data.filters || {}), ...getFieldsValue(), patientId: patientId.value };
  return AppointmentApi.list(data);
};

// 表单提交
const handleSubmit = (data: any) => {
  console.log(getFieldsValue());
  data && tableRef.value.reload();
};
</script>
