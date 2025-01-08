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
import { DoctorApi, PatientApi } from '@/api';
import { BasicDescription, BasicModal, useModalInner } from '@/components';
import { useDoctorSchema, usePatientSchema } from './schema';

defineOptions({ name: 'userDetailModal' });

const props = defineProps({
  schemas: {
    type: Array,
    default: null,
  },
  // 角色类型
  roleType: {
    type: String,
    default: 'doctor',
  },
  dataSource: {
    type: Object,
    default: () => {},
  },
});

const nowSchemas = ref<any>([]);

const attrs = useAttrs();

const entityId = ref<number>(0); // 实体ID
const entityData = ref<any>(null);
const loading = ref<boolean>(false);

const getTitle = computed(() => {
  if (props.roleType === 'doctor') {
    return '医生详情';
  }
  if (props.roleType === 'patient') {
    return '患者详情';
  }
  return '详情';
});

const [register, { closeModal }] = useModalInner(async (data) => {
  loading.value = true;
  entityId.value = data?.id;

  if (!props.schemas) {
    if (props.roleType === 'doctor') {
      const { descriptionSchemas } = useDoctorSchema();
      nowSchemas.value = unref(descriptionSchemas);
    } else if (props.roleType === 'patient') {
      const { descriptionSchemas } = usePatientSchema();
      nowSchemas.value = unref(descriptionSchemas);
    }
  } else {
    nowSchemas.value = props.schemas;
  }

  if (props.roleType === 'doctor') {
    await getDoctorDetail(entityId.value);
  } else if (props.roleType === 'patient') {
    await getPatientDetail(entityId.value);
  }

  loading.value = false;
});

const getDoctorDetail = async (id: number) => {
  const res = await DoctorApi.detail(id);
  entityData.value = res;
};

const getPatientDetail = async (id: number) => {
  const res = await PatientApi.detail(id);
  entityData.value = res;
};

const handleOk = () => {
  closeModal();
};
</script>
