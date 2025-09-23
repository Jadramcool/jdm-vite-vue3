<template>
  <div class="blog-home">
    <Wave></Wave>
    <div class="page-container">
      <div class="content">
        <div class="left-side flex-y-end">
          <div class="flex-col gap-20px">
            <div class="my-info w-280px h-300px flex box-shadow card-hover-lift">
              <n-avatar class="avatar" :size="120" round :src="blogUser?.avatar">
                <template #placeholder></template>
              </n-avatar>
              <div class="name text-30px font-bold">{{ blogUser?.name || 'Jay1' }}</div>
              <div class="info mt-10px w-100%">
                <div class="flex justify-around">
                  <div
                    v-for="item in blogStat"
                    :key="item.title"
                    class="desc text-center text-16px"
                  >
                    <div class="title">{{ item.title }}</div>
                    <div class="count font-bold">{{ item.count }}</div>
                  </div>
                </div>
              </div>
            </div>
            <BlogCategories></BlogCategories>
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
              <div class="content-module flex-col gap-10px">
                <div class="title flex-between">
                  <div class="flex-x-end">
                    <JayIcon
                      icon="material-symbols:view-comfy-alt-rounded"
                      type="primary"
                      :size="24"
                    />
                    <span class="ml-8px">最近文章</span>
                  </div>
                  <div class="more flex-x-end cursor-pointer">
                    <JayIcon icon="gg:chevron-double-right" type="primary" :size="24" />
                    <span>MORE</span>
                  </div>
                </div>
                <BlogPosts></BlogPosts>
              </div>
              <div class="divider my-16px w-100% border-1px border-dashed border-gray-300"></div>
            </div>
          </n-space>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BlogApi, NoticeApi } from '@/api';
import { NoticeScroll, Wave } from './components';
import { BlogCategories, BlogPosts } from './modules';

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
      noticeList.value = [
        {
          id: 1,
          title: '暂无通知',
          content: '暂无通知',
          type: 'notice',
          status: 1,
          createdTime: new Date(),
          updatedTime: new Date(),
        },
      ];
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
.blog-home {
  min-height: 100vh;
  width: 100%;
}

.page-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
}

.content {
  display: flex;
  flex-direction: row;
  height: 100%;
  padding: 20px 0;
  gap: 20px;

  .left-side {
    flex: 0 0 320px;
    min-width: 320px;
    height: 100%;

    .my-info {
      background-image: linear-gradient(0deg, #fdcbf1 0%, #fdcbf1 1%, #e6dee9 100%);
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
    flex: 1;
    min-width: 0;
    height: 100%;

    .more {
      transition: all 0.2s ease-in-out;

      &:hover {
        color: var(--primary-color);
        transform: scale(1.1);
      }
    }
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .page-container {
    max-width: 1000px;
    padding: 0 16px;
  }
}

@media (max-width: 992px) {
  .page-container {
    padding: 0 12px;
  }

  .content {
    gap: 16px;

    .divider {
      margin: 0 16px;
    }
  }
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
    gap: 24px;

    .left-side {
      flex: none;
      min-width: auto;

      .my-info {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
      }
    }

    .divider {
      width: 100%;
      height: 1px;
      margin: 0;
      background: linear-gradient(to right, transparent, #e5e7eb, transparent);
    }

    .right-side {
      flex: none;
    }
  }
}

@media (max-width: 480px) {
  .page-container {
    padding: 0 8px;
  }

  .content {
    padding: 16px 0;
    gap: 20px;
  }

  .left-side .my-info {
    width: 100%;
    height: auto;
    min-height: 280px;
    padding: 20px;
  }
}
</style>
