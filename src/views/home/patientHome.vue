<template>
  <div>
    <n-grid x-gap="12" cols="1 l:12" responsive="screen" item-responsive class="mt-10px">
      <n-gi span="1 m:4">
        <n-space vertical>
          <AppCard bordered class="p-24px relative">
            <div class="absolute right-20px" @click="handleEditUserInfo">
              <n-button>去编辑</n-button>
            </div>
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
          <Notice></Notice>
        </n-space>
      </n-gi>
      <n-gi span="1 m:8">
        <n-space vertical>
          <Welcome :show-avatar="false"></Welcome>
          <n-grid cols="3" x-gap="12">
            <n-gi span="1">
              <AppCard hoverable bordered class="p-24px" @click="handleJump('appointment')">
                立即挂号
              </AppCard>
            </n-gi>
            <n-gi span="1">
              <AppCard bordered hoverable class="p-24px" @click="handleJump('my-appointment')">
                我的挂号
              </AppCard>
            </n-gi>
            <n-gi span="1">
              <AppCard hoverable bordered class="p-24px" @click="handleJump('cases')">
                我的病例
              </AppCard>
            </n-gi>
          </n-grid>
        </n-space>
      </n-gi>
    </n-grid>
  </div>
</template>
<script setup lang="tsx">
import { $t } from '@/locales';
import { useUserStore } from '@/store';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { Notice, Welcome } from './components';

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
    title: $t('user.birthday'),
    icon: 'icon-park-outline:birthday-cake',
    content: dayjs(userInfo.value?.birthday).format('YYYY-MM-DD') || '-',
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

const handleEditUserInfo = () => {
  // 跳转到编辑用户信息页面
  router.push('/user-center');
};

const handleJump = (path: string) => {
  router.push(`/patient/${path}`);
};
</script>
