<template>
  <BasicModal v-bind="attrs" @register="register" @ok="handleOk" :title="getTitle">
    <div class="flex-1 flex-col h-100%">
      <n-grid :cols="2" x-gap="16" class="flex-1">
        <n-gi
          class="h-100%"
          :span="1"
          v-for="(tag, index) in ['MORNING', 'AFTERNOON']"
          :key="index"
        >
          <n-card class="h-100%" size="small">
            <template #header>
              <n-h4 prefix="bar" :type="tag === 'MORNING' ? 'warning' : 'info'" class="mb-10px">
                <n-text>
                  {{ timePeriodOptions.find((item2: any) => item2.value === tag)?.label }}
                </n-text>
              </n-h4>
            </template>
            <n-scrollbar style="max-height: 100%">
              <n-flex :wrap="true">
                <div
                  class="cursor-hover w-45% flex-x-center justify-between"
                  v-for="schedule in scheduleDetail[tag]"
                  :key="schedule.doctorId"
                >
                  <n-text>
                    {{ schedule.name }}
                  </n-text>
                  <CommonWrapper @click="handleDeleteSchedule(tag, schedule)">
                    <JayIcon :icon="'basil:cross-solid'" hover></JayIcon>
                  </CommonWrapper>
                </div>
              </n-flex>
            </n-scrollbar>
            <template #footer>
              <n-select
                multiple
                :loading="selectLoading"
                :options="doctorOptionsComputed[tag]"
                :value="selectedDoctors[tag]"
                filterable
                :on-update:value="(value, option) => handleSelectDoctor(value, option, tag)"
              />
              <!-- :render-label="renderLabel"
              :render-tag="renderMultipleSelectTag" -->
              <CommonWrapper class="w-100% mt-10px" @click="handleAddSchedule(tag)">
                <JayIcon :icon="'material-symbols:add-2'" hover :type="'primary'" />
              </CommonWrapper>
            </template>
          </n-card>
        </n-gi>
      </n-grid>
    </div>
    <!-- <MutiDatePicker></MutiDatePicker> -->
  </BasicModal>
</template>

<script setup lang="tsx">
import { DoctorApi, DoctorScheduleApi } from '@/api';
import { BasicModal, useModalInner } from '@/components';
import { timePeriodOptions } from '@/constants';
import { useCommonStore } from '@/store';
import dayjs from 'dayjs';
import { differenceBy } from 'lodash';

const commonStore = useCommonStore();

defineOptions({ name: 'ScheduleModal' });

const emit = defineEmits(['register', 'success']);

const attrs = useAttrs();

const entityData = ref<any>({});
// 排班详情-上下午
const scheduleDetail = ref<any>({
  MORNING: [],
  AFTERNOON: [],
});
// 医生选项
const doctorOptions = ref<any>([]);
// 医生选择框加载中
const selectLoading = ref<boolean>(false);

const selectedDoctors = ref<any>({
  MORNING: [],
  AFTERNOON: [],
});

const selectedDoctorsOption = ref<any>({
  MORNING: [],
  AFTERNOON: [],
});

const getTitle = computed(() => {
  return `编辑排班 - ${departmentName.value}`;
});

const doctorOptionsComputed = ref<any>({
  MORNING: [],
  AFTERNOON: [],
});

const updateDoctorOptions = (tag: string) => {
  // 已经在排班中的医生id
  const hasSelectedDoctorIds =
    (scheduleDetail.value[tag] &&
      scheduleDetail.value[tag].map((item: Recordable) => item.doctorId)) ||
    [];
  const res = doctorOptions.value.map((doctor: any) => {
    if (hasSelectedDoctorIds.includes(doctor.value)) {
      return {
        ...doctor,
        disabled: true,
      };
    }
    return doctor;
  });
  doctorOptionsComputed.value[tag] = res;
};

