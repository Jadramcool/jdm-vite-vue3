<template>
  <n-list hoverable clickable bordered>
    <n-list-item>
      <n-thing title="实名认证" content-style="margin-top: 10px;">
        <template #description>
          <span class="text-gray"> 认证信息：{{ userInfo.name || '-' }}</span>
        </template>
      </n-thing>
      <template #suffix>
        <n-tag :type="userInfo.name ? 'success' : 'error'" size="small" :bordered="false">
          {{ userInfo.name ? '已认证' : '未认证' }}
        </n-tag>
      </template>
    </n-list-item>
    <n-list-item>
      <n-thing title="账户密码" content-style="margin-top: 10px;">
        <template #description>
          <span class="text-gray">
            密码6-18位字符，支持数字、字母和除空格外的特殊字符，且必须同时包含数字和小写字母。
          </span>
        </template>
      </n-thing>
      <template #suffix>
        <n-button type="primary" text size="small" @click="handleEditPassword">{{
          $t('common.edit')
        }}</n-button>
      </template>
    </n-list-item>
    <n-list-item>
      <n-thing title="密保手机" content-style="margin-top: 10px;">
        <template #description>
          <span class="text-gray"> 已绑定手机：{{ maskPhone(userInfo.phone) || '-' }} </span>
        </template>
      </n-thing>
      <template #suffix>
        <n-button type="primary" text size="small" @click="handleEditBasic">
          {{ $t('common.edit') }}
        </n-button>
      </template>
    </n-list-item>
    <n-list-item>
      <n-thing title="安全邮箱" content-style="margin-top: 10px;">
        <template #description>
          <span class="text-gray"> 已绑定邮箱：{{ userInfo.email || '-' }} </span>
        </template>
      </n-thing>
      <template #suffix>
        <n-button type="primary" text size="small" @click="handleEditBasic">
          {{ $t('common.edit') }}
        </n-button>
      </template>
    </n-list-item>
  </n-list>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store';
import { maskPhone } from '@/utils';

defineOptions({ name: 'SecuritySettings' });
const emit = defineEmits(['edit-password', 'edit-basic']);

const userStore = useUserStore();

const { userInfo } = toRefs(userStore);

const handleEditPassword = () => {
  emit('edit-password');
};
const handleEditBasic = () => {
  emit('edit-basic');
};
</script>

<style scoped lang="scss"></style>
