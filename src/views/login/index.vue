<template>
  <div>login</div>
  <n-button type="success" @click="handleLogin">登录</n-button>
  <n-button type="warning" @click="handleLogout">退出登录</n-button>
</template>

<script setup lang="ts">
import * as UserApi from '@/api/user';
import { lStorage } from '@/utils/storage';
import { useAuthStore } from '@/store';

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();

onMounted(() => {
  handleLogin();
});

const handleLogin = async () => {
  try {
    const data = {
      username: 'admin',
      password: '123456',
    };
    const res = await UserApi.login(data);
    console.log('🚀 ~ handleLogin ~ res:', res);
    onLoginSuccess(res);
  } catch (error) {
    console.error(error);
  }
};

async function onLoginSuccess(data: any = {}) {
  authStore.setToken(data);
  try {
    if (route.query.redirect) {
      const path: string = route.query.redirect as string;
      delete route.query.redirect;
      router.push({ path, query: route.query });
    } else {
      router.push('/');
    }
  } catch (error) {
    console.error(error);
  }
}

const handleLogout = () => {
  lStorage.clearAll();
};
</script>
