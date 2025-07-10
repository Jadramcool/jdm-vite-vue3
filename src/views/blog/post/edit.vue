<template>
  <div>
    <div class="content flex-y-center">
      <div ref="markdownRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BlogApi } from '@/api';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { useRoute } from 'vue-router';

defineOptions({ name: 'PostEdit' });

const route = useRoute();

const isEdit = computed(() => {
  return route.query.id !== undefined;
});
const postId = isEdit.value ? Number(route.query.id) : 0;
const post = ref<Blog.Post>();

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
  console.log('🚀 ~ init ~ res:', res);
  post.value = res;
};

const initVditor = () => {
  vditor.value = new Vditor(markdownRef.value as HTMLDivElement, {
    height: 'auto',
    minHeight: 500,
    width: 'auto',
    value: post.value?.content,
    cache: {
      enable: false,
    },
  });
};
</script>

<style lang="scss" scoped>
:deep(.vditor-reset) {
  font-family: 'HarmonySans', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
</style>
