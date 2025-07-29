<template>
  <div class="tabbars flex-x-center">
    <n-tabs
      :value="tabStore.activeTab"
      :closable="tabStore.tabs.length > 1"
      type="card"
      @close="(path: any) => tabStore.removeTab(path)"
    >
      <n-tab
        v-for="(item, index) in tabStore.tabs"
        :key="item.path"
        :name="item.path"
        :draggable="tabStore.tabs.length > 1"
        class="draggable-tab"
        @click="handleItemClick(item.path)"
        @contextmenu.prevent="handleContextMenu($event, item)"
        @dragstart="handleDragStart($event, index)"
        @dragover="handleDragOver($event)"
        @drop="handleDrop($event, index)"
        @dragend="handleDragEnd"
      >
        {{ item.title }}
      </n-tab>
      <template #suffix>
        <Reload />
        <DropTabs />
      </template>
    </n-tabs>

    <ContextMenu
      v-if="contextMenuOption.show"
      v-model:show="contextMenuOption.show"
      :current-path="contextMenuOption.currentPath"
      :x="contextMenuOption.x"
      :y="contextMenuOption.y"
    />
  </div>
</template>

<script lang="ts" setup>
import { useTabStore } from '@/store';
import ContextMenu from './ContextMenu.vue';
import DropTabs from './DropTabs.vue';
import Reload from './Reload.vue';

const router = useRouter();
const tabStore = useTabStore();

const contextMenuOption = reactive({
  show: false,
  x: 0,
  y: 0,
  currentPath: '',
});

// 拖拽相关状态
const dragState = reactive({
  dragIndex: -1, // 正在拖拽的tab索引
  isDragging: false, // 是否正在拖拽
});

const handleItemClick = (path: string) => {
  tabStore.setActiveTab(path);
  router.push(path);
};

function showContextMenu() {
  contextMenuOption.show = true;
}
function hideContextMenu() {
  contextMenuOption.show = false;
}
function setContextMenu(x: number, y: number, currentPath: string) {
  Object.assign(contextMenuOption, { x, y, currentPath });
}

// 右击菜单
async function handleContextMenu(e: any, tagItem: any) {
  const { clientX, clientY } = e;
  hideContextMenu();
  setContextMenu(clientX, clientY, tagItem.path);
  await nextTick();
  showContextMenu();
}

/**
 * 开始拖拽处理
 * @param event 拖拽事件
 * @param index 拖拽的tab索引
 */
function handleDragStart(event: DragEvent, index: number) {
  if (!event.dataTransfer) return;

  dragState.dragIndex = index;
  dragState.isDragging = true;

  // 设置拖拽数据
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', index.toString());

  // 添加拖拽样式
  const target = event.target as HTMLElement;
  target.style.opacity = '0.5';
}

/**
 * 拖拽悬停处理
 * @param event 拖拽事件
 */
function handleDragOver(event: DragEvent) {
  event.preventDefault();
  if (!event.dataTransfer) return;

  event.dataTransfer.dropEffect = 'move';
}

/**
 * 放置处理
 * @param event 拖拽事件
 * @param toIndex 目标索引
 */
function handleDrop(event: DragEvent, toIndex: number) {
  event.preventDefault();

  const fromIndex = dragState.dragIndex;
  if (fromIndex !== -1 && fromIndex !== toIndex) {
    // 执行tab重新排序
    tabStore.reorderTabs(fromIndex, toIndex);
  }
}

/**
 * 拖拽结束处理
 * @param event 拖拽事件
 */
function handleDragEnd(event: DragEvent) {
  // 重置拖拽状态
  dragState.dragIndex = -1;
  dragState.isDragging = false;

  // 恢复样式
  const target = event.target as HTMLElement;
  target.style.opacity = '';
}
</script>

<style lang="scss" scoped>
.tabbars {
  height: 42px;
  padding: 2px;
  padding: 0 16px;
  border-bottom: 1px solid var(--border-color);
  transition: border-color 0.3s ease;
}

:deep(.n-tabs) {
  .n-tabs-tab {
    padding-left: 16px;
    height: 36px;
    background: transparent !important;
    border-radius: 4px !important;
    margin-right: 4px;
    transition: all 0.2s ease;
    &:hover {
      border: 1px solid var(--primary-color) !important;
    }

    // 拖拽相关样式
    &.draggable-tab {
      cursor: move;
      user-select: none;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      &[draggable='true'] {
        &:active {
          cursor: grabbing;
        }
      }
    }
  }
  .n-tabs-tab--active {
    border: 1px solid var(--primary-color) !important;
    background-color: var(--tab-selected-bg) !important;
  }
  .n-tabs-pad,
  .n-tabs-tab-pad,
  .n-tabs-scroll-padding {
    border: none !important;
  }
  .n-tabs-nav__suffix {
    border: none !important;
  }
}

// 拖拽时的视觉反馈
.draggable-tab {
  &[data-dragging='true'] {
    opacity: 0.5;
    transform: rotate(5deg);
  }

  &[data-drag-over='true'] {
    border-left: 3px solid var(--primary-color) !important;
  }
}
</style>
