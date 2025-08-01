<template>
  <div>
    <n-flex class="content">
      <div
        class="post-card w-[300px] rounded-2xl overflow-auto card-hover-float shadow-lg hover:shadow-strong relative"
        v-for="post in blogPosts"
        :key="post.id"
        @click="handlePostDetail(post)"
      >
        <!-- 置顶标签 -->
        <div
          v-if="post.isTop"
          class="absolute top-10px left-10px z-10 bg-red-500 text-white px-8px py-4px rounded-md text-xs font-bold flex-x-center shadow-md"
        >
          <JayIcon icon="material-symbols:push-pin" class="mr-4px" :size="14" />
          置顶
        </div>
        <div class="post-cover overflow-hidden h-200px">
          <img
            class="w-full h-full object-cover hover:(scale-130) transition-all duration-300 cursor-pointer"
            :src="
              post.coverImage ? post.coverImage + '?x-oss-process=image/resize,h_300' : homeBgUrl
            "
            alt="post-cover"
          />
        </div>
        <div class="post-content p-10px">
          <div class="post-date flex-x-center">
            <JayIcon icon="material-symbols:calendar-month-outline-rounded" />
            <span class="lh-18px ml-10px">{{
              dayjs(post.publishedAt).format('YYYY-MM-DD HH:mm:ss')
            }}</span>
          </div>
          <div class="post-title text-lg font-bold my-16px">{{ post.title }}</div>
          <div class="post-meta flex text-muted">
            <div class="hot flex-x-center">
              <JayIcon icon="twemoji:fire" />
              <span class="ml-5px lh-18px">{{ post.likeCount }}</span>
              <span class="ml-5px lh-18px">热度</span>
            </div>
            <div class="comment-count flex-x-center ml-20px">
              <JayIcon icon="fxemoji:openbook" />
              <span class="ml-5px lh-18px">{{ post.commentCount }}</span>
              <span class="ml-5px lh-18px">评论</span>
            </div>
          </div>
          <n-space class="post-tag flex-x-center mt-10px">
            <div v-for="tag in post.tags" :key="tag.id" class="tag flex-x-center">
              <div
                class="tag-text flex-x-center px-6px py-2px text-secondary rounded-md bg-[#EEEEEE] hover:bg-[#E0E0E0] transition-all duration-300"
              >
                <JayIcon :icon="tag?.icon" />
                <span class="ml-5px">{{ tag?.name }}</span>
              </div>
            </div>
          </n-space>
        </div>
      </div>
    </n-flex>
  </div>
</template>

<script setup lang="ts">
import { BlogApi } from '@/api';
import homeBgUrl from '@/assets/images/blog/home_bg.png';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(async () => {
  await init();
});

const blogPosts = ref<Blog.Post[]>([]);

const init = async () => {
  const posts = await BlogApi.getPostList({
    filters: {
      status: 'PUBLISHED',
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

<style lang="scss" scoped></style>
