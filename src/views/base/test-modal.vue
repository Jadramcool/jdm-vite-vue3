<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2024/01/13 17:41:47
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <CommonPage show-footer>
    <n-button type="primary" @click="openModal1">打开第一个弹个窗</n-button>
    <MeModal ref="$modal1">
      <n-input v-model:value="text" />
    </MeModal>
    <MeModal ref="$modal2" title="上一个弹窗提交的内容">
      <h2>{{ text }}</h2>
    </MeModal>
  </CommonPage>
</template>

<script setup>
const text = ref('');
</script>
