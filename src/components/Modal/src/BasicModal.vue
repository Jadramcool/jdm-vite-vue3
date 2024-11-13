<template>
  <NModal v-bind="getBindValue" ref="modalElRef"> </NModal>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { basicProps } from './props';
import { NewModalProps } from './types';

defineOptions({ name: 'BasicModal' });
const emit = defineEmits(['register', 'ok', 'close']);

const props = defineProps(basicProps);
const propsRef = ref<Partial<any>>({}); // 模态框props
const modalElRef = ref<any>(); // 模态框实例

const showRef = ref<boolean>(false); // 模态框显示状态

const modalInstance: any = {
  setDrawerProps,
  emitOpen: undefined,
};
const instance = getCurrentInstance();
instance && emit('register', modalInstance, instance?.uid);

const getMergeProps = computed(() => {
  return { ..._.merge({}, unref(props), unref(propsRef)) };
});
// 获取props
const getProps = computed((): NewModalProps => {
  return {
    ...unref(getMergeProps),
    show: unref(showRef),
    'onUpdate:show': handleShow,
  };
});

const getBindValue = computed(() => {
  return { ...unref(getProps) } as Recordable;
});

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
</script>

<style lang="scss" scoped></style>
