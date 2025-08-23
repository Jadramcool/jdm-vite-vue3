<template>
  <n-modal v-model:show="showModal" preset="dialog" title="请求参数详情" style="width: 800px">
    <div class="params-content">
      <div class="params-header">
        <n-tag type="info" size="small">
          <template #icon>
            <n-icon>
              <svg viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </n-icon>
          </template>
          JSON 格式
        </n-tag>
        <n-text depth="3" style="font-size: 12px"> 数据大小: {{ dataSize }} </n-text>
      </div>
      <div class="json-container">
        <n-code :code="formattedParams" language="json" show-line-numbers word-wrap />
      </div>
    </div>
    <template #action>
      <n-space>
        <n-button @click="copyParams" secondary>
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
  params: string;
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
 * 格式化参数显示
 * 支持深度嵌套的JSON结构美化
 */
const formattedParams = computed(() => {
  if (!props.params) return '{}';

  try {
    // 尝试解析JSON字符串
    let parsed;
    if (typeof props.params === 'string') {
      parsed = JSON.parse(props.params);
    } else {
      parsed = props.params;
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
    return props.params || '{}';
  }
});

/**
 * 计算数据大小
 */
const dataSize = computed(() => {
  const sizeInBytes = new Blob([formattedParams.value]).size;
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }
  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  }
  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
});

/**
 * 复制参数到剪贴板
 */
const copyParams = async () => {
  try {
    await navigator.clipboard.writeText(formattedParams.value);
    window.$message.success('参数已复制到剪贴板');
  } catch {
    window.$message.error('复制失败');
  }
};
</script>

<style scoped>
.params-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.params-header {
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
