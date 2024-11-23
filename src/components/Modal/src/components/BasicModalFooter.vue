<template>
  <NSpace>
    <NButton v-if="getFooterProps.showCancelButton" @click="handleClose">
      {{ getFooterProps.cancelText }}
    </NButton>
    <NButton
      v-if="getFooterProps.showOkButton"
      :type="getFooterProps.okType"
      @click="handleOk"
      :loading="getFooterProps.confirmLoading"
    >
      {{ getFooterProps.okText }}
    </NButton>
  </NSpace>
</template>

<script setup lang="ts">
import { $t } from '@/locales/i18n';
import { footerProps } from '../props';

const emit = defineEmits(['close', 'ok']);

// const attrs = useAttrs();
const props = defineProps({
  ...footerProps,
  cancelText: {
    type: String,
    default: undefined,
  },
  okText: {
    type: String,
    default: undefined,
  },
});

const getFooterProps = computed(() => {
  return {
    ...props,
    cancelText: props.cancelText || $t('common.cancel'),
    okText: props.okText || $t('common.confirm'),
  };
});

function handleClose() {
  emit('close');
}

function handleOk() {
  emit('ok');
}
</script>

<style scoped lang="scss"></style>
