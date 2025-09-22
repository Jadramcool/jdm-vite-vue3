<template>
  <div class="modern-login-form">
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
          <JayIcon :icon="'solar:shield-check-bold-duotone'" :size="40" />
        </div>
      </div>
      <h2 class="form-title text-2xl font-bold mb-8px">欢迎回来</h2>
      <p class="form-subtitle text-gray-500">请登录您的账户</p>
    </div>

    <!-- 登录表单 -->
    <div class="login-form-container">
      <n-form ref="loginFormRef" :model="loginForm" :show-label="false" :rules="loginFormRules">
        <!-- 用户名输入框 -->
        <n-form-item path="username" class="form-item">
          <n-input
            v-model:value="loginForm.username"
            :placeholder="$t('login.username')"
            class="modern-input"
            size="large"
          >
            <template #prefix>
              <JayIcon :icon="'solar:user-rounded-line-duotone'" />
            </template>
          </n-input>
        </n-form-item>

        <!-- 密码输入框 -->
        <n-form-item path="password" class="form-item">
          <n-input
            type="password"
            show-password-on="click"
            v-model:value="loginForm.password"
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

        <!-- 验证码输入框 -->
        <n-form-item path="captcha" class="form-item">
          <div class="captcha-wrapper">
            <Captcha
              ref="captchaRef"
              v-model="loginForm.captcha"
              @change="handleCaptchaChange"
              :placeholder="$t('login.captcha')"
              class="captcha-component modern-input"
            />
          </div>
        </n-form-item>

        <!-- 记住密码和忘记密码 -->
        <div class="form-options flex justify-between items-center mb-24px">
          <n-checkbox
            v-model:checked="isRemember"
            @update:checked="handleIsRemember"
            class="remember-checkbox"
          >
            {{ $t('login.isRemember') }}
          </n-checkbox>
          <n-button text type="primary" class="forgot-password">
            {{ $t('login.forgetPassword') }}?
          </n-button>
        </div>
      </n-form>

      <!-- 登录按钮组 -->
      <div class="button-group space-y-16px">
        <n-button
          type="primary"
          size="large"
          class="login-button w-full h-48px"
          @click="handleLogin"
          :loading="loginLoading"
        >
          {{ $t('login.login') }}
        </n-button>

        <n-button
          type="default"
          size="large"
          class="experience-button w-full h-48px"
          @click="handleExperience"
        >
          {{ $t('login.experience') }}
        </n-button>
      </div>

      <!-- 注册提示 -->
      <div class="register-section text-center mt-32px">
        <span class="text-gray-500">{{ $t('login.registerTips') }}</span>
        <n-button text type="primary" @click="toOtherForm('register')" class="register-link ml-4px">
          {{ $t('login.register') }}
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserApi } from '@/api/user';
import { common } from '@/config';
import { useAuthStore } from '@/store';
import { lStorage } from '@/utils/storage';
import { FormInst, FormItemRule, FormRules } from 'naive-ui';
// 引入i18n
import { useI18n } from 'vue-i18n';
// 引入验证码组件
import Captcha from '@/components/common/Captcha/index.vue';

const { t } = useI18n();

const emit = defineEmits(['update:modelValue']);

interface LoginForm {
  username: string;
  password: string;
  captcha: string;
}

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();

const loginFormRef = ref<FormInst | null>(null);

const loginForm = ref<LoginForm>({
  username: '',
  password: '',
  captcha: '',
});

