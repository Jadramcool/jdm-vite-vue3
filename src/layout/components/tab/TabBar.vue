<template>
  <div class="tabbars flex-x-center">
    <n-tabs
      :value="tabStore.activeTab"
      :closable="tabStore.tabs.length > 1"
      type="card"
      @close="(path: any) => tabStore.removeTab(path)"
    >
      <n-tab
        v-for="item in tabStore.tabs"
        :key="item.path"
        :name="item.path"
        @click="handleItemClick(item.path)"
        @contextmenu.prevent="handleContextMenu($event, item)"
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
import Reload from './Reload.vue';
import DropTabs from './DropTabs.vue';

const router = useRouter();
const tabStore = useTabStore();

const contextMenuOption = reactive({
  show: false,
  x: 0,
  y: 0,
  currentPath: '',
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
</script>

<style lang="scss" scoped>
.tabbars {
  height: 42px;
  padding: 2px;
  padding: 0 16px;
  border-bottom: 1px solid var(--border-color);
}

:deep(.n-tabs) {
  .n-tabs-tab {
    padding-left: 16px;
    height: 36px;
    background: transparent !important;
    border-radius: 4px !important;
    margin-right: 4px;
    &:hover {
      border: 1px solid var(--primary-color) !important;
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
</style>
