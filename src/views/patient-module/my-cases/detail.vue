<template>
  <div>
    <n-h3>我的病例</n-h3>
    <BasicDescription
      :data="medicalRecordDetail"
      :schemas="descriptionSchemas"
      :column="2"
    ></BasicDescription>
    <n-flex class="mt-30px" align="center" justify="center">
      <n-button type="primary" @click="router.back()">返回</n-button>
    </n-flex>
  </div>
</template>

<script lang="tsx" setup>
import { MedicalRecordApi } from '@/api';
import { BasicDescription } from '@/components';
import { useRouter } from 'vue-router';
import { useMedicalRecordSchema } from './schema';

const router = useRouter();

defineOptions({ name: 'MyMedicalRecordDetail' });

const { id } = router.currentRoute.value.params;

const medicalRecordDetail = ref<Nullable<MedicalRecord.MedicalRecord>>(null);

onMounted(() => {
  loadMedicalRecord();
});

const { descriptionSchemas } = useMedicalRecordSchema();

// 获取患者详情+病历
const loadMedicalRecord = async () => {
  const medicalRecord = await MedicalRecordApi.detail(Number(id));

  medicalRecordDetail.value = medicalRecord;
};
</script>
