<template>
  <BasicModal
    v-bind="attrs"
    @register="register"
    :title="getTitle"
    :showCancelButton="false"
    @ok="handleOk"
  >
    <BasicDescription :data="entityData" :schemas="descriptionSchemas"></BasicDescription>
  </BasicModal>
</template>

<script setup lang="ts">
import { BasicDescription, BasicModal, useModalInner } from '@/components';
import { useDoctorSchema } from '../schema';

defineOptions({ name: 'noticeModal' });

const attrs = useAttrs();

const entityId = ref<number>(0); // 实体ID
const entityData = ref<any>(null);

const getTitle = computed(() => {
  return '医生详情';
});
const { descriptionSchemas } = useDoctorSchema();

const [register, { closeModal }] = useModalInner(async (data) => {
  entityData.value = data?.record;
  entityId.value = data?.record?.id;
});

const handleOk = () => {
  closeModal();
};
</script>
