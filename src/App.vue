<template>
  <div>{{ userStore.name }}</div>
  <RouterView />
  <n-button @click="handleToPage('Home')">Home</n-button>
  <n-button @click="handleToPage('Demo')">Demo</n-button>
</template>

<script setup lang="ts" name="App">
import useUserStore from '@/store/modules/user';

const userStore = useUserStore();

const router = useRouter();
const handleToPage = (name: string) => {
  router.push({ name });
};
</script>

<style scoped>
#app {
  width: 100vw;
  height: 100vh;
}
</style>
