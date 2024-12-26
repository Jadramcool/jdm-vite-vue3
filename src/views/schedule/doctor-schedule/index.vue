<template>
  <div>
    <BasicForm @register="register" @submit="handleSubmit" ref="formRef"> </BasicForm>

    <n-tabs
      v-model:value="tabValue"
      @update:value="handleChangeTab"
      animated
      justify-content="space-evenly"
      type="card"
    >
      <n-tab-pane name="schedule" display-directive="if" tab="日历视图">
        <Schedule ref="schedule" :formParams="queryParams"></Schedule>
      </n-tab-pane>
      <n-tab-pane name="list" display-directive="if" tab="列表视图">
        <ScheduleList ref="list" :queryParams="queryParams"></ScheduleList>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
<script setup lang="tsx">
import { BasicForm, useForm } from '@/components';
import { useTemplateRef } from 'vue';
import { Schedule, ScheduleList } from './components';
import { useDoctorScheduleSchema } from './schema';

defineOptions({ name: 'Schedule' });

const formRef = ref(null);
const listRef = useTemplateRef<any>('list');
const scheduleRef = useTemplateRef<any>('schedule');
const tabValue = ref('schedule');

const { formSchemas } = useDoctorScheduleSchema();
const [register, { getFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  schemas: formSchemas,
  submitOnReset: true,
});

const queryParams = computed(() => {
  return getFieldsValue();
});
// 表单提交
const handleSubmit = (data: any) => {
  if (tabValue.value === 'schedule') {
    scheduleRef.value.refresh(data);
  } else {
    listRef.value.refresh();
  }
};

const handleChangeTab = (value: string) => {
  if (value === 'schedule') {
    scheduleRef.value.refresh();
  } else {
    listRef.value.refresh();
  }
};
</script>
