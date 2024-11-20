<template>
  <div>
    <n-divider title-placement="left">
      <p class="divider-style">个人信息</p>
    </n-divider>
    <BasicForm @register="registerUserInfoForm"></BasicForm>
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
import { useConstantsStore, useUserStore } from '@/store';
import { useUserInfoSchema } from '../schema';

defineOptions({ name: 'BasicSetting' });

const userStore = useUserStore();
const constantsStore = useConstantsStore();

const userInfo = computed(() => ({
  ...userStore.getUser,
}));

// 省市区对照表
const cityAddress = computed(() => {
  return constantsStore.getCityAddress;
});

// 存储省市区路径
const addressDetail = ref<string>('');

onMounted(() => {
  // 初始化表单数据
  if (unref(userInfo)) {
    setFieldsValue(unref(userInfo));
  }
});

const schemaMethods = {
  addressUpdate(_val: string, _option: any, pathValues: any[]) {
    const path = pathValues?.map((item) => item?.name).join('');
    addressDetail.value = path;
  },
};

const { editFormSchemas } = useUserInfoSchema(schemaMethods, { addressOptions: cityAddress });

const [registerUserInfoForm, { setFieldsValue, validate, getFieldsValue }] = useForm({
  labelWidth: 120,
  gridProps: { cols: '2' },
  schemas: editFormSchemas,
  showActionButtonGroup: false,
});

const handleSubmitUserInfo = async () => {
  try {
    await validate();
    const values = getFieldsValue();

    if (values) {
      values.birthday = new Date(values.birthday);
      values.addressDetail = addressDetail.value;
      const newUserInfo = await UserApi.update(values);
      userStore.setUser(newUserInfo);
      window.$message.success('更新成功');
    }
  } catch (e: any) {
    window.$message.error(e);
  }
};
</script>
