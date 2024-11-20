<script setup lang="ts">
import { useAuthStore, useUserStore } from '@/store';

const router = useRouter();

const userStore = useUserStore();
const authStore = useAuthStore();
const userInfo = ref(userStore.userInfo);
const options = [
  {
    label: '个人设置',
    value: 'userCenter',
  },
  {
    label: '退出登录',
    value: 'logout',
  },
];

const handleSelect = (val: string) => {
  if (val === 'userCenter') {
    router.push('/user-center');
  }
  if (val === 'logout') {
    authStore.logout();
  }
};
</script>

<template>
  <n-popselect :options="options" trigger="click" :on-update:value="handleSelect">
    <CommonWrapper>
      <n-avatar round size="small" :src="userInfo?.avatar || ''" />
      <span>{{ userInfo?.name || userInfo?.username || userInfo?.phone }}</span>
    </CommonWrapper>
  </n-popselect>
</template>

<style scoped></style>
