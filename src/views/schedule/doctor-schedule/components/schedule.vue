<template>
  <div class="m-10px flex-x-center">
    <n-h4 class="m-0" prefix="bar">科室：</n-h4>
    <n-radio-group
      v-model:value="currentDepartment"
      name="department"
      @update-value="handleChecked"
    >
      <n-radio-button
        v-for="department in departmentList"
        :key="department.id"
        :value="department.id"
      >
        {{ department.name }}
      </n-radio-button>
    </n-radio-group>
  </div>

  <n-grid x-gap="12" :cols="4">
    <n-grid-item :span="3">
      <n-calendar
        v-model:value="checkedDate"
        :default-value="today"
        :onPanelChange="onPanelChange"
        @update:value="handleUpdateValue"
        style="height: auto; min-height: 500px"
      >
        <template #header="{ year, month }">
          {{ year }}年{{ month }}月 -
          {{ nowDepartment }}
        </template>
        <template #default="{ year, month, date }">
          <n-scrollbar style="max-height: 140px">
            <n-flex align="center" class="my-5px">
              <div
                class="w-45%"
                v-for="(schedule, index) in scheduleList[`${year}-${month}-${date}`]"
                :key="index"
              >
                <n-tag type="info" size="small" class="w-full flex justify-center">
                  {{ schedule.doctor.user.name }}
                </n-tag>
              </div>
            </n-flex>
          </n-scrollbar>
        </template>
      </n-calendar>
    </n-grid-item>
    <n-grid-item :span="1">
      <n-card>
        <template #header>
          <n-h2 prefix="bar" class="mb-0">
            {{ dayjs(checkedDate).format('YYYY-MM-DD dddd') }}
          </n-h2>
        </template>
        <template #header-extra>
          <n-button v-if="showEdit" size="small" type="primary" @click="handleAdd">
            添加排班
          </n-button>
        </template>

        <n-space vertical size="large">
          <div>
            <div class="header">
              <n-h4 prefix="bar" type="warning" class="mb-10px">
                <n-text>上午</n-text>
              </n-h4>
            </div>
            <template v-if="dayScheduleDetail['MORNING'].length">
              <n-flex vertical>
                <div
                  class="cursor-hover"
                  v-for="(schedule, index) in dayScheduleDetail['MORNING']"
                  :key="index"
                  @click="handleDoctorDetail(schedule.doctor)"
                >
                  {{ schedule.doctor.user.name }}
                </div>
              </n-flex>
            </template>
            <template v-else> - </template>
          </div>
          <div>
            <div class="header">
              <n-h4 prefix="bar" type="info" class="mb-10px">
                <n-text type="info">下午</n-text>
              </n-h4>
            </div>
            <template v-if="dayScheduleDetail['AFTERNOON'].length">
              <n-flex vertical>
                <div
                  class="cursor-hover"
                  v-for="(schedule, index) in dayScheduleDetail['AFTERNOON']"
                  :key="index"
                  @click="handleDoctorDetail(schedule.doctor)"
                >
                  {{ schedule.doctor.user.name }}
                </div>
              </n-flex>
            </template>
            <template v-else> - </template>
          </div>
        </n-space>
      </n-card>
    </n-grid-item>
  </n-grid>

  <UserDetailModal
    @register="registerModal"
    :description-schemas="descriptionSchemas"
  ></UserDetailModal>
  <DateToDoctorModal
    :description-schemas="descriptionSchemas"
    @register="registerEditModal"
    @success="handleSuccess"
  ></DateToDoctorModal>
</template>

<script lang="tsx" setup>
import { DoctorScheduleApi } from '@/api';
import { UserDetailModal, useModal } from '@/components';
import { useCommonStore } from '@/store';
import '@vuepic/vue-datepicker/dist/main.css';
import dayjs from 'dayjs';
import { DateToDoctorModal } from './index';
import { useDoctorSchema } from './schema';

defineOptions({ name: 'ScheduleCalendar' });

const props = defineProps({
  formParams: {
    type: Object,
    default: () => ({}),
  },
});

const formParams: any = computed(() => {
  return { ...props.formParams };
});

const commonStore = useCommonStore();

const [registerModal, { openModal }] = useModal();
const [registerEditModal, { openModal: openEditModal }] = useModal();

const { descriptionSchemas } = useDoctorSchema();

