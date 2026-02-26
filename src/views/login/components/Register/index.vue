<template>
  <div class="modern-register-form">
    <!-- 装饰性背景元素 -->
    <div class="decorative-bg">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
    </div>

    <!-- 表单标题 -->
    <div class="form-title-section mb-40px text-center">
      <div class="logo-container mb-16px">
        <div class="logo-icon">
          <JayIcon :icon="'solar:user-plus-bold-duotone'" :size="40" />
        </div>
      </div>
      <h2 class="form-title text-2xl font-bold mb-8px">创建账户</h2>
      <p class="form-subtitle text-gray-500">请填写注册信息</p>
    </div>

    <!-- 注册表单 -->
    <div class="register-form-container">
      <n-form
        ref="registerFormRef"
        :model="registerForm"
        :show-label="false"
        :rules="registerFormRules"
      >
        <!-- 用户名输入框 -->
        <n-form-item path="username" class="form-item">
          <n-input
            v-model:value="registerForm.username"
            :placeholder="$t('login.username')"
            class="modern-input"
            size="large"
          >
            <template #prefix>
              <JayIcon :icon="'solar:user-rounded-line-duotone'" />
            </template>
          </n-input>
        </n-form-item>

        <!-- 手机号输入框 -->
        <n-form-item path="phone" class="form-item">
          <n-input
            v-model:value="registerForm.phone"
            :placeholder="$t('user.phone')"
            class="modern-input"
            size="large"
          >
            <template #prefix>
              <JayIcon :icon="'solar:phone-line-duotone'" />
            </template>
          </n-input>
        </n-form-item>

        <!-- 密码输入框 -->
        <n-form-item path="password" class="form-item">
          <n-input
            type="password"
            show-password-on="click"
            v-model:value="registerForm.password"
            :maxlength="common.passwordMaxLength"
            :placeholder="$t('login.password')"
            class="modern-input"
            size="large"
          >
            <template #prefix>
              <JayIcon :icon="'solar:lock-password-line-duotone'" />
            </template>
          </n-input>
        </n-form-item>

        <!-- 确认密码输入框 -->
        <n-form-item path="repeatPassword" class="form-item">
          <n-input
            type="password"
            show-password-on="click"
            v-model:value="registerForm.repeatPassword"
            :maxlength="common.passwordMaxLength"
            :placeholder="$t('login.repeatPassword')"
            class="modern-input"
            size="large"
          >
            <template #prefix>
              <JayIcon :icon="'solar:lock-password-line-duotone'" />
            </template>
          </n-input>
        </n-form-item>

        <!-- 验证码输入框 -->
        <n-form-item path="captcha" class="form-item">
          <div class="captcha-wrapper">
            <Captcha
              ref="captchaRef"
              v-model="registerForm.captcha"
              @change="handleCaptchaChange"
              :placeholder="$t('login.captcha')"
              class="captcha-component modern-input"
            />
          </div>
        </n-form-item>
      </n-form>

      <!-- 注册按钮 -->
      <div class="button-group mt-32px">
        <n-button
          type="primary"
          size="large"
          class="register-button w-full h-48px"
          @click="handleRegister"
          :loading="registerLoading"
        >
          {{ $t('login.register') }}
        </n-button>
      </div>

      <!-- 登录提示 -->
      <div class="login-section text-center mt-32px">
        <span class="text-gray-500">{{ $t('login.loginTips') }}</span>
        <n-button text type="primary" @click="toOtherForm('login')" class="login-link ml-4px">
          {{ $t('login.login') }}
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserApi } from '@/api/user';
import { common } from '@/config';
import { FormInst, FormItemRule, FormRules } from 'naive-ui';
import { useI18n } from 'vue-i18n';
// 引入验证码组件
import Captcha from '@/components/common/Captcha/index.vue';

interface RegisterForm {
  username: string;
  password: string;
  repeatPassword: string;
  phone: string;
  captcha: string;
}
const { t } = useI18n();

const registerFormRef = ref<FormInst | null>(null);

const registerForm = ref<RegisterForm>({
  username: '123',
  password: '123456',
  repeatPassword: '123456',
  phone: '13800138000',
  captcha: '',
});

const emit = defineEmits(['update:modelValue']);

const captchaRef = ref<any>(null);
const captchaValid = ref<boolean>(false);

