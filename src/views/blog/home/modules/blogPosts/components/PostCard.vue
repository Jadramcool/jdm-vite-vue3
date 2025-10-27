<template>
  <div
    class="post-card rounded-2xl overflow-auto card-hover-float shadow-lg hover:shadow-strong relative"
    @click="handleClick"
  >
    <!-- 置顶标签 -->
    <div
      v-if="post.isTop"
      class="absolute top-10px left-10px z-10 bg-red-500 text-white px-8px py-4px rounded-md text-xs font-bold flex-x-center shadow-md"
    >
      <JayIcon icon="material-symbols:push-pin" class="mr-4px" :size="14" />
      置顶
    </div>

    <!-- 封面图片 -->
    <div class="post-cover overflow-hidden h-200px">
      <img
        class="w-full h-full object-cover hover:(scale-130) transition-all duration-300 cursor-pointer"
        :src="coverImageUrl"
        alt="post-cover"
      />
    </div>

    <!-- 文章内容 -->
    <div class="post-content p-10px">
      <!-- 发布日期 -->
      <div class="post-date flex-x-center">
        <JayIcon icon="material-symbols:calendar-month-outline-rounded" />
        <span class="lh-18px ml-10px">{{
          dayjs(post.publishedAt).format('YYYY-MM-DD HH:mm:ss')
        }}</span>
      </div>

      <!-- 文章标题 -->
      <div class="post-title text-lg font-bold my-16px">{{ post.title }}</div>

      <!-- 文章元信息 -->
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

      <!-- 标签 -->
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
</template>

<script setup lang="ts">
import homeBgUrl from '@/assets/images/blog/home_bg.png';
import dayjs from 'dayjs';

/**
 * 博客文章卡片组件
 * 用于展示单个博客文章的信息
 */
defineOptions({ name: 'PostCard' });

interface Props {
  /** 博客文章数据 */
  post: Blog.Post;
}

interface Emits {
  /** 点击卡片事件 */
  (e: 'click', post: Blog.Post): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

/**
 * 计算封面图片URL
 * 如果文章有封面图片则使用，否则使用默认背景图
 */
const coverImageUrl = computed(() => {
  return props.post.coverImage
    ? `${props.post.coverImage}?x-oss-process=image/resize,h_300`
    : homeBgUrl;
});

/**
 * 处理卡片点击事件
 */
const handleClick = () => {
  emit('click', props.post);
};
</script>

<style lang="scss" scoped>
.post-card {
  flex: 1;
  min-width: 280px;
  cursor: pointer;
  transition: all 0.3s ease;
}
</style>
