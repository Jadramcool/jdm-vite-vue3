<!--
 * @Author: jdm
 * @Date: 2024-12-19
 * @LastEditors: jdm
 * @LastEditTime: 2024-12-19
 * @FilePath: \jdm-vite-vue3\src\views\demo\ThemeDemo.vue
 * @Description: 主题切换演示页面
-->
<template>
  <div class="theme-demo-container">
    <n-card title="主题切换演示" class="demo-card">
      <template #header-extra>
        <n-tag :type="currentThemeType" round>
          {{ currentThemeLabel }}
        </n-tag>
      </template>

      <n-space vertical size="large">
        <!-- 基础主题切换 -->
        <n-card title="基础主题切换" size="small">
          <n-space>
            <n-button
              v-for="theme in themeOptions"
              :key="theme.value"
              :type="appStore.storeColorMode === theme.value ? 'primary' : 'default'"
              :loading="isChanging && targetTheme === theme.value"
              @click="switchToTheme(theme.value)"
            >
              <template #icon>
                <JayIcon :icon="theme.icon" />
              </template>
              {{ theme.label }}
            </n-button>
          </n-space>
        </n-card>

        <!-- 高级功能 -->
        <n-card title="高级功能" size="small">
          <n-space>
            <n-button type="info" :loading="isCycling" @click="handleCycleTheme">
              <template #icon>
                <JayIcon icon="icon-park-outline:refresh" />
              </template>
              循环切换
            </n-button>
          </n-space>
        </n-card>

        <!-- 主题信息 -->
        <n-card title="主题信息" size="small">
          <n-descriptions :column="2" bordered>
            <n-descriptions-item label="当前模式">
              <n-tag :type="currentThemeType">{{ currentThemeLabel }}</n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="实际模式">
              <n-tag :type="effectiveThemeType">{{ effectiveThemeLabel }}</n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="是否深色">
              <n-tag :type="isDark ? 'warning' : 'info'">
                {{ isDark ? '是' : '否' }}
              </n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="切换状态">
              <n-tag :type="isChanging ? 'error' : 'success'">
                {{ isChanging ? '切换中' : '空闲' }}
              </n-tag>
            </n-descriptions-item>
          </n-descriptions>
        </n-card>

        <!-- 主题色展示 -->
        <n-card title="主题色展示" size="small">
          <n-space>
            <div
              v-for="color in colorPalette"
              :key="color.name"
              class="color-block"
              :style="{ backgroundColor: color.value }"
              :title="`${color.name}: ${color.value}`"
            >
              <span class="color-name">{{ color.name }}</span>
            </div>
          </n-space>
        </n-card>

        <!-- 操作日志 -->
        <n-card title="操作日志" size="small">
          <n-scrollbar style="max-height: 200px">
            <n-space vertical size="small">
              <div v-for="(log, index) in logs" :key="index" class="log-item">
                <n-tag size="small" :type="log.type">{{ log.time }}</n-tag>
                <span class="log-message">{{ log.message }}</span>
              </div>
            </n-space>
          </n-scrollbar>
          <template #action>
            <n-button size="small" @click="clearLogs"> 清空日志 </n-button>
          </template>
        </n-card>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store';
import {
  isDarkMode as checkIsDarkMode,
  cycleTheme,
  switchTheme,
  type ThemeMode,
} from '@/utils/theme';
import { useMessage } from 'naive-ui';

useI18n();
const appStore = useAppStore();
const message = useMessage();

// 响应式状态
const isChanging = ref(false);
const isCycling = ref(false);
const targetTheme = ref<ThemeMode | null>(null);
const logs = ref<
  Array<{ time: string; message: string; type: 'info' | 'success' | 'warning' | 'error' }>
>([]);

// 主题选项配置
const themeOptions = [
  { value: 'light' as ThemeMode, label: '浅色模式', icon: 'icon-park-outline:sun-one' },
  { value: 'dark' as ThemeMode, label: '深色模式', icon: 'icon-park-outline:moon' },
  { value: 'auto' as ThemeMode, label: '跟随系统', icon: 'icon-park-outline:laptop-computer' },
];

/**
 * 计算当前主题标签和类型
 */
