<!--
 * @Author: jdm
 * @Date: 2024-05-30 10:29:46
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-28 11:14:47
 * @FilePath: \vite-vue3-jdm\src\components\Form\src\BasicForm.vue
 * @Description: 
 * 
-->
<template>
  <n-form ref="formRef" inline :label-width="80">
    <n-form-item label="姓名">
      <n-input placeholder="输入姓名" />
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
defineOptions({ name: 'BasicForm' });
</script>

<style lang="scss" scoped>
.read-the-docs {
  color: #888;
}
</style>
