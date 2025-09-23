<template>
  <div class="blog-categories">
    <h3 class="title">文章分类</h3>
    <ul class="category-list">
      <li v-for="category in categories" :key="category.id" class="category-item">
        <span class="category-name">{{ category.name }}</span>
        <span class="category-count">({{ category.postCount }})</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { BlogApi } from '@/api';

onMounted(async () => {
  await init();
});

const categories = ref<Blog.Category[]>([]);

const init = async () => {
  const categoryList = await BlogApi.getCategoryList({
    filters: {
      status: 'PUBLISHED',
    },
  });
  categories.value = categoryList.data.filter((item) => item.postCount > 0);
};
</script>

<style scoped lang="scss">
.blog-categories {
  padding: 20px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 16px;
    color: #333;
  }

  .category-list {
    list-style: none;
    padding: 0;
    margin: 0;

    .category-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      transition: all 0.3s;

      .category-name {
        color: #666;
        &:hover {
          color: #409eff;
        }
      }

      .category-count {
        color: #999;
        &:hover {
          color: #409eff;
        }
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