const currentThemeLabel = computed(() => {
  const current = themeOptions.find((option) => option.value === appStore.storeColorMode);
  return current?.label || '未知';
});

const currentThemeType = computed(() => {
  const mode = appStore.storeColorMode;
  return mode === 'dark' ? 'warning' : mode === 'light' ? 'info' : 'default';
});

/**
 * 计算实际生效的主题
 */
const effectiveThemeLabel = computed(() => {
  return appStore.colorMode === 'dark' ? '深色模式' : '浅色模式';
});

const effectiveThemeType = computed(() => {
  return appStore.colorMode === 'dark' ? 'warning' : 'info';
});

/**
 * 检查是否为深色模式
 */
const isDark = computed(() => checkIsDarkMode());

/**
 * 主题色调色板
 */
const colorPalette = computed(() => {
  const theme = appStore.theme?.common || {};
  return [
    { name: '主色', value: theme.primaryColor },
    { name: '信息色', value: theme.infoColor },
    { name: '成功色', value: theme.successColor },
    { name: '警告色', value: theme.warningColor },
    { name: '错误色', value: theme.errorColor },
  ].filter((color) => color.value);
});

/**
 * 添加日志
 * @param message - 日志消息
 * @param type - 日志类型
 */
const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
  const time = new Date().toLocaleTimeString();
  logs.value.unshift({ time, message, type });

  // 限制日志数量
  if (logs.value.length > 50) {
    logs.value = logs.value.slice(0, 50);
  }
};

/**
 * 切换到指定主题
 * @param mode - 目标主题模式
 */
const switchToTheme = async (mode: ThemeMode) => {
  if (isChanging.value) {
    message.warning('主题正在切换中，请稍后再试');
    return;
  }

  try {
    isChanging.value = true;
    targetTheme.value = mode;
    addLog(`开始切换到 ${themeOptions.find((t) => t.value === mode)?.label}`, 'info');

    switchTheme(mode, {
      onStart: () => {
        addLog(`开始切换至 ${mode} 模式...`);
      },
      onComplete: (newMode) => {
        addLog(`成功切换到 ${themeOptions.find((t) => t.value === newMode)?.label}`, 'success');
        message.success(`主题已切换至 ${themeOptions.find((t) => t.value === newMode)?.label}`);
      },
      onError: (error) => {
        addLog(`切换失败: ${error.message}`, 'error');
        message.error('主题切换失败');
      },
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error('未知错误');
    addLog(`切换异常: ${err.message}`, 'error');
    message.error('主题切换异常');
  } finally {
    isChanging.value = false;
    targetTheme.value = null;
  }
};

/**
 * 循环切换主题
 */
const handleCycleTheme = async () => {
  if (isCycling.value) {
    message.warning('正在循环切换中');
    return;
  }

  try {
    isCycling.value = true;
    addLog('开始循环切换主题', 'info');

    cycleTheme({
      onComplete: (newMode) => {
        addLog(
          `循环切换完成，当前: ${themeOptions.find((t) => t.value === newMode)?.label}`,
          'success',
        );
        message.success('循环切换完成');
      },
      onError: (error) => {
        addLog(`循环切换失败: ${error.message}`, 'error');
        message.error('循环切换失败');
      },
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error('未知错误');
    addLog(`循环切换异常: ${err.message}`, 'error');
    message.error('循环切换异常');
  } finally {
    isCycling.value = false;
  }
};

/**
 * 清空日志
 */
const clearLogs = () => {
  logs.value = [];
  message.info('日志已清空');
};

// 初始化日志
onMounted(() => {
  addLog('主题演示页面已加载', 'info');
});
</script>

<style scoped>
.theme-demo-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.demo-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.color-block {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.color-block:hover {
  transform: scale(1.05);
}

.color-name {
  font-size: 12px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  padding: 4px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px 4px 0 0;
  width: 100%;
  text-align: center;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  border-bottom: 1px solid var(--n-border-color);
}

.log-message {
  flex: 1;
  font-size: 14px;
  color: var(--n-text-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .theme-demo-container {
    padding: 10px;
  }

  .color-block {
    width: 60px;
    height: 45px;
  }

  .color-name {
    font-size: 10px;
  }
}
</style>
