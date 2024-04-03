<template>
  <div>{{ userStore.name }}</div>
  <RouterView />
  <n-button @click="handleToPage('Home')">Home</n-button>
  <n-button @click="handleToPage('Demo')">Demo</n-button>
  <div class="scss">scss</div>
</template>

<script setup lang="ts" name="App">
import useUserStore from '@/store/modules/user';
// import { login } from '@/api/mock/user';
// import * as WeatherApi from '@/api/weather';
// import request from './utils/http/request';
// import { exampleAPI, exampleHupuAPI, mockAPI } from '@/api/example';
import * as exampleApi from '@/api/example';
// exampleAPI().then((res: any) => {
//   console.log('getData: ', res);
//   const { data } = res;
//   console.log('list: ', data);
// });

// exampleHupuAPI().then((res: any) => {
//   console.log('getData: ', res);
//   const { data } = res;
//   console.log('list: ', data);
// });

exampleApi.mockAPI().then((res: any) => {
  console.log('mock: ', res);
  const { data } = res;
  console.log('🚀 ~ mockAPI ~ data:', data);
});

exampleApi.mockPostAPI({ username: '123', password: '123' }).then((res: any) => {
  console.log('mockPostAPI: ', res);
  const { data } = res;
  console.log('🚀 ~ mockPostAPI ~ data:', data);
});
const userStore = useUserStore();

const router = useRouter();
const handleToPage = (name: string) => {
  router.push({ name });
};

// const createUser = () => {
//   login({
//     name: 'vben',
//     gender: 'man',
//   }).then((data: any) => {
//     console.log(data);
//   });
// };

onMounted(async () => {});
</script>

<style lang="scss" scoped>
#app {
  width: 100vw;
  height: 100vh;
}

.scss {
  color: $test-color;
}
</style>
