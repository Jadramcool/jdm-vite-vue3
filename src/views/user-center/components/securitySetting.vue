<template>
  <div class="security-setting-container">
    <n-card class="security-card">
      <template #header>
        <div class="card-header">
          <JayIcon icon="solar:shield-check-bold" class="header-icon" />
          <span class="header-title">{{ $t('modules.appCenter.securitySetting.title') }}</span>
        </div>
      </template>
      <div class="security-items">
        <!-- 实名认证 -->
        <div class="security-item">
          <div class="item-left">
            <div class="item-icon verified">
              <JayIcon icon="solar:verified-check-bold" />
            </div>
            <div class="item-content">
              <div class="item-title">
                {{ $t('modules.appCenter.securitySetting.realNameAuth') }}
              </div>
              <div class="item-desc">
                {{ $t('modules.appCenter.securitySetting.authInfo') }}{{ userInfo.name || '-' }}
              </div>
            </div>
          </div>
          <div class="item-right">
            <n-tag :type="userInfo.name ? 'success' : 'error'" size="medium" class="status-tag">
              <template #icon>
                <JayIcon
                  :icon="userInfo.name ? 'solar:check-circle-bold' : 'solar:close-circle-bold'"
                />
              </template>
              {{
                userInfo.name
                  ? $t('modules.appCenter.securitySetting.authSuccess')
                  : $t('modules.appCenter.securitySetting.authFailed')
              }}
            </n-tag>
          </div>
        </div>
        <!-- 登录密码 -->
        <div class="security-item">
          <div class="item-left">
            <div class="item-icon password">
              <JayIcon icon="solar:lock-password-bold" />
            </div>
            <div class="item-content">
              <div class="item-title">{{ $t('modules.appCenter.securitySetting.password') }}</div>
              <div class="item-desc">{{ $t('modules.appCenter.securitySetting.passwordTip') }}</div>
            </div>
          </div>
          <div class="item-right">
            <n-button
              type="primary"
              size="medium"
              class="action-button"
              @click="handleEditPassword"
            >
              <template #icon>
                <JayIcon icon="solar:pen-bold" />
              </template>
              {{ $t('common.edit') }}
            </n-button>
          </div>
        </div>
        <!-- 手机号 -->
        <div class="security-item">
          <div class="item-left">
            <div class="item-icon phone">
              <JayIcon icon="solar:phone-bold" />
            </div>
            <div class="item-content">
              <div class="item-title">{{ $t('modules.appCenter.securitySetting.phone') }}</div>
              <div class="item-desc">
                {{ $t('modules.appCenter.securitySetting.phoneInfo')
                }}{{ maskPhone(userInfo.phone) || '-' }}
              </div>
            </div>
          </div>
          <div class="item-right">
            <n-button type="primary" size="medium" class="action-button" @click="handleEditBasic">
              <template #icon>
                <JayIcon icon="solar:pen-bold" />
              </template>
              {{ $t('common.edit') }}
            </n-button>
          </div>
        </div>
        <!-- 邮箱 -->
        <div class="security-item">
          <div class="item-left">
            <div class="item-icon email">
              <JayIcon icon="solar:letter-bold" />
            </div>
            <div class="item-content">
              <div class="item-title">{{ $t('modules.appCenter.securitySetting.email') }}</div>
              <div class="item-desc">
                {{ $t('modules.appCenter.securitySetting.emailInfo') }}{{ userInfo.email || '-' }}
              </div>
            </div>
          </div>
          <div class="item-right">
            <n-button type="primary" size="medium" class="action-button" @click="handleEditBasic">
              <template #icon>
                <JayIcon icon="solar:pen-bold" />
              </template>
              {{ $t('common.edit') }}
            </n-button>
          </div>
        </div>
      </div>
    </n-card>
  </div>
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

<style scoped lang="scss">
.security-setting-container {
  .security-card {
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;

      .header-icon {
        font-size: 20px;
        color: #1890ff;
      }

      .header-title {
        font-size: 16px;
        font-weight: 600;
        color: #262626;
      }
    }
  }

  .security-items {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .security-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      border-color: #d9d9d9;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    .item-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .item-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;

        &.verified {
          background: linear-gradient(135deg, #52c41a, #73d13d);
          color: white;
        }

        &.password {
          background: linear-gradient(135deg, #fa8c16, #ffa940);
          color: white;
        }

        &.phone {
          background: linear-gradient(135deg, #1890ff, #40a9ff);
          color: white;
        }

        &.email {
          background: linear-gradient(135deg, #722ed1, #9254de);
          color: white;
        }
      }

      .item-content {
        .item-title {
          font-size: 14px;
          font-weight: 500;
          color: #262626;
          margin-bottom: 4px;
        }

        .item-desc {
          font-size: 12px;
          color: #8c8c8c;
          line-height: 1.4;
        }
      }
    }

    .item-right {
      .status-tag {
        border-radius: 6px;
        font-weight: 500;
      }

      .action-button {
        border-radius: 6px;
        font-weight: 500;
        padding: 0 16px;
        height: 32px;
      }
    }
  }
}
</style>
