<template>
  <div>
    <n-card class="header" bordered hoverable>
      <template class="flex flex-row flex-x-center">
        <n-avatar :src="userInfo.avatar" :size="80" round :bordered="true"></n-avatar>
        <div class="ml-20px">
          <n-h3 strong class="text-18px font-semibold mb-4px">
            {{ getTimeofDay }}, {{ userInfo.name || userInfo.username }},{{
              $t('common.phrase.welcome')
            }}!
          </n-h3>
          <n-text class="text-tips">
            {{ weatherLiveData.city }}, 今日天气{{ weatherLiveData.weather }}, 温度
            {{ weatherLiveData.temperature }}℃
          </n-text>
        </div>
      </template>
    </n-card>
    <n-grid x-gap="10" y-gap="10" cols="1 m:24" responsive="screen" class="mt-10px">
      <n-gi span="16">
        <n-card bordered hoverable>
          <LineChart />
        </n-card>
      </n-gi>
      <n-gi span="8">
        <n-space vertical :size="[0, 10]">
          <Notice></Notice>
          <TodoList></TodoList>
        </n-space>
      </n-gi>
    </n-grid>

    <!-- <n-button type="warning" @click="handleLogout">退出登录</n-button> -->
  </div>
</template>

<script setup lang="ts">
import { GaodeApi } from '@/api';
import { $t } from '@/locales';
import { useUserStore } from '@/store';
import dayjs from 'dayjs';
import { LineChart, Notice, TodoList } from './components';

const userStore = useUserStore();
const { userInfo } = userStore;

const weatherLiveData = ref<Recordable>({});

const getTimeofDay = computed(() => {
  const hour = dayjs().hour();

  if (hour >= 6 && hour < 12) {
    return $t('common.time.goodMorning');
  }
  if (hour >= 12 && hour < 18) {
    return $t('common.time.goodAfternoon');
  }
  return $t('common.time.goodEvening');
});

const getLocationWeather = async () => {
  const weatherData = await GaodeApi.cityWeather();
  const [liveWeather] = weatherData.lives;
  weatherLiveData.value = liveWeather;
};

onMounted(() => {
  getLocationWeather();
});

// const handleLogout = () => {
//   lStorage.clearAll();
// };
</script>

<style lang="scss" scoped>
.test {
  color: var(--primary-color);
}
.card {
  width: 200px;
  height: 200px;
  padding: 20px;
}

.card-bg {
  background: #fff;
}
.card-bg-dark {
  background: #000;
}
</style>
