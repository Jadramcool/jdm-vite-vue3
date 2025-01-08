<template>
  <div>
    <BasicForm @register="register" @submit="handleSubmit" ref="formRef"> </BasicForm>

    <n-divider dashed />

    <BasicTable
      ref="tableRef"
      :size="'large'"
      :title="'我的病例'"
      :columns="columns"
      :filters="queryParams"
      :request="loadMedicalRecordList"
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
import { MedicalRecordApi } from '@/api';
import { BasicForm, BasicTable, useForm, useModal } from '@/components';
import { useUserStore } from '@/store';
import { useRouter } from 'vue-router';
import { useMyCasesSchema } from './schema';

defineOptions({ name: 'MyCases' });

const router = useRouter();
const userStore = useUserStore();

const patientId = computed(() => userStore.userInfo?.patient?.id);

const tableRef = ref<any>(null);
const formRef = ref<any>(null);

// 请求参数
const queryParams = ref<Query.GetParams>({});

// 表格/表单方法
const schemaMethods = {
  handleDoctorDetail: async (record: NaiveUI.RowData) => {
    openModal(record?.doctor);
  },

  handleDetail(record: NaiveUI.RowData) {
    router.push({
      path: `/patient/my-cases/detail/${record.id}`,
    });
  },
};

const { columns, formSchemas } = useMyCasesSchema(schemaMethods);

const [register, { getFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  schemas: formSchemas,
  submitOnReset: true,
});
const [registerModal, { openModal }] = useModal();

// 表格数据请求
const loadMedicalRecordList = async (data: Query.GetParams) => {
  data.filters = {
    ...(data.filters || {}),
    ...getFieldsValue(),
    patientId: patientId.value,
  };
  return MedicalRecordApi.list(data);
};

// 表单提交
const handleSubmit = (data: any) => {
  console.log(getFieldsValue());
  data && tableRef.value.reload();
};
</script>
