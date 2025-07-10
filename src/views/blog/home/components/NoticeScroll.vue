<template>
  <div class="notice-scroll" @mouseenter="pauseNoticeScroll" @mouseleave="resumeNoticeScroll">
    <JayIcon
      v-if="showIcon"
      icon="icon-park-solid:volume-notice"
      color="#FFA500"
      class="notice-icon"
    />
    <div class="notice-wrapper">
      <div class="notice-content" ref="noticeContentRef">
        <div
          v-for="(item, index) in noticeList"
          :key="getItemKey(item, index)"
          class="notice-item"
          :class="{ active: index === currentNoticeIndex }"
        >
          <div class="notice-item-title" @click="handleNoticeClick(item, index)">
            {{ getItemText(item) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义通知项类型
type NoticeItem = Notice.Notice | string;

interface Props {
  // 通知列表数据
  notices: NoticeItem[];
  // 滚动间隔时间（毫秒）
  interval?: number;
  // 是否自动开始滚动
  autoStart?: boolean;
  // 是否显示图标
  showIcon?: boolean;
}

interface Emits {
  // 点击通知项时触发
  (e: 'notice-click', item: NoticeItem, index: number): void;
  // 通知切换时触发
  (e: 'notice-change', currentIndex: number, item: NoticeItem): void;
}

const props = withDefaults(defineProps<Props>(), {
  notices: () => [],
  interval: 5000,
  autoStart: true,
  showIcon: true,
});

const emit = defineEmits<Emits>();

// 响应式数据
const currentNoticeIndex = ref(0);
const noticeContentRef = ref<HTMLElement>();
const isPaused = ref(false);
let noticeTimer: NodeJS.Timeout | null = null;

// 计算属性：标准化通知列表
const noticeList = computed<NoticeItem[]>(() => {
  return props.notices;
});

// 类型守卫：判断是否为 Notice 对象
const isNoticeObject = (item: NoticeItem): item is Notice.Notice => {
  return typeof item === 'object' && item !== null && 'id' in item;
};

// 获取项目的唯一键
const getItemKey = (item: NoticeItem, index: number): string | number => {
  if (isNoticeObject(item)) {
    return item.id || index;
  }
  return index;
};

// 获取项目显示文本
const getItemText = (item: NoticeItem): string => {
  if (isNoticeObject(item)) {
    return item.title || item.content || String(item.id || '');
  }
  return String(item);
};

// 启动通知滚动
const startNoticeScroll = () => {
  // 如果只有一个或没有通知，不启动滚动
  if (noticeList.value.length <= 1) {
    console.log('通知数量不足，不启动滚动');
    return;
  }

  // 如果当前处于暂停状态，不启动滚动
  if (isPaused.value) {
    console.log('当前处于暂停状态，不启动滚动');
    return;
  }

  // 如果已经有定时器在运行，先清除
  if (noticeTimer) {
    clearInterval(noticeTimer);
  }

  console.log(`启动通知滚动，间隔${props.interval}毫秒`);
  noticeTimer = setInterval(() => {
    const oldIndex = currentNoticeIndex.value;
    currentNoticeIndex.value = (currentNoticeIndex.value + 1) % noticeList.value.length;
    console.log(`通知滚动: ${oldIndex} -> ${currentNoticeIndex.value}`);

    // 触发通知切换事件
    emit('notice-change', currentNoticeIndex.value, noticeList.value[currentNoticeIndex.value]);
  }, props.interval);
};

// 停止通知滚动
const stopNoticeScroll = () => {
  if (noticeTimer) {
    clearInterval(noticeTimer);
    noticeTimer = null;
    console.log('通知滚动已停止');
  }
};

// 暂停通知滚动
const pauseNoticeScroll = () => {
  console.log('鼠标悬停，暂停通知滚动');
  isPaused.value = true;
  stopNoticeScroll();
};

// 恢复通知滚动
const resumeNoticeScroll = () => {
  console.log('鼠标离开，恢复通知滚动');
  isPaused.value = false;
  // 只有在有多个通知时才恢复滚动
  if (noticeList.value.length > 1) {
    startNoticeScroll();
  }
};

// 处理通知点击
const handleNoticeClick = (item: NoticeItem, index: number) => {
  emit('notice-click', item, index);
};

// 监听通知列表变化
watch(
  () => props.notices,
  () => {
    stopNoticeScroll();
    currentNoticeIndex.value = 0;
    if (props.autoStart && noticeList.value.length > 1) {
      nextTick(() => {
        startNoticeScroll();
      });
    }
  },
  { deep: true },
);

// 组件挂载时初始化
onMounted(() => {
  if (props.autoStart && noticeList.value.length > 1) {
    nextTick(() => {
      startNoticeScroll();
    });
  }
});

// 组件卸载时清理定时器
onUnmounted(() => {
  stopNoticeScroll();
});

// 暴露方法给父组件
defineExpose({
  startNoticeScroll,
  stopNoticeScroll,
  pauseNoticeScroll,
  resumeNoticeScroll,
  currentIndex: readonly(currentNoticeIndex),
  isPaused: readonly(isPaused),
});
</script>

<style lang="scss" scoped>
// 闪动动画关键帧
@keyframes blink {
  0%,
  50% {
    opacity: 1;
    transform: scale(1);
  }
  25% {
    opacity: 0.6;
    transform: scale(1.1);
  }
  75% {
    opacity: 0.8;
    transform: scale(0.95);
  }
}

.notice-scroll {
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  border-radius: 8px;
  border: 2px dashed #ebdada;
  display: flex;
  align-items: center;
  transition: border-color 0.3s ease;

  :deep(.notice-icon) {
    animation: blink 1s infinite ease-in-out;
    transform-origin: center;
  }

  &:hover {
    border-color: #ff6b6b;

    :deep(.notice-icon) {
      animation-play-state: paused;
      transform: scale(1.2);
    }
  }

  .notice-wrapper {
    flex: 1;
    overflow: hidden;
    margin-left: 10px;
    height: 100%;

    .notice-content {
      position: relative;
      height: 100%;

      .notice-item {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s ease-in-out;

        // 只有active的通知项显示
        &.active {
          opacity: 1;
          transform: translateY(0);
        }

        // 非active的通知项隐藏
        &:not(.active) {
          opacity: 0;
          transform: translateY(20px);
        }

        .notice-item-title {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #666;
          font-size: 14px;
          cursor: pointer;
          line-height: 40px;
          transition: color 0.3s ease;

          &:hover {
            color: #ff6b6b;
          }
        }
      }
    }
  }
}
</style>
