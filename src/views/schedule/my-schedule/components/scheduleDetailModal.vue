<template>
  <BasicModal
    v-bind="attrs"
    @register="register"
    :title="getTitle"
    :cardHeight="600"
    :cardWidth="1000"
    :showCancelButton="false"
    @ok="handleOk"
  >
    <BasicDescription
      :data="descriptionData"
      :schemas="descriptionSchemas"
      :loading="loading"
    ></BasicDescription>
  </BasicModal>
  <UserDetailModal @register="registerUserDetailModal" :roleType="'patient'"></UserDetailModal>
</template>

<script setup lang="ts">
import { DoctorScheduleApi } from '@/api';
import { BasicDescription, BasicModal, useModal, useModalInner } from '@/components';
import { useScheduleSchema } from '../schema';

defineOptions({ name: 'ScheduleDetailModal' });

const attrs = useAttrs();

const descriptionData = ref<Recordable>({}); // 实体ID
const loading = ref<boolean>(true);

const getTitle = computed(() => {
  return '排班详情';
});

const methods = {
  handlePatientDetail: async (patient: Hospital.Patient) => {
    openUserDetailModal(patient);
  },
};

const { descriptionSchemas } = useScheduleSchema(methods);

const [register, { closeModal }] = useModalInner(async (data) => {
  loading.value = true;
  const res = await DoctorScheduleApi.detail(data.id);
  descriptionData.value = res;
  loading.value = false;
});

const [registerUserDetailModal, { openModal: openUserDetailModal }] = useModal();

const handleOk = () => {
  closeModal();
};
</script>
