<template>
  <div>
    <AppCard> </AppCard>
    <div id="container"></div>
    <n-button type="warning" @click="handleLogout">退出登录</n-button>
  </div>
</template>

<script setup lang="ts">
import { lStorage } from '@/utils/storage';

const handleLogout = () => {
  lStorage.clearAll();
};
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
