<template>
  <div>
    <Wave></Wave>
    <div class="content">
      <div class="left-side flex-y-end">
        <div class="my-info w-280px h-300px flex box-shadow card-hover-lift">
          <n-avatar class="avatar" :size="120" round :src="blogUser?.avatar">
            <template #placeholder></template>
          </n-avatar>
          <div class="name text-30px font-bold">{{ blogUser?.name || 'Jay1' }}</div>
          <div class="info mt-10px w-100%">
            <div class="flex justify-around">
              <div v-for="item in blogStat" :key="item.title" class="desc text-center text-16px">
                <div class="title">{{ item.title }}</div>
                <div class="count font-bold">{{ item.count }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="divider mx-20px"></div>
      <div class="right-side">
        <n-space vertical :size="20">
          <NoticeScroll
            :notices="noticeList"
            :interval="5000"
            :auto-start="true"
            :show-icon="true"
            @notice-click="handleNoticeClick"
          />
          <div class="right-content">
            <div class="title flex-between">
              <div class="flex-x-end">
                <JayIcon icon="material-symbols:view-comfy-alt-rounded" type="primary" :size="24" />
                <span class="ml-8px">最近文章</span>
              </div>
              <div class="more flex-x-end cursor-pointer">
                <JayIcon icon="gg:chevron-double-right" type="primary" :size="24" />
                <span>MORE</span>
              </div>
            </div>
            <div class="divider mt-8px w-100% border-1px border-dashed border-gray-300"></div>
          </div>

          <BlogPosts></BlogPosts>
        </n-space>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BlogApi, NoticeApi } from '@/api';
import { NoticeScroll, Wave } from './components';
import { BlogPosts } from './modules';

interface BlogStat {
  title: string;
  count: number;
  key: string;
}

onMounted(async () => {
  await init();
});

const blogUser = ref<System.User>();

// 使用明确的类型定义和默认值
const blogStat = ref<BlogStat[]>([
  {
    title: '文章',
    key: 'totalPosts',
    count: 0,
  },
  {
    title: '标签',
    key: 'totalTags',
    count: 0,
  },
  {
    title: '分类',
    key: 'totalCategories',
    count: 0,
  },
]);

const noticeList = ref<Notice.Notice[]>([]);

// 加载状态
const loading = ref(true);

// 通知事件处理
const handleNoticeClick = (notice: Notice.Notice | string, index: number) => {
  console.log('通知被点击:', notice, index);
  // 这里可以添加点击通知的处理逻辑，比如跳转到详情页
};

const init = async () => {
  try {
    loading.value = true;

    // 并行获取数据
    const [userResult, statsResult, noticeResult] = await Promise.all([
      BlogApi.getBlogUser(),
      BlogApi.getOverviewStats(),
      NoticeApi.noticeList(),
    ]);
    blogUser.value = userResult;

    if (statsResult) {
      blogStat.value = blogStat.value.map((item) => ({
        ...item,
        count: statsResult[item.key as keyof typeof statsResult] || 0,
      }));
    }
    if (noticeResult && noticeResult.data && noticeResult.data.length > 0) {
      noticeList.value = noticeResult.data;
    } else {
      console.log('没有获取到通知数据，使用测试数据');
      noticeList.value = [];
    }
  } catch (error) {
    console.error('获取博客数据失败:', error);
    // 可以添加错误提示
  } finally {
    loading.value = false;
  }
};

// NoticeScroll 组件会自动处理生命周期，无需手动清理
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: row;
  height: 100%;
  padding: 20px 10%;
  .left-side {
    flex: 1;
    height: 100%;
    .my-info {
      background: linear-gradient(135deg, #ff6b6b, #ffb86c);
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .avatar {
        border: 5px solid #f6ebeb;
        border-radius: 50%;
        transition: transform 0.5s ease-in-out;
        cursor: pointer;
        &:hover {
          transform: rotate(360deg) scale(1.1);
        }
      }
    }
  }
  .right-side {
    flex: 2;
    height: 100%;

    .more {
      transition: all 0.2s ease-in-out;
    }

    .more:hover {
      color: var(--primary-color);
      transform: scale(1.1);
    }
  }
}
</style>
