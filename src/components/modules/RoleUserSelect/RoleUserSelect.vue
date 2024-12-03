<template>
  <div>
    <n-tree-select
      :options="options"
      default-value="Drive My Car"
      @update:value="handleUpdateValue"
    />
  </div>
</template>

<script setup lang="ts">
import { RoleApi } from '@/api';

const options = ref<any>([]);

onMounted(() => {
  loadAllRole();
});

const loadAllRole = async () => {
  const res = await RoleApi.roleList({
    options: JSON.stringify({ showPagination: false, with_user: true }),
  });
  console.log('🚀 ~ loadAllRole ~ res:', res);
};

const handleUpdateValue = (value: any) => {
  console.log(value);
};
</script>

<style scoped lang="scss"></style>
