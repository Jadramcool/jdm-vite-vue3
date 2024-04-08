<template>
  <CommonPage show-footer>
    <div>home</div>
    <n-button type="warning" @click="handleLogout">退出登录</n-button>
    <n-button type="warning" @click="handlePage">跳转路由</n-button>
  </CommonPage>
</template>

<script setup lang="ts">
// import { setToken } from '@/utils/token';
import { lStorage } from '@/utils/storage';

const router = useRouter();
const handleLogout = () => {
  lStorage.clearAll();
};

const handlePage = () => {
  router.push('/base/components');
};
</script>
