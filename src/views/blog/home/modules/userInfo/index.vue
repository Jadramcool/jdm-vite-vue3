<template>
  <div class="user-info-module">
    <div class="my-info w-280px h-300px flex box-shadow card-hover-lift">
      <n-avatar class="avatar" :size="120" round :src="blogUser?.avatar">
        <template #placeholder></template>
      </n-avatar>
      <div class="name text-30px font-bold">{{ blogUser?.name || 'Jay1' }}</div>
      <div class="info mt-10px w-100%">
        <div class="flex justify-around">
          <div v-for="item in blogStat" :key="item.title" class="desc text-center text-16px">
            <div class="title text-gray-600 mb-5px">{{ item.title }}</div>
            <div class="count font-bold text-blue-600">{{ item.count }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface BlogStat {
  title: string;
  count: number;
  key: string;
}

interface Props {
  // 博客用户信息
  blogUser?: System.User;
  // 博客统计数据
  blogStat?: BlogStat[];
}

// 接收Props
const { blogUser, blogStat } = defineProps<Props>();
</script>

<style lang="scss" scoped>
.user-info-module {
  .my-info {
    background-image: linear-gradient(0deg, #fdcbf1 0%, #fdcbf1 1%, #e6dee9 100%);
    @apply relative
      flex-col items-center justify-center p-20px bg-white rounded-12px;

    .avatar {
      @apply mb-15px;
    }

    .name {
      @apply text-center mb-10px;
    }
  }
}
</style>
