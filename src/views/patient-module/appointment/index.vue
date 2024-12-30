<template>
  <div class="h-full">
    <n-tabs
      type="card"
      animated
      placement="left"
      v-model:value="tabValue"
      @update:value="handleChangeDepartment"
      class="h-full"
    >
      <n-tab-pane
        v-for="department in departmentList"
        :key="department.id"
        :name="department.id"
        :tab="department.name"
      >
        <DoctorCards
          :key="department.id"
          ref="doctorCardsRef"
          :departmentId="department.id"
        ></DoctorCards>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
<script setup lang="tsx">
import { useCommonStore } from '@/store';
import { DoctorCards } from './components';

defineOptions({ name: 'Appointment' });

const commonStore = useCommonStore();

const departmentList = ref<Hospital.Department[]>([]);
const tabValue = ref<number>(0);
// 加载科室列表
const loadDepartmentList = async () => {
  await commonStore.fetchDepartmentList();
  departmentList.value = commonStore.getDepartment;
  if (departmentList.value.length > 0) {
    tabValue.value = departmentList.value[0].id;
  }
};

const handleChangeDepartment = (value: number) => {
  console.log('🚀 ~ handleChangeDepartment ~ value:', value);
};

onMounted(() => {
  loadDepartmentList();
});
</script>
