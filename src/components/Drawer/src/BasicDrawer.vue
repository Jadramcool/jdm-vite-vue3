<template>
  <NDrawer v-bind="getBindValue" ref="drawerElRef">
    <NDrawerContent closable>
      <template #header>
        <slot v-if="$slots.header" name="header"></slot>
        <div v-else>{{ getProps.headTitle }}</div>
      </template>
      <n-spin :show="getLoading">
        <slot></slot>
      </n-spin>
      <template #footer>
        <NSpace>
          <slot v-if="$slots.footer" name="footer"></slot>
          <BasicDrawerFooter v-bind="getProps" @ok="handleOk" @close="handleClose" />
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<script setup lang="ts">
import _, { isFunction } from 'lodash';
import { NDrawer } from 'naive-ui';
import { BasicDrawerFooter } from './components';
import { basicProps } from './props';
import { NewDrawerProps } from './types';

defineOptions({ name: 'BasicDrawer' });
const emit = defineEmits(['register', 'ok', 'close']);

const props = defineProps(basicProps);
const propsRef = ref<Partial<any>>({}); // 抽屉props
const drawerElRef = ref<any>(); // 抽屉实例

const showRef = ref<boolean>(false); // 抽屉显示状态

const drawerInstance: any = {
  setDrawerProps,
  emitShow: undefined,
};
const instance = getCurrentInstance();
instance && emit('register', drawerInstance, instance?.uid);

const getMergeProps = computed(() => {
  return { ..._.merge({}, unref(props), unref(propsRef)) };
});
// 获取props
const getProps = computed((): NewDrawerProps => {
  return {
    ...unref(getMergeProps),
    show: unref(showRef),
    'onUpdate:show': handleShow,
  };
});

const getLoading = computed(() => {
  return false;
});

const getBindValue = computed(() => {
  return { ...unref(getProps) } as Recordable;
});

watch(
  () => props.show,
  (newVal, oldVal) => {
    if (newVal !== oldVal) showRef.value = newVal;
  },
  { deep: true },
);

watch(
  () => showRef.value,
  (show) => {
    nextTick(() => {
      if (instance && drawerInstance.emitShow) {
        drawerInstance.emitShow(show, instance.uid);
      }
    });
  },
);

// const { openDrawer } = useDrawerEvents({ emit, getProps });

// 设置表格props，注册时调用
async function setDrawerProps(drawerProps: Partial<any>): Promise<void> {
  propsRef.value = _.merge(unref(propsRef) || {}, drawerProps);

  if (Reflect.has(drawerProps, 'show')) {
    showRef.value = !!drawerProps.show;
  }
}

const handleShow = (show: boolean) => {
  showRef.value = show;
};

const handleOk = () => {
  emit('ok');
};
const handleClose = async () => {
  const { closeFunc } = unref(getProps);
  if (closeFunc && isFunction(closeFunc)) {
    const res = await closeFunc();
    showRef.value = !res;
    return;
  }
  emit('close');
  showRef.value = !false;
};
</script>

<style lang="scss" scoped></style>
