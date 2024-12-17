<template>
  <n-card :title="$t('modules.home.todolist')" class="todo-list" bordered hoverable>
    <template #header-extra>
      <n-button text type="primary" size="small" @click="handleMore">{{
        $t('common.more')
      }}</n-button>
    </template>
    <n-timeline>
      <n-timeline-item
        v-for="(item, index) in todoTimeLine"
        :key="item.id"
        :type="index === todoTimeLine.length - 1 ? 'default' : 'success'"
        :title="item.title"
        :time="dayjs(item.doneTime).format('YYYY-MM-DD HH:mm:ss')"
        :lineType="index === todoTimeLine.length - 2 ? 'dashed' : 'default'"
      >
        <template #default>
          <n-tag size="small" type="success" :bordered="false">{{ item.parent?.title }}</n-tag>
        </template>
      </n-timeline-item>
    </n-timeline>
  </n-card>
</template>

<script setup lang="ts">
import { TodoApi } from '@/api';
import { $t } from '@/locales';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';

const router = useRouter();

const todoTimeLine = ref<Notice.Todo[]>([]);

onMounted(() => {
  getTodo();
});

// 更多
const handleMore = () => {
  router.push('/notice/todo');
};

// 获取通知
const getTodo = async () => {
  const res = await TodoApi.getTodoTimeLine();
  if (res.length > 2) {
    todoTimeLine.value = [...res.slice(0, 6), res[res.length - 1]];
  } else {
    todoTimeLine.value = res;
  }
  console.log('🚀 ~ getTodo ~ todoTimeLine.value:', todoTimeLine.value);
};
</script>

<style lang="scss" scoped></style>
