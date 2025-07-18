<template>
  <div>
    <div class="head-content flex-x-end pb-20px" :style="backgroundStyle">
      <div class="flex flex-col mx-auto w-50%">
        <div class="head-title text-white text-3xl font-bold">
          {{ post?.title }}
        </div>
        <n-divider></n-divider>
        <div class="head-info text-white">
          <n-space>
            <div class="flex-x-center">
              <JayIcon icon="twemoji:person-raising-hand" />
              <span class="ml-2">{{ post?.author.username }}</span>
            </div>
            <div class="flex-x-center">
              <JayIcon icon="fluent-emoji-flat:spiral-calendar" />
              <span class="ml-2">{{ dayjs(post?.publishedAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </div>
            <div class="flex-x-center">
              <JayIcon icon="twemoji:fire" />
              <span class="ml-2">{{ post?.likeCount }}</span>
              <span class="ml-2">热度</span>
            </div>
            <div class="flex-x-center">
              <JayIcon icon="fxemoji:openbook" />
              <span class="ml-2">{{ post?.commentCount }}</span>
              <span class="ml-2">评论</span>
            </div>
          </n-space>
        </div>
      </div>
    </div>
    <div class="content flex-y-center">
      <div ref="markdownRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BlogApi } from '@/api';
import homeBgUrl from '@/assets/images/blog/home_bg.png';
import dayjs from 'dayjs';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { useRoute } from 'vue-router';

defineOptions({ name: 'PostDetail' });

const backgroundStyle = computed(() => {
  const style: Record<string, string> = {
    height: `400px`,
  };
  style.backgroundImage = `url(${homeBgUrl})`;

  // 优先使用背景图片
  if (post.value?.coverImage) {
    style.backgroundImage = `url('${post.value.coverImage}')`;
  } else {
    style.backgroundImage = `url(${homeBgUrl})`;
  }

  style.backgroundSize = 'cover';
  style.backgroundPosition = 'center';
  style.backgroundRepeat = 'no-repeat';

  return style;
});

const route = useRoute();
const postId = Number(route.params.id);

const post = ref<Blog.Post>();

// markdown
const vditor = ref();
const markdownRef = ref<HTMLDivElement | null>(null);

onMounted(async () => {
  await init();
  initVditor();
});

onUnmounted(() => {
  const editorInstance = vditor.value;
  if (!editorInstance) return;
  try {
    editorInstance?.destroy?.();
  } catch (error) {
    console.log(error);
  }
});

const init = async () => {
  const res = await BlogApi.getPostById(postId);
  post.value = res;
};

const initVditor = () => {
  Vditor.preview(markdownRef.value as HTMLDivElement, post.value?.content as string, {
    mode: 'light',
    hljs: {
      style: 'github',
    },
  });
};
</script>

<style lang="scss" scoped>
:deep(.vditor-reset) {
  font-family: var(--font-family, 'Smiley Sans'), 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
</style>
