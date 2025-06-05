<template>
  <n-menu
    ref="menu"
    class="side-menu"
    :indent="18"
    :collapsed-icon-size="22"
    :collapsed-width="64"
    :collapsed="appStore.collapsed"
    :options="permissionStore.menus"
    :value="activeKey"
    :accordion="true"
    @update:value="handleMenuSelect"
  />
</template>

<script lang="ts" setup>
import { useAppStore, usePermissionStore } from '@/store';
import { isExternal } from '@/utils/common';
import { useDialog } from 'naive-ui';

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const permissionStore = usePermissionStore();

const dialog = useDialog();

const activeKey: any = computed(() => route.meta?.parentKey || route.name);

const menu = ref<any>(null);
watch(route, async () => {
  await nextTick();
  menu.value?.showOption();
});

function handleMenuSelect(_key: any, item: any) {
  if (isExternal(item.originPath)) {
    dialog.info({
      type: 'info',
      title: `请选择打开方式`,
      positiveText: '外链打开',
      negativeText: '在本站内嵌打开',
      onPositiveClick() {
        window.open(item.originPath);
      },
      onNegativeClick: () => {
        router.push(item.path);
      },
    });
  } else {
    router.push(item.path);
  }
}
</script>

<style lang="scss" scoped>
.side-menu:not(.n-menu--collapsed) {
  .n-menu-item-content {
    &::before {
      left: 8px;
      right: 8px;
    }
    // &.n-menu-item-content--selected::before {
    //   border-left: 4px solid var(--primary-color);
    // }
  }
  :deep(.n-menu-item-content--selected::before) {
    // border-left: 5px solid var(--n-item-color-active);
    border-left: 4px solid var(--primary-color);
  }
}
</style>
