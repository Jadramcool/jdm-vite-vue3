<template>
  <div>
    <BasicForm @register="register" @submit="handleSubmit" ref="formRef"> </BasicForm>

    <n-divider dashed />

    <BasicTable
      ref="tableRef"
      :size="'large'"
      :title="'我的病人'"
      :columns="columns"
      :filters="queryParams"
      :request="loadPatientList"
      :rowKey="(row: NaiveUI.RowData) => row.id"
      :pagination="{ pageSize: 10 }"
      :showAddBtn="false"
    >
    </BasicTable>

    <UserDetailModal @register="registerModal" :roleType="'patient'"></UserDetailModal>
  </div>
</template>

<script lang="tsx" setup>
import { AppointmentApi } from '@/api';
import { BasicForm, BasicTable, useForm, useModal } from '@/components';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { useMyPatientSchema } from './schema';

defineOptions({ name: 'MyPatient' });

const router = useRouter();
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

  handlePatientDetail(record: NaiveUI.RowData) {
    openModal(record?.patient);
  },

  handleRecord(record: NaiveUI.RowData) {
    router.push({
      path: `/doctor/my-patient/detail/${record.patient.id}`,
      query: { date: dayjs(record?.doctorSchedule?.date).format('YYYY-MM-DD') },
    });
  },
};

const { columns, formSchemas } = useMyPatientSchema(schemaMethods);

const [register, { getFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  schemas: formSchemas,
  submitOnReset: true,
});
const [registerModal, { openModal }] = useModal();

// 表格数据请求
const loadPatientList = async (data: Query.GetParams) => {
  data.filters = { ...(data.filters || {}), ...getFieldsValue() };
  const res = await AppointmentApi.doctorAppointmentList(data);
  return res;
};

// 表单提交
const handleSubmit = (data: any) => {
  console.log(getFieldsValue());
  data && tableRef.value.reload();
};
</script>
