<template>
  <div w-350px>
    <n-input v-model:value="inputVal" />
    <n-input-number v-model:value="number" mt-30px />
    <p mt-20px text-center text-14px color-gray dark:color-amber>
      注：右击标签重新加载可重置keep-alive
    </p>
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'KeepAlive' });
const inputVal = ref('');
const number = ref(0);
</script>
