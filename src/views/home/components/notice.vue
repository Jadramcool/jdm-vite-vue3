<template>
  <n-card :title="$t('modules.home.notice')" class="notice" bordered hoverable>
    <template #header-extra>
      <n-button text type="primary" size="small" @click="handleMore">{{
        $t('common.more')
      }}</n-button>
    </template>
    <n-list>
      <n-list-item v-for="notice in notices" :key="notice.id">
        <n-flex justify="space-between" align="center">
          <n-space align="center">
            <n-tag :bordered="false" :type="NoticeTypeColorMap[notice.notice.type]">
              {{ NoticeType[notice.notice.type] }}
            </n-tag>

            <n-tooltip trigger="hover" :disabled="!notice.notice.content">
              <template #trigger>
                <n-button text tag="a" @click="handleRead(notice)">
                  {{ notice.notice.title }}
                </n-button>
              </template>
              {{ notice.notice.content }}
            </n-tooltip>
          </n-space>
          <n-tag
            :type="GlobalStatusOptions[notice.readTime ? 1 : 0]"
            size="small"
            :bordered="false"
          >
            {{ $t(`modules.notice.notice.readTypeMap.${notice.readTime ? 'read' : 'unread'}`) }}
          </n-tag>
        </n-flex>
      </n-list-item>
    </n-list>
  </n-card>
</template>

<script setup lang="ts">
import { NoticeApi } from '@/api';
import { GlobalStatusOptions, NoticeType, NoticeTypeColorMap } from '@/constants';
import { $t } from '@/locales';

const notices = ref<Notice.UserNotice[]>([]);

onMounted(() => {
  getNotice();
});

// 更多
const handleMore = () => {
  window.$notification.info({
    title: '更多等待开发',
    duration: 3000,
    keepAliveOnHover: true,
  });
};

// 获取通知
const getNotice = async () => {
  const data = {
    pagination: {
      page: 1,
      pageSize: 4,
    },
  };
  const res = await NoticeApi.getUserNotice(data);
  notices.value = res.data;
};

// 阅读
const handleRead = async (notice: Notice.UserNotice) => {
  if (notice.readTime) return;
  try {
    await NoticeApi.updateUserNoticeRead({ id: notice.noticeId });
    notice.readTime = new Date().toISOString();
  } catch (error) {
    console.log(error);
  }
};
</script>

<style lang="scss" scoped></style>
