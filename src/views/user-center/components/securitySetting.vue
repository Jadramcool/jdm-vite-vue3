<template>
  <n-list hoverable clickable bordered>
    <n-list-item>
      <n-thing
        :title="$t('modules.appCenter.securitySetting.realNameAuth')"
        content-style="margin-top: 10px;"
      >
        <template #description>
          <span class="text-gray">
            {{ $t('modules.appCenter.securitySetting.authInfo') }}{{ userInfo.name || '-' }}</span
          >
        </template>
      </n-thing>
      <template #suffix>
        <n-tag :type="userInfo.name ? 'success' : 'error'" size="small" :bordered="false">
          {{
            userInfo.name
              ? $t('modules.appCenter.securitySetting.authSuccess')
              : $t('modules.appCenter.securitySetting.authFailed')
          }}
        </n-tag>
      </template>
    </n-list-item>
    <n-list-item>
      <n-thing
        :title="$t('modules.appCenter.securitySetting.password')"
        content-style="margin-top: 10px;"
      >
        <template #description>
          <span class="text-gray">
            {{ $t('modules.appCenter.securitySetting.passwordTip') }}
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
      <n-thing
        :title="$t('modules.appCenter.securitySetting.phone')"
        content-style="margin-top: 10px;"
      >
        <template #description>
          <span class="text-gray">
            {{ $t('modules.appCenter.securitySetting.phoneInfo')
            }}{{ maskPhone(userInfo.phone) || '-' }}
          </span>
        </template>
      </n-thing>
      <template #suffix>
        <n-button type="primary" text size="small" @click="handleEditBasic">
          {{ $t('common.edit') }}
        </n-button>
      </template>
    </n-list-item>
    <n-list-item>
      <n-thing
        :title="$t('modules.appCenter.securitySetting.email')"
        content-style="margin-top: 10px;"
      >
        <template #description>
          <span class="text-gray">
            {{ $t('modules.appCenter.securitySetting.emailInfo') }}{{ userInfo.email || '-' }}
          </span>
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