// 登录表单验证规则
const loginFormRules: FormRules = {
  username: [
    {
      required: true,
      message: `${t('common.pleaseInput')} ${t('login.username')}`,
      trigger: 'blur',
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

const isRemember = ref<boolean>(false);
const captchaRef = ref<any>(null);
const captchaValid = ref<boolean>(false);
const loginLoading = ref<boolean>(false);

onMounted(async () => {
  checkLocalAccount();
});

const toOtherForm = (type: any) => {
  emit('update:modelValue', type);
};

// 是否记住密码
const handleIsRemember = () => {
  if (isRemember.value) {
    window.$notification.info({
      title: `${t('login.isRememberTips')}`,
      duration: 3000,
      keepAliveOnHover: true,
    });
  }
};

// 检查本地账号
const checkLocalAccount = () => {
  if (lStorage.getItem('loginForm')) {
    const account = lStorage.getItem('loginForm');
    loginForm.value.username = account.username;
    loginForm.value.password = account.password;
    isRemember.value = true;
  }
};

/**
 * 处理验证码变化
 * @param value 验证码值
 * @param isValid 是否有效
 */
const handleCaptchaChange = (value: string, isValid: boolean): void => {
  captchaValid.value = isValid;
};

/**
 * 登录处理函数
 * @param e 鼠标事件
 */
const handleLogin = async (e?: MouseEvent) => {
  if (e) e.preventDefault();

  if (loginLoading.value) return;

  loginLoading.value = true;
  const messageReactive = window.$message.loading(`${t('login.status.logining')}...`, {
    duration: 0,
  });
  try {
    await loginFormRef.value?.validate(async (errors) => {
      if (!errors) {
        const data = {
          username: loginForm.value.username,
          password: loginForm.value.password,
          captcha: loginForm.value.captcha,
        };
        try {
          const res = await UserApi.login(data);
          onLoginSuccess(res);
        } catch (error) {
          console.error('error', error);
          window.$notification.error({
            title: `${t('login.status.loginFailed')}`,
            content: error as string,
            duration: 3000,
            keepAliveOnHover: true,
          });
          // 登录失败时刷新验证码
          captchaRef.value?.refreshCaptcha();
        }
      } else {
        const errorMessage: any = errors.map((item) => item[0].message).join('\n');
        window.$notification.error({
          title: `${t('login.status.loginFailed')}`,
          content: errorMessage,
          duration: 3000,
          keepAliveOnHover: true,
        });
        // 验证失败时刷新验证码
        captchaRef.value?.refreshCaptcha();
      }
    });
  } finally {
    loginLoading.value = false;
    messageReactive.destroy();
  }
};

const handleExperience = async () => {
  const mock = true;
  if (!mock) {
    window.$notification.info({
      title: '一键体验',
      meta: '一键体验功能暂未开放',
      duration: 3000,
      keepAliveOnHover: true,
    });
  } else {
    mockLogin('admin');
  }
};

const mockLogin = async (roleType: string) => {
  const messageReactive = window.$message.loading(`${t('login.status.logining')}...`, {
    duration: 0,
  });
  const data = {
    username: roleType,
    password: '123123',
  };
  try {
    const res = await UserApi.login(data);
    onLoginSuccess(res);
    messageReactive.destroy();
  } catch (error) {
    console.error('error', error);
    window.$notification.error({
      title: `${t('login.status.loginFailed')}`,
      content: error as string,
      duration: 3000,
      keepAliveOnHover: true,
    });
    messageReactive.destroy();
  }
};
/**
 * 登录成功处理函数
 * @param data 登录返回数据
 */
async function onLoginSuccess(data: any = {}) {
  // 存储登录表单（不包含验证码）
  if (isRemember.value) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { captcha: _, ...loginFormData } = loginForm.value;

    lStorage.setItem('loginForm', loginFormData);
  } else {
    lStorage.removeItem('loginForm');
  }
  authStore.setToken(data);
  try {
    if (route.query.redirect) {
      const path: string = route.query.redirect as string;
      delete route.query.redirect;
      router.push({ path, query: route.query });
    } else {
      router.push('/');
    }
  } catch (error) {
    console.error(error);
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/login/form-common.scss';

.modern-login-form {
  @extend .modern-form;

  // 使用公共样式
  .decorative-bg {
    @extend .decorative-bg;
  }

  .form-title-section {
    @extend .form-title-section;
  }

  .login-form-container {
    .form-item {
      .modern-input {
        @extend .modern-input;
      }
    }

    .form-options {
      .forgot-password {
        font-size: 14px;
        font-weight: 600;
        padding: 0;
        height: auto;
        transition: all 0.3s ease;

        :deep(.n-button__content) {
          color: #3b82f6;
        }

        &:hover {
          :deep(.n-button__content) {
            color: #2563eb;
          }
        }
      }
    }

    .button-group {
      .login-button {
        @extend .modern-button, .primary;
      }

      .experience-button {
        @extend .modern-button, .secondary;
      }
    }

    .register-section {
      padding-top: 24px;
      border-top: 1px solid #f1f5f9;
      text-align: center;
      transition: border-color 0.3s ease;

      span {
        color: #64748b;
        font-size: 15px;
        transition: color 0.3s ease;
      }

      .register-link {
        font-weight: 700;
        padding: 0;
        height: auto;
        margin-left: 6px;
        transition: all 0.3s ease;

        :deep(.n-button__content) {
          color: #3b82f6;
        }

        &:hover {
          :deep(.n-button__content) {
            color: #2563eb;
          }
          transform: translateX(2px);
        }
      }
    }
  }
}

// 深色模式下的登录表单样式
.login-dark .modern-login-form {
  .login-form-container {
    .form-options {
      .forgot-password {
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

    .register-section {
      border-top: 1px solid rgba(255, 255, 255, 0.1);

      span {
        color: rgba(255, 255, 255, 0.7);
      }

      .register-link {
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
