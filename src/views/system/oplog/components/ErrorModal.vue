<template>
  <n-modal v-model:show="showModal" preset="dialog" title="错误信息详情" style="width: 600px">
    <div class="error-content">
      <n-alert type="error" :show-icon="false">
        <template #header>
          <div class="error-header">
            <n-icon size="18" color="#d03050">
              <svg viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                />
              </svg>
            </n-icon>
            <span class="error-title">错误详情</span>
          </div>
        </template>
        <div class="error-message">
          <n-code :code="errorMessage" language="text" show-line-numbers />
        </div>
      </n-alert>
    </div>
    <template #action>
      <n-space>
        <n-button @click="copyError">复制</n-button>
        <n-button type="primary" @click="showModal = false">关闭</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { NAlert, NButton, NCode, NIcon, NModal, NSpace } from 'naive-ui';
import { computed } from 'vue';

// 组件属性定义
interface Props {
  visible: boolean;
  errorMessage: string;
}

// 组件事件定义
interface Emits {
  (e: 'update:visible', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 弹窗显示状态
const showModal = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
});

// 错误信息
const errorMessage = computed(() => props.errorMessage || '无错误信息');

/**
 * 复制错误信息到剪贴板
 */
const copyError = async () => {
  try {
    await navigator.clipboard.writeText(errorMessage.value);
    window.$message.success('错误信息已复制到剪贴板');
  } catch {
    window.$message.error('复制失败');
  }
};
</script>

<style scoped>
.error-content {
  max-height: 400px;
  overflow-y: auto;
}

.error-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-title {
  font-weight: 600;
  font-size: 14px;
}

.error-message {
  margin-top: 12px;
}
</style>
