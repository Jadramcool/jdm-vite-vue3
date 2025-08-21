<template>
  <n-modal v-model:show="showModal" preset="dialog" title="响应结果详情" style="width: 800px">
    <div class="result-content">
      <div class="result-header">
        <n-tag type="success" size="small">
          <template #icon>
            <n-icon>
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </n-icon>
          </template>
          响应数据
        </n-tag>
        <n-text depth="3" style="font-size: 12px"> 数据大小: {{ dataSize }} </n-text>
      </div>
      <div class="json-container">
        <n-code :code="formattedResult" language="json" show-line-numbers word-wrap />
      </div>
    </div>
    <template #action>
      <n-space>
        <n-button @click="copyResult" secondary>
          <template #icon>
            <n-icon>
              <svg viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                />
              </svg>
            </n-icon>
          </template>
          复制
        </n-button>
        <n-button type="primary" @click="showModal = false">关闭</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { NButton, NCode, NIcon, NModal, NSpace, NTag, NText } from 'naive-ui';
import { computed } from 'vue';

// 组件属性定义
interface Props {
  visible: boolean;
  result: string;
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

/**
 * 格式化结果显示
 * 支持深度嵌套的JSON结构美化
 */
const formattedResult = computed(() => {
  if (!props.result) return '{}';

  try {
    // 尝试解析JSON字符串
    let parsed;
    if (typeof props.result === 'string') {
      parsed = JSON.parse(props.result);
    } else {
      parsed = props.result;
    }

    // 递归处理嵌套的JSON字符串
    const processNestedJson = (obj: any): any => {
      if (typeof obj === 'string') {
        try {
          // 尝试解析字符串中的JSON
          const nestedJson = JSON.parse(obj);
          return processNestedJson(nestedJson);
        } catch {
          return obj;
        }
      } else if (Array.isArray(obj)) {
        return obj.map((item) => processNestedJson(item));
      } else if (obj !== null && typeof obj === 'object') {
        const result: any = {};
        for (const [key, value] of Object.entries(obj)) {
          result[key] = processNestedJson(value);
        }
        return result;
      }
      return obj;
    };

    const processedData = processNestedJson(parsed);
    return JSON.stringify(processedData, null, 2);
  } catch (error) {
    // 如果解析失败，返回原始字符串
    return props.result || '{}';
  }
});

/**
 * 计算数据大小
 */
const dataSize = computed(() => {
  const sizeInBytes = new Blob([formattedResult.value]).size;
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }
  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  }
  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
});

/**
 * 复制结果到剪贴板
 */
const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(formattedResult.value);
    window.$message.success('结果已复制到剪贴板');
  } catch {
    window.$message.error('复制失败');
  }
};
</script>

<style scoped>
.result-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: var(--n-color-target);
  border-radius: 6px;
  border: 1px solid var(--n-border-color);
}

.json-container {
  max-height: 500px;
  overflow-y: auto;
  border-radius: 6px;
  border: 1px solid var(--n-border-color);
}

.json-container :deep(.n-code) {
  border-radius: 6px;
}

.json-container :deep(.n-code .hljs) {
  padding: 16px;
  line-height: 1.6;
}
</style>
