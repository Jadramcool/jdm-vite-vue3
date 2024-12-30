<template>
  <div class="px-20px">
    <n-flex align="start" :size="0" justify="start">
      <div v-for="(item, index) in calendarList" :key="index">
        <n-flex
          class="w-120px h-100px borderd rounded cursor-hover"
          vertical
          align="center"
          justify="center"
          :class="
            item.date === selectedDate
              ? 'bg-primary transform-scale-105 transition-all delay-100 text-white'
              : ''
          "
          @click="handleDateClick(item.date)"
        >
          <div>{{ item.date }}</div>
          <div>{{ item.week }}</div>
        </n-flex>
      </div>
    </n-flex>

    <n-empty class="my-20px" v-if="scheduleList.length === 0" description="当日没有排班"> </n-empty>

    <n-flex v-else class="doctor mt-20px">
      <div v-for="schedule in scheduleList" :key="schedule.id">
        <n-card class="w-300px h-400px cursor-pointer" hoverable>
          <n-flex class="h-100%" vertical justify="space-between" align="center">
            <n-flex vertical justify="center" align="center">
              <n-avatar :src="schedule?.doctor?.user?.avatar || ''" round :size="80"></n-avatar>
              <n-space class="name" align="center">
                <span class="text-lg font-bold">{{ schedule?.doctor?.user?.name }}</span>
                <span>{{ schedule?.doctor?.department?.name }}</span>
              </n-space>
            </n-flex>
            <n-flex class="flex-1" vertical>
              <n-text>简介:{{ schedule?.doctor?.introduction }}</n-text>
            </n-flex>
            <n-flex vertical justify="center" align="center">
              <div class="flex items-end">
                挂号费:<n-text depth="1" class="font-bold text-red-500 text-18px">
                  ￥{{ schedule?.doctor?.registrationFee?.toFixed(2) }}
                </n-text>
              </div>
              <div class="flex items-end">
                剩余:<n-text depth="1" class="font-bold text-blue-500 text-16px">
                  ￥{{ schedule?.maxCount - schedule?.appointCount || 0 }}
                </n-text>
              </div>
              <n-button type="primary" strong size="large" @click="handleAppoint(schedule)">
                挂号
              </n-button>
            </n-flex>
          </n-flex>
        </n-card>
      </div>
    </n-flex>
  </div>
</template>

<script lang="tsx" setup>
import { DoctorScheduleApi } from '@/api';
import dayjs from 'dayjs';

defineOptions({ name: 'DoctorCards' });

const props = defineProps({
  departmentId: {
    type: Number,
    default: 0,
  },
  date: {
    type: String,
  },
});

const calendarList = computed(() => {
  // 获取从今天开始,往后7天的日期再加上星期,分开存储比如说{date: '2024-12-22', week: '星期二'}
  return Array.from({ length: 7 }, (_, i) => {
    const date = dayjs().add(i, 'day').format('YYYY-MM-DD');
    const week = dayjs().add(i, 'day').format('dddd');
    return { date, week };
  });
});
console.log(
  '%c [ calendarList ]-42',
  'font-size:20px; background:pink; color:#bf2c9f;',
  calendarList.value,
);

const selectedDate = ref<string>(dayjs().format('YYYY-MM-DD'));

const scheduleList = ref<Schedule.DoctorSchedule[]>([]);

/**
 * 异步加载医生信息
 *
 * 本函数根据部门ID和选定日期，调用医生排班API来加载医生列表
 * 它首先构建请求参数，包括部门ID和日期的过滤条件，以及不显示分页的选项
 * 然后调用API获取数据，并将返回的医生列表数据赋值给scheduleList.value
 */
const loadDoctors = async () => {
  // 打印当前部门ID和选定日期，用于调试
  console.log(' props.departmentId', props.departmentId, selectedDate.value);

  // 构建请求参数，包括过滤条件和选项
  const params = {
    filters: {
      'doctor.departmentId': props.departmentId,
      date: selectedDate.value,
    },
    options: {
      showPagination: false,
    },
  };

  // 调用医生排班API获取数据
  const res = await DoctorScheduleApi.list(params);

  // 将返回的医生列表数据赋值给scheduleList.value
  scheduleList.value = res.data;
};

/**
 * 处理日期点击事件的函数
 *
 * 当用户点击某个日期时，该函数会被调用，它主要负责更新当前选中的日期，
 * 并根据选中的日期加载对应的医生信息
 *
 * @param {string} date - 用户点击的日期，格式为字符串
 */
const handleDateClick = (date: string) => {
  // 更新当前选中的日期
  selectedDate.value = date;
  // 加载医生信息
  loadDoctors();
};

const handleAppoint = (schedule: Schedule.DoctorSchedule) => {
  console.log('schedule', schedule);
};

onMounted(() => {
  loadDoctors();
});

// 表单提交
const refresh = () => {
  loadDoctors();
};

defineExpose({ refresh });
</script>
