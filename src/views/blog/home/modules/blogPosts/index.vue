<template>
  <div class="content-module">
    <div class="title flex-between">
      <div class="flex-x-end">
        <JayIcon icon="material-symbols:view-comfy-alt-rounded" type="primary" :size="24" />
        <span class="ml-8px">{{ title }}</span>
      </div>
      <div class="more flex-x-end cursor-pointer">
        <JayIcon icon="gg:chevron-double-right" type="primary" :size="24" />
        <span>MORE</span>
      </div>
    </div>
    <n-flex class="content" :size="20">
      <PostCard v-for="post in blogPosts" :key="post.id" :post="post" @click="handlePostDetail" />
    </n-flex>
  </div>
</template>

<script setup lang="ts">
import { BlogApi } from '@/api';
import { useBlogConfigStore } from '@/store';
import { useRouter } from 'vue-router';
import PostCard from './components/PostCard.vue';

const router = useRouter();
const blogConfigStore = useBlogConfigStore();

interface Props {
  categoryId?: number;
  title?: string;
}

const { categoryId = 0, title = '最近文章' } = defineProps<Props>();

onMounted(async () => {
  await init();
});

const blogPosts = ref<Blog.Post[]>([]);

const init = async () => {
  const postPerPage = blogConfigStore.getConfigValue('posts_per_page');
  const posts = await BlogApi.getPostList({
    filters: {
      status: 'PUBLISHED',
      categoryId: categoryId > 0 ? categoryId : undefined,
    },
    pagination: {
      page: 1,
      pageSize: postPerPage,
    },
  });
  blogPosts.value = posts.data;
};

const handlePostDetail = (post: Blog.Post) => {
  router.push({
    path: `/blog/post/detail/${post.id}`,
  });
};
</script>

<style lang="scss" scoped>
.content-module {
  display: flex;
  flex-direction: column;
  gap: 10px;
  .more {
    transition: all 0.2s ease-in-out;

    &:hover {
      color: var(--primary-color);
      transform: scale(1.1);
    }
  }
}
</style>