// 注册表单验证规则
const registerFormRules: FormRules = {
  username: [
    {
      required: true,
      message: `${t('common.pleaseInput')} ${t('login.username')}`,
      trigger: 'blur',
    },
  ],
  phone: [
    {
      required: true,
      trigger: ['blur', 'input'],
      validator: (_rule: FormItemRule, value: string) => {
        if (!value) {
          return new Error(t('common.pleaseInput') + t('user.phone'));
        }
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(value)) {
          return new Error('请输入正确的手机号码');
        }
        return Promise.resolve();
      },
    },
  ],
  password: [
    {
      required: true,
      trigger: ['blur', 'input'],
      validator: (_rule: FormItemRule, value: string) => {
        if (!value) {
          return new Error(t('common.pleaseInput') + t('login.password'));
        }
        if (value.length < common.passwordMinLength) {
          return new Error(
            `${t('login.passwordMinLength')} ${common.passwordMinLength} ${t('login.length')}`,
          );
        }
        if (value.length > common.passwordMaxLength) {
          return new Error(
            `${t('login.passwordMaxLength')} ${common.passwordMaxLength} ${t('login.length')}`,
          );
        }
        return Promise.resolve();
      },
    },
  ],
  repeatPassword: [
    {
      required: true,
      trigger: ['blur', 'input'],
      validator: (_rule: FormItemRule, value: string) => {
        if (!value) {
          return new Error(t('common.pleaseInput') + t('login.repeatPassword'));
        }
        if (value !== registerForm.value.password) {
          return new Error(t('login.passwordNotMatch'));
        }
        return Promise.resolve();
      },
    },
  ],
  captcha: [
    {
      required: true,
      trigger: ['blur', 'input'],
      validator: (_rule: FormItemRule, value: string) => {
        if (!value) {
          return new Error(t('common.pleaseInput') + t('login.captcha'));
        }
        if (!captchaRef.value?.getValidationResult()) {
          return new Error(t('login.captchaError'));
        }
        return Promise.resolve();
      },
    },
  ],
};

const toOtherForm = (type: any) => {
  emit('update:modelValue', type);
};

/**
 * 处理验证码变化
 * @param value 验证码值
 * @param isValid 是否有效
 */
const handleCaptchaChange = (value: string, isValid: boolean): void => {
  captchaValid.value = isValid;
};

const messageReactive = ref<any>(null);
const registerLoading = ref<boolean>(false);

/**
 * 注册处理函数
 * @param e 鼠标事件
 */
const handleRegister = async (e: MouseEvent) => {
  e.preventDefault();

  if (registerLoading.value) return;

  registerLoading.value = true;
  messageReactive.value = window.$message.loading(`${t('login.status.registering')}...`, {
    duration: 0,
  });

  // 验证验证码
  if (!captchaRef.value?.getValidationResult()) {
    window.$notification.error({
      title: `${t('login.status.registerFailed')}`,
      content: t('login.captchaError'),
      duration: 3000,
      keepAliveOnHover: true,
    });
    captchaRef.value?.refreshCaptcha();
    messageReactive.value?.destroy();
    return;
  }

  registerFormRef.value?.validate(async (errors) => {
    try {
      if (!errors) {
        const data = {
          username: registerForm.value.username,
          password: registerForm.value.password,
          phone: registerForm.value.phone,
          captcha: registerForm.value.captcha,
        };

        await UserApi.register(data);
        window.$notification.success({
          title: `${t('login.status.registerSuccess')}`,
          duration: 3000,
          keepAliveOnHover: true,
        });
        // 跳转到登录页面
        toOtherForm('login');
      } else {
        const errorMessage: any = errors.map((item) => item[0].message).join('\n');
        window.$notification.error({
          title: `${t('login.status.registerFailed')}`,
          content: errorMessage,
          duration: 3000,
          keepAliveOnHover: true,
        });
        // 验证失败时刷新验证码
        captchaRef.value?.refreshCaptcha();
      }
    } catch (error: any) {
      window.$notification.error({
        title: `${t('login.status.registerFailed')}`,
        content: error,
        duration: 3000,
        keepAliveOnHover: true,
      });
    } finally {
      registerLoading.value = false;
      messageReactive.value.destroy();
    }
  });
};
// async function onLoginSuccess(data: any = {}) {
//   authStore.setToken(data);
//   try {
//     if (route.query.redirect) {
//       const path: string = route.query.redirect as string;
//       delete route.query.redirect;
//       router.push({ path, query: route.query });
//     } else {
//       router.push('/');
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }
</script>

<style lang="scss" scoped>
@import '@/assets/styles/login/form-common.scss';

.modern-register-form {
  @extend .modern-form;

  // 使用公共样式
  .decorative-bg {
    @extend .decorative-bg;
  }

  .form-title-section {
    @extend .form-title-section;
  }

  .register-form-container {
    .form-item {
      .modern-input {
        @extend .modern-input;
      }
    }

    .captcha-wrapper {
      .captcha-component {
        @extend .captcha-component;
      }
    }
  }

  .button-group {
    @extend .button-group;

    .register-button {
      @extend .primary-button;
    }
  }

  .login-section {
    @extend .login-section;
  }
}

// 深色模式下的注册表单样式
.login-dark .modern-register-form {
  .register-form-container {
    .login-section {
      border-top: 1px solid rgba(255, 255, 255, 0.1);

      span {
        color: rgba(255, 255, 255, 0.7);
      }

      .login-link {
        :deep(.n-button__content) {
          color: #60a5fa;
        }

        &:hover {
          :deep(.n-button__content) {
            color: #3b82f6;
          }
        }
      }
    }
  }
}
</style>
