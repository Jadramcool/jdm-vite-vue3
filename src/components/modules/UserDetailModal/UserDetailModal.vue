<template>
  <BasicModal
    v-bind="attrs"
    @register="register"
    :title="getTitle"
    :showCancelButton="false"
    @ok="handleOk"
  >
    <BasicDescription
      :data="entityData"
      :schemas="nowSchemas"
      :loading="loading"
    ></BasicDescription>
  </BasicModal>
</template>

<script setup lang="ts">
import { DoctorApi } from '@/api';
import { BasicDescription, BasicModal, useModalInner } from '@/components';
import { useDoctorSchema } from './schema';

defineOptions({ name: 'userDetailModal' });

const props = defineProps({
  schemas: {
    type: Array,
    default: null,
  },
  // 角色类型
  roleType: {
    type: String,
    default: 'Doctor',
  },
  dataSource: {
    type: Object,
    default: () => {},
  },
});

const nowSchemas = computed(() => {
  // 优先使用自定义的schema
  if (!props.schemas) {
    if (props.roleType === 'Doctor') {
      return descriptionSchemas.value;
    }
  }
  return props.schemas;
});

const { descriptionSchemas } = useDoctorSchema();

const attrs = useAttrs();

const entityId = ref<number>(0); // 实体ID
const entityData = ref<any>(null);
const loading = ref<boolean>(false);

const getTitle = computed(() => {
  return '医生详情';
});

const [register, { closeModal }] = useModalInner(async (data) => {
  // entityData.value = data;
  entityId.value = data?.id;
  if (props.roleType === 'Doctor') {
    loading.value = true;
    await getDoctorDetail(entityId.value);
    loading.value = false;
  }
});

const getDoctorDetail = async (id: number) => {
  const res = await DoctorApi.detail(id);
  entityData.value = res;
};

const handleOk = () => {
  closeModal();
};
</script>
