<template>
  <div>
    <n-divider title-placement="left">
      <p class="divider-style">{{ $t('modules.appCenter.basicSetting.avatarInfo') }}</p>
    </n-divider>

    <div class="flex-col flex-x-center">
      <n-avatar :src="userInfo?.avatar" round :size="140"></n-avatar>
      <n-upload
        class="mt-10px flex-col flex-x-center"
        :action="uploadUrl"
        :headers="headers"
        :data="{
          type: 'single',
        }"
        @before-upload="beforeUpload"
        :show-file-list="false"
        :on-finish="handleUploadSuccess"
      >
        <n-button type="primary">{{ $t('modules.appCenter.basicSetting.uploadAvatar') }}</n-button>
      </n-upload>
    </div>
    <n-divider title-placement="left">
      <p class="divider-style">{{ $t('modules.appCenter.basicSetting.userInfo') }}</p>
    </n-divider>
    <BasicForm @register="registerUserInfoForm" ref="formRef"></BasicForm>
    <div class="text-center">
      <n-button type="primary" attr-type="submit" @click="handleSubmitUserInfo">
        {{ $t('common.submit') }}
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserApi } from '@/api';
import { BasicForm, useForm } from '@/components';
import { $t } from '@/locales';
import { useConstantsStore, useUserStore } from '@/store';
import { getToken } from '@/utils';
import type { UploadFileInfo } from 'naive-ui';
import { useUserInfoSchema } from '../schema';

defineOptions({ name: 'BasicSetting' });

const userStore = useUserStore();
const constantsStore = useConstantsStore();

const uploadUrl = `${import.meta.env.VITE_APP_BASE_URL}/upload/avatar`;
const headers = {
  authorization: `Bearer ${getToken()}`,
};

const userInfo = computed(() => ({
  ...userStore.getUser,
}));

// 省市区对照表
const cityAddress = computed(() => {
  return constantsStore.getCityAddress;
});

// 存储省市区路径
const cityDetail = ref<string>('');

onMounted(async () => {
  // 初始化表单数据
  if (unref(userInfo)) {
    await setFieldsValue(unref(userInfo));

    const componentInstance = await getComponentInstance('city');

    // 获取到当前的省市区地址，naive ui不支持单选直接获取，只能去取label自己格式化了
    cityDetail.value = componentInstance.selectedOption?.label.replace(/[\s\/]/g, '') || '';
  }
});

const schemaMethods = {
  addressUpdate(_val: string, _option: any, pathValues: any[]) {
    const path = pathValues?.map((item) => item?.name).join('');
    cityDetail.value = path;
  },
};

const { editFormSchemas } = useUserInfoSchema(schemaMethods, { addressOptions: cityAddress });

const [registerUserInfoForm, { setFieldsValue, validate, getFieldsValue, getComponentInstance }] =
  useForm({
    labelWidth: 120,
    gridProps: { cols: '2' },
    schemas: editFormSchemas,
    showActionButtonGroup: false,
  });

const beforeUpload = async (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  if (!['image/png', 'image/jpeg'].includes(data.file.file?.type as string)) {
    window.$message.error($t('modules.appCenter.basicSetting.uploadTypeError'));
    return false;
  }
  return true;
};

const handleUploadSuccess = ({ event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
  const response = JSON.parse((event?.target as XMLHttpRequest)?.response);
  const avatarUrl = response?.data?.fileUrl;
  if (avatarUrl) {
    userStore.setUser({ avatar: avatarUrl });
    window.$message.success($t('modules.appCenter.basicSetting.uploadSuccess'));
  }
};

const handleSubmitUserInfo = async () => {
  try {
    await validate();
    const values = getFieldsValue();

    if (values) {
      values.birthday = new Date(values.birthday);
      values.addressDetail = cityDetail.value + values.address;
      const newUserInfo = await UserApi.update(values);
      userStore.setUser(newUserInfo);
      window.$message.success($t('common.submitSuccess'));
    }
  } catch (e: any) {
    if (Array.isArray(e)) {
      const errMsg = e.map((item) => item[0].message).join(',');
      window.$message.error(errMsg);
    } else {
      window.$message.error(e);
    }
  }
};
</script>
