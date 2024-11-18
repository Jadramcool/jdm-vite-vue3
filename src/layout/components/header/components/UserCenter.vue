<script setup lang="ts">
import { useAuthStore, useUserStore } from '@/store';

const userStore = useUserStore();
const authStore = useAuthStore();
const userInfo = ref(userStore.userInfo);
const options = [
  {
    label: '个人设置',
    value: 'userSetting',
  },
  {
    label: '退出登录',
    value: 'logout',
  },
];

const handleSelect = (val: string) => {
  if (val === 'logout') {
    authStore.logout();
  }
};
</script>

<template>
  <n-popselect :options="options" trigger="click" :on-update:value="handleSelect">
    <CommonWrapper>
      <n-avatar round size="small" :src="userInfo.avatar || ''" />
      <span>111</span>
    </CommonWrapper>
  </n-popselect>
</template>

<style scoped></style>
