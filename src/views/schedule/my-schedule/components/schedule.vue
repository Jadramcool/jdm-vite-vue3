<template>
  <n-calendar :default-value="today" :onPanelChange="onPanelChange">
    <template #header="{ year, month }">
      {{ year }}年{{ month }}月 - {{ userStore.getUser.name }}</template
    >
    <template #default="{ year, month, date }">
      <template v-if="scheduleObj[`${year}-${month}-${date}`]">
        <n-tag
          v-for="(schedule, index) in scheduleObj[`${year}-${month}-${date}`]"
          :key="index"
          :type="timePeriodTypeOptions[schedule['timePeriod']]"
          size="small"
          class="w-full flex justify-center mt-10px"
        >
          {{ timePeriodOptions.find((item2: any) => item2.value === schedule['timePeriod'])?.label }}
        </n-tag>
      </template>
    </template>
  </n-calendar>
</template>

<script lang="tsx" setup>
import { MyScheduleApi } from '@/api';
import { timePeriodOptions, timePeriodTypeOptions } from '@/constants';
import { useUserStore } from '@/store';
import '@vuepic/vue-datepicker/dist/main.css';
import dayjs from 'dayjs';

defineOptions({ name: 'MyScheduleCalendar' });

const props = defineProps({
  formParams: {
    type: Object,
    default: () => ({}),
  },
});

const formParams: any = computed(() => {
  return { ...props.formParams };
});

const userStore = useUserStore();
// 今天时间戳
const today = ref<number>(dayjs().valueOf());

// 默认参数
const defaultParams = {
  date: [dayjs().startOf('month').toISOString(), dayjs().endOf('month').toISOString()],
};

const params = ref<any>({ ...defaultParams });

// 排班
const scheduleObj = ref<Recordable>({});

onMounted(async () => {
  loadScheduleList();
});

// 加载排班列表 updateTimePeriod 默认为 true,是否更新右侧的排班详情
const loadScheduleList = async () => {
  scheduleObj.value = {};
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
  const res = await MyScheduleApi.list(queryParams);

  const { data } = res;
  data.forEach((item: any) => {
    const year = dayjs(item.date).year();
    const month = dayjs(item.date).month() + 1;
    const day = dayjs(item.date).date();
    scheduleObj.value[`${year}-${month}-${day}`] = item.schedule;
  });
};

// 切换月份
const onPanelChange = (info: { year: number; month: number }) => {
  params.value.date = [
    dayjs(`${info.year}-${info.month}-01`).startOf('month').toISOString(),
    dayjs(`${info.year}-${info.month}-01`).endOf('month').toISOString(),
  ];
  loadScheduleList();
};

const refresh = async () => {
  await loadScheduleList();
};

defineExpose({
  refresh,
});
</script>
