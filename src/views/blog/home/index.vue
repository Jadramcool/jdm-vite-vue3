<template>
  <div class="blog-home">
    <Wave></Wave>
    <div class="page-container">
      <div class="content">
        <div class="left-side flex-y-end">
          <div class="flex-col gap-20px">
            <Component
              v-for="module in leftModules"
              :key="module.key"
              :is="getComponentByKey(module.key)"
              v-bind="getComponentProps(module.key)"
            />
            <!-- <UserInfo key="user-profile" :blog-user="blogUser" :blog-stat="blogStat" />
            <BlogCategories key="category-nav"></BlogCategories> -->
          </div>
        </div>
        <div class="divider mx-20px"></div>
        <div class="right-side flex-col gap-10px">
          <n-space vertical :size="20">
            <Component
              v-for="module in rightModules"
              :key="module.key"
              :is="getComponentByKey(module.key)"
              v-bind="getComponentProps(module.key)"
            />
            <div class="divider my-16px w-100% border-1px border-dashed border-gray-300"></div>
          </n-space>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BlogApi, NoticeApi } from '@/api';
import { useBlogConfigStore } from '@/store';
import { Wave } from './components';
import { BlogCategories, BlogPosts, NoticeScroll, UserInfo } from './modules';

/**
 * 根据组件键获取对应的组件
 * @param key 组件键
 * @returns Vue组件
 */
const getComponentByKey = (key: string) => {
  const componentMap: Record<string, any> = {
    'user-profile': UserInfo,
    'category-nav': BlogCategories,
    'recent-posts': BlogPosts,
    notice: NoticeScroll,
    ...categorySlugs.value.reduce((acc, slug) => ({ ...acc, [slug]: BlogPosts }), {}),
  };
  return componentMap[key] || null;
};

/**
 * 根据组件键获取对应的属性
 * @param key 组件键
 * @returns 组件属性对象
 */
const getComponentProps = (key: string) => {
  const propsMap: Record<string, any> = {
    'user-profile': { blogUser: blogUser.value, blogStat: blogStat.value },
    notice: {
      notices: noticeList.value,
      interval: 5000,
      autoStart: true,
      showIcon: true,
      onClick: handleNoticeClick,
    },
    ...categorySlugs.value.reduce(
      (acc, slug) => ({
        ...acc,
        [slug]: { categoryId: categoryIdMap.value[slug], title: categoryTitleMap.value[slug] },
      }),
      {},
    ),
  };
  console.log('🚀 ~ getComponentProps ~ propsMap:', propsMap);
  return propsMap[key] || {};
};

interface BlogStat {
  title: string;
  count: number;
  key: string;
}

const blogConfigStore = useBlogConfigStore();

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

// 首页装修
const homeDecoration = computed(() => JSON.parse(blogConfigStore.getConfigValue('decoration')));

const leftModules = computed(() => homeDecoration.value.leftModules || []);
const rightModules = computed(() => homeDecoration.value.rightModules || []);

const noticeList = ref<Notice.Notice[]>([]);
const categoryIdMap = ref<Record<string, number>>({});
const categorySlugs = ref<string[]>([]);
const categoryTitleMap = ref<Record<string, string>>({});

// 加载状态
const loading = ref(true);

// 通知事件处理
const handleNoticeClick = (notice: Notice.Notice | string, index: number) => {
  console.log('通知被点击:', notice, index);

  // 这里可以添加更多的点击通知处理逻辑，比如：
  // - 跳转到通知详情页
  // - 标记通知为已读
  // - 打开相关页面等
};

const init = async () => {
  try {
    loading.value = true;
    // 并行获取数据
    const [userResult, statsResult, noticeResult, categoryResult] = await Promise.all([
      BlogApi.getBlogUser(),
      BlogApi.getOverviewStats(),
      NoticeApi.noticeList(),
      BlogApi.getCategoryList({
        options: {
          showPagination: false,
        },
      }),
    ]);
    console.log('🚀 ~ init ~ categoryResult:', categoryResult.data);
    blogUser.value = userResult;

    if (categoryResult && categoryResult.data && categoryResult.data.length > 0) {
      categoryResult.data.forEach((item) => {
        categorySlugs.value.push(item.slug);
        categoryTitleMap.value[item.slug] = item.name;
        categoryIdMap.value[item.slug] = item.id;
      });
    }
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
