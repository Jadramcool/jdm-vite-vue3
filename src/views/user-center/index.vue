<template>
  <div class="h-full user-center-container">
    <n-grid x-gap="20" y-gap="20" cols="1 l:12" responsive="screen" item-responsive>
      <n-gi span="1 m:4">
        <AppCard bordered class="user-profile-card">
          <div class="user-info">
            <!-- 用户头像区域 -->
            <div class="avatar-section">
              <div class="avatar-wrapper">
                <n-avatar :src="userInfo?.avatar" round :size="120" class="user-avatar">
                  <template #fallback>
                    <JayIcon icon="solar:user-bold" :size="60" />
                  </template>
                </n-avatar>
              </div>
            </div>

            <!-- 用户基本信息 -->
            <div class="user-basic-info">
              <h2 class="user-name">
                {{ userInfo?.name || userInfo?.username }}
              </h2>
              <p class="user-role">
                {{ userInfo?.roles?.map((item) => item.name).join(' · ') || '普通用户' }}
              </p>
            </div>

            <!-- 用户详细信息卡片 -->
            <div class="user-details">
              <div v-for="(item, index) in userTableDetail" :key="index" class="detail-item">
                <div class="detail-icon">
                  <JayIcon :icon="item.icon" :size="18" />
                </div>
                <div class="detail-content">
                  <span class="detail-label">{{ item.title }}</span>
                  <span class="detail-value">{{ item.content }}</span>
                </div>
              </div>
            </div>
          </div>
        </AppCard>
      </n-gi>
      <n-gi span="1 m:8">
        <AppCard bordered class="settings-card">
          <template #header>
            <div class="settings-header">
              <JayIcon icon="solar:settings-bold" :size="20" class="mr-8px" />
              <span class="settings-title">账户设置</span>
            </div>
          </template>

          <n-tabs
            type="card"
            animated
            :default-value="'1'"
            :value="tabValue"
            :on-update:value="handleChangeTab"
            class="settings-tabs"
          >
            <n-tab-pane v-for="tab in tabs" :key="tab.key" :name="tab.key">
              <template #tab>
                <div class="tab-label">
                  <JayIcon :icon="getTabIcon(tab.key)" :size="16" class="mr-6px" />
                  {{ tab.label }}
                </div>
              </template>

              <div class="tab-content">
                <Transition name="fade" mode="out-in">
                  <BasicSetting v-if="tab.key === '1'" key="basic" />
                  <SecuritySetting
                    v-else-if="tab.key === '2'"
                    key="security"
                    @edit-basic="handleChangeTab('1')"
                    @edit-password="handleChangeTab('3')"
                  />
                  <PasswordSetting v-else-if="tab.key === '3'" key="password" />
                </Transition>
              </div>
            </n-tab-pane>
          </n-tabs>
        </AppCard>
      </n-gi>
    </n-grid>

    <!-- 返回按钮 -->
    <div v-if="userInfo.roleType !== 'admin'" class="back-button-container">
      <n-button type="primary" size="large" @click="router.back()" class="back-button">
        <template #icon>
          <JayIcon icon="solar:arrow-left-bold" />
        </template>
        返回
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { $t } from '@/locales';
import { useUserStore } from '@/store';
import { useRouter } from 'vue-router';
import { BasicSetting, PasswordSetting, SecuritySetting } from './components';

defineOptions({ name: 'UserCenter' });

const router = useRouter();

const userStore = useUserStore();

const userInfo = computed(() => ({
  ...userStore.getUser,
}));

// 用户信息表格
const userTableDetail = computed(() => [
  {
    title: $t('modules.appCenter.info.role'),
    icon: 'solar:users-group-rounded-broken',
    content: userInfo.value?.roles?.map((item) => item.name).join(','),
  },
  {
    title: $t('user.phone'),
    icon: 'solar:phone-calling-outline',
    content: userInfo.value?.phone || '-',
  },
  {
    title: $t('user.email'),
    icon: 'ic:outline-attach-email',
    content: userInfo.value?.email || '-',
  },
  {
    title: $t('user.addressDetail'),
    icon: 'solar:buildings-3-linear',
    content: userInfo.value?.addressDetail || '-',
  },
]);

const tabs = computed(() => [
  {
    key: '1',
    label: $t('modules.appCenter.info.basicSetting'),
  },
  {
    key: '2',
    label: $t('modules.appCenter.info.securitySetting'),
  },
  {
    key: '3',
    label: $t('modules.appCenter.info.passwordSetting'),
  },
]);

const tabValue = ref<string>();

/**
 * 处理标签页切换
 * @param key 标签页键值
 */
const handleChangeTab = (key: string) => {
  tabValue.value = key;
};

/**
 * 获取标签页图标
 * @param tabKey 标签页键值
 * @returns 图标名称
 */
const getTabIcon = (tabKey: string): string => {
  const iconMap: Record<string, string> = {
    '1': 'solar:user-circle-bold',
    '2': 'solar:shield-check-bold',
    '3': 'solar:lock-password-bold',
  };
  return iconMap[tabKey] || 'solar:settings-bold';
};

onMounted(() => {
  // 默认选中第一个标签页
  tabValue.value = '1';
});
</script>

<style scoped lang="scss">
.user-center-container {
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

// 用户资料卡片样式
.user-profile-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 32px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

// 头像区域样式
.avatar-section {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.user-avatar {
  border: 4px solid #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  }
}

.avatar-status {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: white;
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

// 用户基本信息样式
.user-basic-info {
  text-align: center;
  margin-bottom: 8px;
}

.user-name {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-role {
  font-size: 16px;
  color: #718096;
  margin: 0;
  font-weight: 500;
}

// 用户详细信息样式
.user-details {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateX(4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
}

.detail-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  color: white;
  margin-right: 16px;
  flex-shrink: 0;
}

.detail-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.detail-label {
  font-size: 14px;
  color: #718096;
  font-weight: 500;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 16px;
  color: #2d3748;
  font-weight: 600;
  word-break: break-all;
}

// 设置卡片样式
.settings-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  min-height: 600px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
}

.settings-header {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.settings-title {
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
}

.settings-tabs {
  :deep(.n-tabs-nav) {
    background: transparent;
  }

  :deep(.n-tab) {
    border-radius: 12px;
    margin-right: 8px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
    }
  }
}

.tab-label {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.tab-content {
  padding: 24px;
  min-height: 400px;
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

// 返回按钮样式
.back-button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
  padding: 20px;
}

.back-button {
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(24, 144, 255, 0.4);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .user-center-container {
    padding: 16px;
  }

  .user-profile-card,
  .settings-card {
    padding: 20px;
  }

  .user-name {
    font-size: 24px;
  }

  .detail-item {
    padding: 12px;
  }

  .tab-content {
    padding: 16px;
  }
}
</style>
