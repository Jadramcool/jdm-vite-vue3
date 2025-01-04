<template>
  <NModal v-bind="getBindValue" ref="modalElRef">
    <NCard
      :style="{
        width: isNumber(getBindValue.cardWidth)
          ? getBindValue.cardWidth + 'px'
          : getBindValue.cardWidth,
      }"
      size="small"
      closable
      :segmented="true"
      :on-close="handleClose"
    >
      <template #header>
        {{ getBindValue.title || '弹窗' }}
      </template>
      <template #default>
        <NScrollbar
          content-class="modal-content"
          :style="{
            height: isNumber(getBindValue.cardHeight)
              ? getBindValue.cardHeight + 'px'
              : getBindValue.cardHeight,
          }"
        >
          <slot></slot>
        </NScrollbar>
      </template>
      <template #footer>
        <slot v-if="$slots.footer" name="footer"></slot>
      </template>
      <template #action>
        <NFlex justify="end">
          <slot v-if="$slots.action" name="action"></slot>
          <BasicModalFooter v-bind="getProps" @ok="handleOk" @close="handleClose" />
        </NFlex>
      </template>
    </NCard>
  </NModal>
</template>

<script setup lang="ts">
import { isFunction } from '@/utils';
import _, { isNumber } from 'lodash';
import { BasicModalFooter } from './components';
import { basicProps } from './props';
import { NewModalProps } from './types';

defineOptions({ name: 'BasicModal' });
const emit = defineEmits(['register', 'ok', 'close']);

const props = defineProps(basicProps);
const propsRef = ref<Partial<any>>({}); // 模态框props
const modalElRef = ref<any>(); // 模态框实例

const showRef = ref<boolean>(false); // 模态框显示状态

const modalInstance: any = {
  setModalProps,
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

watch(
  () => showRef.value,
  (show) => {
    nextTick(() => {
      if (instance && modalInstance.emitOpen) {
        modalInstance.emitOpen(show, instance.uid);
      }
    });
  },
);

// 设置弹窗props，注册时调用
async function setModalProps(modalProps: Partial<any>): Promise<void> {
  propsRef.value = _.merge(unref(propsRef) || {}, modalProps);

  if (Reflect.has(modalProps, 'show')) {
    showRef.value = !!modalProps.show;
  }
}

const handleOk = () => {
  emit('ok');
};

const handleShow = (show: boolean) => {
  showRef.value = show;
};

const handleClose = async () => {
  const { closeFunc } = unref(getProps);
  if (closeFunc && isFunction(closeFunc)) {
    const res = await closeFunc();
    showRef.value = !res;
    return;
  }
  emit('close');
  showRef.value = false;
};
</script>

<style>
.modal-content {
  padding: 0 6px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