// 加载科室医生
const loadDepartmentDoctor = async () => {
  const data = {
    filters: { departmentId: entityData.value.department },
  };
  const res = await DoctorApi.listAll(data);
  doctorOptions.value = res.data.map((doctor: Hospital.Doctor) => {
    return {
      label: doctor?.user?.name,
      value: doctor.id,
    };
  });
};

// 讲医生添加到排班详情
const handleAddSchedule = (tag: string) => {
  scheduleDetail.value[tag] = [...scheduleDetail.value[tag], ...selectedDoctorsOption.value[tag]];
  selectedDoctors.value[tag] = [];
  selectedDoctorsOption.value[tag] = [];
  updateDoctorOptions(tag);
};

// 将医生从排班详情中删除
const handleDeleteSchedule = async (tag: string, schedule: Schedule.DoctorSchedule) => {
  scheduleDetail.value[tag] = differenceBy(scheduleDetail.value[tag], [schedule], 'doctorId');
  updateDoctorOptions(tag);
};

// 选择医生的时候更新显示的标签
const handleSelectDoctor = (value: any, option: any[], tag: string) => {
  selectedDoctors.value[tag] = value;
  selectedDoctorsOption.value[tag] = option.map((item: any) => {
    return { name: item.label, doctorId: item.value };
  });
};

// 科室名称转换
const departmentName = computed(() => {
  const departments = commonStore.getDepartment;
  return departments.find((item: any) => item.id === entityData.value.department)?.name;
});

const [register, { closeModal, setModalProps }] = useModalInner(async (data) => {
  doctorOptions.value = [];
  entityData.value = data?.record;

  scheduleDetail.value.MORNING =
    data?.record?.dayScheduleDetail.MORNING.map((schedule: Schedule.DoctorSchedule) => {
      return {
        name: schedule?.doctor?.user?.name,
        doctorId: schedule.doctor.id,
      };
    }) || [];
  scheduleDetail.value.AFTERNOON =
    data?.record?.dayScheduleDetail.AFTERNOON.map((schedule: Schedule.DoctorSchedule) => {
      return {
        name: schedule?.doctor?.user?.name,
        doctorId: schedule.doctor.id,
      };
    }) || [];

  if (doctorOptions.value.length === 0) {
    selectLoading.value = true;
    await loadDepartmentDoctor();
    selectLoading.value = false;
  }

  nextTick(() => {
    updateDoctorOptions('MORNING');
    updateDoctorOptions('AFTERNOON');
  });
});

const handleOk = async () => {
  try {
    setModalProps({ confirmLoading: true });
    console.log('scheduleDetail.value', scheduleDetail.value);
    // const dayDoctor = intersectionBy(
    //   scheduleDetail.value.MORNING,
    //   scheduleDetail.value.AFTERNOON,
    //   'doctorId',
    // );
    // const values = {
    //   DAY: dayDoctor.map((item: any) => item.doctorId),
    //   MORNING: differenceBy(scheduleDetail.value.MORNING, dayDoctor, 'doctorId').map(
    //     (item: any) => item.doctorId,
    //   ),
    //   AFTERNOON: differenceBy(scheduleDetail.value.AFTERNOON, dayDoctor, 'doctorId').map(
    //     (item: any) => item.doctorId,
    //   ),
    // };
    const values = {
      MORNING: scheduleDetail.value.MORNING.map((item: any) => item.doctorId),
      AFTERNOON: scheduleDetail.value.AFTERNOON.map((item: any) => item.doctorId),
    };
    const data: any = [];

    Object.entries(values).forEach(([key, value]) => {
      data.push({
        doctorIds: value,
        date: dayjs(entityData.value.date).toISOString(),
        timePeriod: key,
      });
    });

    await DoctorScheduleApi.updateByDate(data);

    closeModal();
    emit('success');
  } catch (error: any) {
    console.error(error);
    window.$message?.error(error);
  } finally {
    setModalProps({ confirmLoading: false });
  }
};
</script>
