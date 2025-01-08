<template>
  <div class="h-full">
    <n-grid x-gap="12" cols="1 l:12" responsive="screen" item-responsive>
      <n-gi span="1 m:4">
        <AppCard bordered class="p-24px">
          <div class="user-info flex flex-col items-center">
            <n-avatar :src="userInfo?.avatar" round :size="140"></n-avatar>
            <!-- 首先展示用户昵称，没有的话展示用户名 -->
            <div class="flex-center text-28px font-bold">
              {{ userInfo?.name || userInfo?.username }}
            </div>
            <n-table bordered :single-line="false">
              <tbody>
                <tr v-for="(item, index) in userTableDetail" :key="index">
                  <td class="flex items-center">
                    <JayIcon :icon="item.icon" class="mr-6px"></JayIcon>
                    <span>
                      {{ item.title }}
                    </span>
                  </td>
                  <td>{{ item.content }}</td>
                </tr>
              </tbody>
            </n-table>
          </div>
        </AppCard>
        <AppCard bordered class="my-12px p-24px">
          <div>1111</div>
          <div>1111</div>
          <div>1111</div>
          <div>1111</div>
        </AppCard>
      </n-gi>
      <n-gi span="1 m:8">
        <AppCard bordered class="p-24px min-h-full">
          <n-tabs
            type="line"
            animated
            placement="left"
            :default-value="'1'"
            :value="tabValue"
            :on-update:value="handleChangeTab"
          >
            <n-tab-pane v-for="tab in tabs" :key="tab.key" :name="tab.key" :tab="tab.label">
              <div class="flex flex-col px-24px">
                <BasicSetting v-show="tab.key === '1'"></BasicSetting>
                <SecuritySetting
                  v-show="tab.key === '2'"
                  @edit-basic="handleChangeTab('1')"
                  @edit-password="handleChangeTab('3')"
                >
                </SecuritySetting>
                <PasswordSetting v-show="tab.key === '3'"></PasswordSetting>
              </div>
            </n-tab-pane>
          </n-tabs>
        </AppCard>
      </n-gi>
    </n-grid>

    <n-flex v-if="userInfo.roleType !== 'admin'" class="mt-30px" align="center" justify="center">
      <n-button type="primary" @click="router.back()">返回</n-button>
    </n-flex>
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
    title: $t('modules.appCenter.info.organization'),
    icon: 'ph:buildings-duotone',
    content: '...',
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

const handleChangeTab = (key: string) => {
  tabValue.value = key;
};

onMounted(() => {});
</script>

<style scoped lang="scss"></style>
