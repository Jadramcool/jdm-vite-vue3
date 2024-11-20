<template>
  <n-form ref="formRef" :model="passwordModel" :rules="rules">
    <n-form-item path="originPassword" label="原密码">
      <n-input
        type="password"
        v-model:value="passwordModel.originPassword"
        show-password-on="click"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item path="password" label="密码">
      <n-input
        v-model:value="passwordModel.password"
        type="password"
        show-password-on="click"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item ref="rPasswordFormItemRef" first path="reenteredPassword" label="重复密码">
      <n-input
        v-model:value="passwordModel.reenteredPassword"
        show-password-on="click"
        :disabled="!passwordModel.password"
        type="password"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-row :gutter="[0, 24]">
      <n-col :span="24" class="flex-center">
        <n-button
          type="primary"
          :disabled="passwordModel.reenteredPassword === null"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ $t('common.submit') }}
        </n-button>
      </n-col>
    </n-row>
  </n-form>
</template>

<script lang="ts" setup>
import { UserApi } from '@/api';
import { common } from '@/config';
import type { FormInst, FormRules } from 'naive-ui';
import { FormItemRule } from 'naive-ui';

defineOptions({ name: 'PasswordSettings' });

const formRef = ref<FormInst | null>(null);
const loading = ref<boolean>(false);

const passwordModel = reactive({
  originPassword: null,
  password: null,
  reenteredPassword: null,
});

const rules = ref<FormRules>({
  originPassword: [
    {
      required: true,
      trigger: ['blur'],
      validator: (_rule: FormItemRule, value: string) => {
        return new Promise<void>((resolve, reject) => {
          if (!value) {
            reject(new Error('请输入原密码'));
          }
          if (value.length < common.passwordMinLength) {
            reject(new Error(`密码长度不能小于${common.passwordMinLength}位`));
          }
          UserApi.checkPassword({ password: value })
            .then((res) => {
              console.log(res);
              resolve();
            })
            .catch((e: any) => {
              reject(new Error(e));
            });
        });
      },
    },
  ],
  password: [
    {
      required: true,
      trigger: ['blur', 'input'],
      validator: (_rule: FormItemRule, value: string) => passwordValidator(value),
    },
  ],
  reenteredPassword: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: ['input', 'blur'],
    },
    {
      trigger: ['input'],
      validator: (_rule: FormItemRule, value: string) => {
        return new Promise<void>((resolve, reject) => {
          if (value !== passwordModel.password) {
            reject(new Error('两次密码不一致'));
          }
          resolve();
        });
      },
    },
  ],
});

// 密码校验
const passwordValidator = (value: string): Promise<void> | Error => {
  return new Promise((resolve, reject) => {
    if (!value) {
      reject(new Error('请输入密码'));
    }
    if (value.length < common.passwordMinLength) {
      reject(new Error(`密码长度不能小于${common.passwordMinLength}位`));
    }
    if (value.length > common.passwordMaxLength) {
      reject(new Error(`密码长度不能大于${common.passwordMaxLength}位`));
    }
    // 正则表达式判断是否包含除了数字，小写字母，大写字母，下划线以外的输入
    const regex = /^[a-zA-Z0-9_]*$/;
    if (!regex.test(value)) {
      reject(new Error('密码只能包含数字、小写字母、大写字母或下划线'));
    }
    resolve();
  });
};

const handleSubmit = async (e: MouseEvent) => {
  e.preventDefault();
  try {
    loading.value = true;
    await formRef.value?.validate();
    await UserApi.updatePassword({
      password: passwordModel.password,
    });
    window.$message.success('密码修改成功');
    passwordModel.originPassword = null;
    passwordModel.password = null;
    passwordModel.reenteredPassword = null;
  } catch (e) {
    window.$message.error(e as string);
  } finally {
    loading.value = false;
  }
};
</script>
