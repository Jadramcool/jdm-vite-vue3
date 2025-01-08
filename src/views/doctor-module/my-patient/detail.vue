<template>
  <div>
    <BasicDescription
      :data="patientDetail"
      :schemas="descriptionSchemas"
      :column="2"
    ></BasicDescription>

    <n-divider></n-divider>

    <n-tabs v-model:value="tabValue" placement="left" type="line" class="custom-tabs">
      <n-tab-pane v-for="item in dateOptions" :key="item" :name="item.date" :tab="item.date">
        <n-flex class="w-100%" inline justify="space-between">
          <div class="w-49%" v-for="medicalRecord in item.medicalRecord" :key="medicalRecord.id">
            <n-card class="h-100%">
              <template #header>
                <n-tag
                  :type="timePeriodTypeOptions[medicalRecord.appointment.doctorSchedule.timePeriod]"
                  :bordered="false"
                  size="large"
                >
                  {{ item.date }}
                  ~
                  {{ transformTimePeriod(medicalRecord.appointment.doctorSchedule.timePeriod) }}
                </n-tag>
              </template>
              <BasicDescription
                :data="medicalRecord"
                :schemas="descriptionMedicalRecordSchemas"
                :column="2"
              ></BasicDescription>
            </n-card>
          </div>
        </n-flex>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script lang="tsx" setup>
import { PatientApi } from '@/api';
import { BasicDescription } from '@/components';
import { timePeriodOptions, timePeriodTypeOptions } from '@/constants';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { usePatientRecordSchema } from './schema';

const router = useRouter();

defineOptions({ name: 'MyPatientDetail' });

const { id } = router.currentRoute.value.params;
// 接受query
const { date } = router.currentRoute.value.query;

const patientDetail = ref<Nullable<Hospital.Patient>>(null);

const dateOptions = ref<any>([]);

const tabValue = ref<any>(date);

onMounted(() => {
  loadPatientAllMedicalRecord();
});

const { descriptionSchemas, descriptionMedicalRecordSchemas } = usePatientRecordSchema();

// 获取患者详情+病历
const loadPatientAllMedicalRecord = async () => {
  const patient = await PatientApi.detail(Number(id), {
    with_medicalRecord: true,
    // with_appointment: true,
  });
  patientDetail.value = patient;
  const options: any = {};
  if (patient?.medicalRecord) {
    patient.medicalRecord.forEach((item: any) => {
      const date = dayjs(item.appointment.appointmentDate).format('YYYY-MM-DD');
      if (!options[date]) {
        options[date] = [];
      }
      options[date].push(item);
    });

    dateOptions.value = Object.keys(options).map((date) => ({
      date,
      medicalRecord: options[date],
    }));
    if (!tabValue.value) {
      tabValue.value = dateOptions.value[0].date;
    }
  }
};

const transformTimePeriod = (timePeriod: string) => {
  const timePeriodCN = unref(timePeriodOptions).find(
    (item: any) => item.value === timePeriod,
  )?.label;
  return timePeriodCN;
};
</script>
