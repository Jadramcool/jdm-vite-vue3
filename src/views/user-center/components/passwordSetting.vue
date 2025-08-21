<template>
  <div class="password-setting-container">
    <div class="password-section">
      <div class="section-header">
        <JayIcon icon="solar:lock-password-bold" class="header-icon" />
        <span class="header-title">修改密码</span>
      </div>
      <div class="form-container">
        <n-form
          ref="formRef"
          :model="passwordModel"
          :rules="rules"
          label-placement="left"
          label-width="120"
          require-mark-placement="right-hanging"
          class="password-form"
        >
          <n-form-item
            path="originPassword"
            :label="$t('modules.appCenter.passwordSetting.originPassword')"
          >
            <n-input
              type="password"
              v-model:value="passwordModel.originPassword"
              show-password-on="click"
              size="large"
              class="form-input"
              @keydown.enter.prevent
            >
              <template #prefix>
                <JayIcon icon="solar:lock-bold" class="input-icon" />
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="password" :label="$t('modules.appCenter.passwordSetting.newPassword')">
            <n-input
              v-model:value="passwordModel.password"
              type="password"
              show-password-on="click"
              size="large"
              class="form-input"
              @keydown.enter.prevent
            >
              <template #prefix>
                <JayIcon icon="solar:key-bold" class="input-icon" />
              </template>
            </n-input>
          </n-form-item>
          <n-form-item
            ref="rPasswordFormItemRef"
            first
            path="reenteredPassword"
            :label="$t('modules.appCenter.passwordSetting.repeatPassword')"
          >
            <n-input
              v-model:value="passwordModel.reenteredPassword"
              show-password-on="click"
              :disabled="!passwordModel.password"
              type="password"
              size="large"
              class="form-input"
              @keydown.enter.prevent
            >
              <template #prefix>
                <JayIcon icon="solar:key-minimalistic-bold" class="input-icon" />
              </template>
            </n-input>
          </n-form-item>
          <div class="form-actions">
            <n-button
              type="primary"
              size="large"
              :disabled="passwordModel.reenteredPassword === null"
              :loading="loading"
              @click="handleSubmit"
              class="submit-button"
            >
              <template #icon>
                <JayIcon icon="solar:check-circle-bold" />
              </template>
              {{ $t('common.submit') }}
            </n-button>
          </div>
        </n-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { UserApi } from '@/api';
import { common } from '@/config';
import { $t } from '@/locales';
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
            reject(new Error($t('modules.appCenter.passwordSetting.pleaseInputOriginPassword')));
          }
          if (value.length < common.passwordMinLength) {
            reject(
              new Error(
                `${$t('modules.appCenter.passwordSetting.passwordLengthMin')} ${common.passwordMaxLength} ${$t('modules.appCenter.passwordSetting.digit')}`,
              ),
            );
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
      message: $t('modules.appCenter.passwordSetting.pleaseInputReenteredPassword'),
      trigger: ['input', 'blur'],
    },
    {
      trigger: ['input'],
      validator: (_rule: FormItemRule, value: string) => {
        return new Promise<void>((resolve, reject) => {
          if (value !== passwordModel.password) {
            reject(new Error($t('modules.appCenter.passwordSetting.passwordNotMatch')));
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
      reject(new Error($t('modules.appCenter.passwordSetting.pleaseInputPassword')));
    }
    if (value.length < common.passwordMinLength) {
      reject(
        new Error(
          `${$t('modules.appCenter.passwordSetting.passwordLengthMin')} ${common.passwordMaxLength} ${$t('modules.appCenter.passwordSetting.digit')}`,
        ),
      );
    }
    if (value.length > common.passwordMaxLength) {
      reject(
        new Error(
          `${$t('modules.appCenter.passwordSetting.passwordLengthMax')} ${common.passwordMaxLength} ${$t('modules.appCenter.passwordSetting.digit')}`,
        ),
      );
    }
    // 正则表达式判断是否包含除了数字，小写字母，大写字母，下划线以外的输入
    const regex = /^[a-zA-Z0-9_]*$/;
    if (!regex.test(value)) {
      reject(new Error($t('modules.appCenter.passwordSetting.passwordFormatError')));
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
    window.$message.success($t('modules.appCenter.passwordSetting.updateSuccess'));
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

<style scoped lang="scss">
.password-setting-container {
  .password-section {
    background: #ffffff;
    padding: 32px 0;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid rgba(99, 102, 241, 0.1);

    .header-icon {
      width: 20px;
      height: 20px;
      color: #6366f1;
      flex-shrink: 0;
    }

    .header-title {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin: 0;
      letter-spacing: -0.025em;
    }
  }

  .form-container {
    max-width: 500px;
    margin: 0 auto;
  }

  .password-form {
    :deep(.n-form-item) {
      margin-bottom: 24px;

      .n-form-item-label {
        font-weight: 600;
        color: #4a5568;
        padding-bottom: 8px;
      }

      .n-form-item-feedback-wrapper {
        margin-top: 8px;
      }
    }
  }

  .form-input {
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &:focus-within {
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
    }
  }

  .input-icon {
    width: 18px;
    height: 18px;
    color: #9ca3af;
    margin-left: 12px;
  }

  .form-actions {
    display: flex;
    justify-content: center;
    padding-top: 24px;
    border-top: 1px solid rgba(229, 231, 235, 0.8);
    margin-top: 16px;
  }

  .submit-button {
    border-radius: 12px;
    padding: 12px 32px;
    font-weight: 600;
    font-size: 16px;
    box-shadow: 0 4px 16px rgba(24, 144, 255, 0.3);
    transition: all 0.3s ease;
    min-width: 140px;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
}

// 密码强度提示样式
:deep(.n-form-item-feedback) {
  font-size: 12px;
  color: #ef4444;
  margin-top: 4px;
}

// 响应式设计
@media (max-width: 768px) {
  .password-setting-container {
    .password-section {
      padding: 24px 0;
    }

    .section-header {
      margin-bottom: 20px;
      padding-bottom: 12px;

      .header-title {
        font-size: 15px;
      }
    }

    .form-container {
      max-width: 100%;
    }

    .password-form {
      :deep(.n-form-item) {
        margin-bottom: 20px;
      }
    }

    .submit-button {
      padding: 10px 24px;
      font-size: 14px;
      min-width: 120px;
    }
  }
}
</style>
