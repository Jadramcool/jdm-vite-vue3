<template>
  <div>
    <Welcome></Welcome>
    <n-grid x-gap="10" y-gap="10" cols="1 m:24" responsive="screen" class="mt-10px">
      <n-gi span="16">
        <n-card bordered hoverable>
          <LineChart />
        </n-card>
      </n-gi>
      <n-gi span="8"> </n-gi>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { GaodeApi } from '@/api';
import { LineChart, Welcome } from './components';

const weatherLiveData = ref<Recordable>({});

const getLocationWeather = async () => {
  const weatherData = await GaodeApi.cityWeather();
  const [liveWeather] = weatherData.lives;
  weatherLiveData.value = liveWeather;
};

onMounted(() => {
  getLocationWeather();
});
</script>

<style lang="scss" scoped>
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
