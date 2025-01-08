<template>
  <div>
    <n-grid x-gap="12" cols="1 l:12" responsive="screen" item-responsive class="mt-10px">
      <n-gi span="1 m:4">
        <n-space vertical>
          <UserInfoCard :isEdit="true"></UserInfoCard>
          <Notice></Notice>
        </n-space>
      </n-gi>
      <n-gi span="1 m:8">
        <n-space vertical>
          <Welcome
            :show-avatar="false"
            :showAppointments="true"
            :doctor-appointments="doctorAppointments"
          ></Welcome>
          <n-flex align="start" :size="0" justify="start">
            <div
              class="min-w-120px flex-1 bg-white"
              v-for="(item, index) in calendarList"
              :key="index"
            >
              <n-flex
                class="h-120px borderd rounded"
                vertical
                align="center"
                justify="center"
                :class="
                  item.date === selectedDate
                    ? 'bg-primary transition-all delay-100 text-white'
                    : 'cursor-hover'
                "
              >
                <div>{{ item.date }}</div>
                <div>{{ item.week }}</div>
                <n-space>
                  <n-tag
                    :type="timePeriodTypeOptions[timePeriod]"
                    v-for="(timePeriod, index) in item.schedule"
                    :key="index"
                    :bordered="false"
                    :color="
                      item.date === selectedDate
                        ? timePeriod === 'MORNING'
                          ? { color: '#f0a020ff', textColor: '#eee', borderColor: '#eee' }
                          : { color: '#2080f0ff', textColor: '#eee', borderColor: '#eee' }
                        : undefined
                    "
                  >
                    {{ timePeriodOptions.find((item) => item.value === timePeriod)?.label }}
                  </n-tag>
                </n-space>
              </n-flex>
            </div>
          </n-flex>
          <n-grid cols="3" x-gap="12">
            <n-gi span="1">
              <AppCard hoverable bordered class="p-24px h-400px" @click="handleJump('appointment')">
                开始叫号
              </AppCard>
            </n-gi>
            <n-gi span="1">
              <AppCard bordered hoverable class="p-24px h-400px" @click="handleJump('my-patient')">
                我的病人
              </AppCard>
            </n-gi>
            <n-gi span="1">
              <AppCard hoverable bordered class="p-24px h-400px" @click="handleJump('my-cases')">
                我的病例
              </AppCard>
            </n-gi>
          </n-grid>
        </n-space>
      </n-gi>
    </n-grid>
  </div>
</template>
<script setup lang="tsx">
import { DoctorApi } from '@/api';
import { timePeriodOptions, timePeriodTypeOptions } from '@/constants';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { Notice, UserInfoCard, Welcome } from './components';

const router = useRouter();

const doctorDetail = ref<any>(null);

const doctorAppointments = ref<any>(null);

const doctorInfo = async () => {
  const res = await DoctorApi.info();
  doctorDetail.value = res;
  const todaySchedule = doctorDetail.value.doctorSchedule.filter((item: any) => {
    return dayjs(item.date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');
  });
  let total: number = 0;

  let finished: number = 0;

  todaySchedule.forEach((item: any) => {
    item.appointment.forEach((appointment: any) => {
      total++;
      if (appointment.status === 'FINISHED') {
        finished++;
      }
    });
  });

  doctorAppointments.value = {
    total,
    finished,
  };
};

const calendarList = computed(() => {
  // 获取从今天开始,往后7天的日期再加上星期,分开存储比如说{date: '2024-12-22', week: '星期二'}
  return Array.from({ length: 7 }, (_, i) => {
    const date = dayjs().add(i, 'day').format('YYYY-MM-DD');
    const week = dayjs().add(i, 'day').format('dddd');
    let schedule = [];
    if (doctorDetail.value) {
      schedule = doctorDetail.value.doctorSchedule
        .filter((item: Recordable) => {
          return dayjs(item.date).format('YYYY-MM-DD') === date;
        })
        .map((item: Recordable) => item.timePeriod)
        .sort((a: any, b: any) => {
          const order: any = { MORNING: 1, AFTERNOON: 2 };
          return (order[a] || 3) - (order[b] || 3);
        });
    }

    return { date, week, schedule };
  });
});

const selectedDate = ref<string>(dayjs().format('YYYY-MM-DD'));

onMounted(() => {
  doctorInfo();
});

// 用户信息表格

const handleJump = (path: string) => {
  router.push(`/doctor/${path}`);
};
</script>