// 当前科室
const currentDepartment = ref<number>(0);
// 今天时间戳
const today = ref<number>(dayjs().valueOf());
// 选中的日期
const checkedDate = ref<Undefinedable<number>>(today.value);

// 默认参数
const defaultParams = {
  date: [dayjs().startOf('month').toISOString(), dayjs().endOf('month').toISOString()],
};

const params = ref<any>({ ...defaultParams });

// 科室
const departmentList = ref<Recordable[]>([]);
// 排班
const scheduleList = ref<Recordable>({});
// 当前科室当前天的排班详情
const dayScheduleDetail = ref<Recordable>({
  AFTERNOON: [],
  MORNING: [],
});

const showEdit = computed(() => {
  return dayjs(checkedDate.value).isSameOrAfter(dayjs().startOf('day')); // 默认毫秒
});

onMounted(async () => {
  await loadDepartmentList();
  nextTick(() => {
    if (currentDepartment.value) {
      loadScheduleList();
    }
  });
  // 默认选中今日
  filterTimePeriod(scheduleList.value[dayjs(today.value).format('YYYY-MM-DD')]);
});

const handleAdd = () => {
  const record = {
    date: dayjs(checkedDate.value).format('YYYY-MM-DD'),
    department: currentDepartment.value,
    dayScheduleDetail: dayScheduleDetail.value,
  };
  openEditModal({ record });
};

// 加载科室列表
const loadDepartmentList = async () => {
  await commonStore.fetchDepartmentList();
  departmentList.value = commonStore.getDepartment;
  currentDepartment.value = departmentList.value[0].id;
  params.value['doctor.departmentId'] = currentDepartment.value;
};

const filterTimePeriod = (schedules: Schedule.DoctorSchedule[]) => {
  dayScheduleDetail.value.AFTERNOON = [];
  dayScheduleDetail.value.MORNING = [];
  // 确保 schedules 存在且为数组
  if (!Array.isArray(schedules)) {
    console.error('当天无排班');
    return;
  }
  // 提取过滤逻辑
  const filterByTimePeriod = (timePeriods: string[]) => {
    return schedules.filter((schedule: Schedule.DoctorSchedule) => {
      return timePeriods.includes(schedule.timePeriod);
    });
  };

  // 使用提取的过滤逻辑
  dayScheduleDetail.value.AFTERNOON = filterByTimePeriod(['AFTERNOON', 'DAY']);
  dayScheduleDetail.value.MORNING = filterByTimePeriod(['MORNING', 'DAY']);
};

// 当前所选的科室
const nowDepartment = computed(() => {
  return departmentList.value.find((item: any) => item.id === currentDepartment.value)?.name || '';
});

// 加载排班列表 updateTimePeriod 默认为 true,是否更新右侧的排班详情
const loadScheduleList = async (updateTimePeriod: boolean = true) => {
  scheduleList.value = [];
  const queryParams = {
    filters: {
      ...params.value,
      ...formParams.value,
    },
    options: {
      showPagination: false,
      groupBy: true,
    },
  };
  const res = await DoctorScheduleApi.list(queryParams);

  const { data } = res;

  data.forEach((item: any) => {
    const year = dayjs(item.date).year();
    const month = dayjs(item.date).month() + 1;
    const day = dayjs(item.date).date();
    scheduleList.value[`${year}-${month}-${day}`] = item.schedules.map((schedule: any) => schedule);
  });
  if (updateTimePeriod) {
    filterTimePeriod(scheduleList.value[dayjs(checkedDate.value).format('YYYY-MM-DD')]);
  }
};

// 切换科室
const handleChecked = (value: number) => {
  params.value['doctor.departmentId'] = value;
  loadScheduleList();
};

const handleUpdateValue = (_: number, info: { year: number; month: number; date: number }) => {
  filterTimePeriod(scheduleList.value[`${info.year}-${info.month}-${info.date}`]);
};

// 切换月份
const onPanelChange = (info: { year: number; month: number }) => {
  params.value.date = [
    dayjs(`${info.year}-${info.month}-01`).startOf('month').toISOString(),
    dayjs(`${info.year}-${info.month}-01`).endOf('month').toISOString(),
  ];
  loadScheduleList(false);
};

const handleDoctorDetail = (doctor: any) => {
  openModal(doctor);
};

const handleSuccess = async () => {
  await loadScheduleList();
};

const refresh = async () => {
  await loadScheduleList();
};

defineExpose({
  refresh,
});
</script>
