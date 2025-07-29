<template>
  <TransitionGroup
    v-if="appStore.showBreadcrumb"
    name="list"
    tag="ul"
    style="display: flex; gap: 1em"
  >
    <n-el
      v-for="item in routes"
      :key="item.path"
      tag="li"
      class="flex-center gap-2 cursor-pointer split breadcrumb-item"
      @click="router.push(item.path)"
    >
      <jay-icon :icon="item.meta.icon as string" v-if="appStore.showBreadcrumbIcon" />
      <!-- <span class="whitespace-nowrap">{{ t(`route.${String(item.name)}`, item.meta.title) }}</span> -->
      <span class="whitespace-nowrap">{{ item.meta.title }}</span>
    </n-el>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store';

const router = useRouter();
const route = useRoute();
const routes = computed(() => {
  return route.matched;
});
const appStore = useAppStore();
</script>

<style lang="scss" scoped>
/**
 * 面包屑分隔符样式
 */
.split:not(:first-child)::before {
  content: '/';
  padding-right: 0.6em;
  color: rgba(0, 0, 0, 0.4);
  font-weight: 300;
  transition: color 0.3s ease;
}

/**
 * 面包屑项目样式美化
 */
.breadcrumb-item {
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: rgba(24, 160, 251, 0.1);
    transform: translateY(-1px);

    span {
      color: var(--primary-color);
    }
  }

  &:last-child {
    background: rgba(24, 160, 251, 0.08);
    font-weight: 500;

    span {
      color: var(--primary-color);
    }
  }
}

/**
 * 动画效果
 */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.list-leave-active {
  position: absolute;
  left: 25%;
}

/**
 * 暗色模式适配
 */
.dark {
  .split:not(:first-child)::before {
    color: rgba(255, 255, 255, 0.4);
  }

  .breadcrumb-item {
    &:hover {
      background: rgba(24, 160, 251, 0.15);
    }

    &:last-child {
      background: rgba(24, 160, 251, 0.12);
    }
  }
}
</style>
