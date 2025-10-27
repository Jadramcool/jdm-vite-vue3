<template>
  <div class="decoration-page">
    <div class="page-container">
      <!-- 顶部工具栏 -->
      <div class="toolbar">
        <div class="toolbar-left">
          <h2>页面装修</h2>
        </div>

        <div class="toolbar-btns">
          <n-button type="primary" @click="handleSave">保存</n-button>
        </div>
      </div>

      <n-divider dashed class="my-8px"></n-divider>

      <!-- 主要内容区域 -->
      <div class="main-content">
        <!-- 左侧模块库 -->
        <div class="module-library">
          <div class="library-header">
            <h3>可用模块</h3>
          </div>

          <VueDraggable
            v-model="availableModules"
            :animation="150"
            class="module-list"
            ghostClass="layout-ghost"
            group="layoutModules"
            filter=".none_draggable"
            @change="(evt) => handleDragChange(evt, '可用模块')"
          >
            <div v-for="module in availableModules" :key="module.key" class="module-item">
              <div class="module-icon">
                <JayIcon :icon="module.icon" :size="20" />
              </div>
              <div class="module-info">
                <div class="module-name">{{ module.name }}</div>
                <div class="module-desc">{{ module.description }}</div>
              </div>
            </div>
          </VueDraggable>
        </div>

        <!-- 布局预览区域 -->
        <div class="layout-preview">
          <div class="preview-header">
            <h3>布局预览</h3>
          </div>

          <div class="layout-container">
            <!-- 左侧区域 -->
            <div class="layout-left">
              <div class="area-header">
                <h4>左侧区域</h4>
                <span>关键信息模块</span>
              </div>

              <div class="module-container">
                <VueDraggable
                  v-model="leftModules"
                  group="layoutModules"
                  :animation="150"
                  class="draggable-area"
                  ghost-class="internal-ghost"
                  @change="(evt) => handleDragChange(evt, '左侧区域')"
                >
                  <div v-for="module in leftModules" :key="module.key" class="layout-module">
                    <div class="module-placeholder">
                      <div class="module-header">
                        <JayIcon :icon="module.icon" :size="24" />
                        <span class="module-title">{{ module.name }}</span>
                      </div>
                      <div class="module-content">
                        <p>{{ module.description }}</p>
                      </div>
                    </div>
                  </div>
                </VueDraggable>

                <!-- 左侧空状态 -->
                <div v-if="leftModules.length === 0" class="empty-area">
                  <JayIcon icon="material-symbols:add-circle-outline" :size="32" />
                  <p>暂无模块</p>
                </div>
              </div>
            </div>

            <!-- 右侧区域 -->
            <div class="layout-right">
              <div class="area-header">
                <h4>右侧区域</h4>
                <span>主要内容模块</span>
              </div>

              <div class="module-container">
                <VueDraggable
                  v-model="rightModules"
                  group="layoutModules"
                  :animation="150"
                  class="draggable-area"
                  ghost-class="internal-ghost"
                  @change="(evt) => handleDragChange(evt, '右侧区域')"
                >
                  <div v-for="module in rightModules" :key="module.key" class="layout-module">
                    <div class="module-placeholder">
                      <div class="module-header">
                        <JayIcon :icon="module.icon" :size="24" />
                        <span class="module-title">{{ module.name }}</span>
                      </div>
                      <div class="module-content">
                        <p>{{ module.description }}</p>
                      </div>
                    </div>
                  </div>
                </VueDraggable>

                <!-- 右侧空状态 -->
                <div v-if="rightModules.length === 0" class="empty-area">
                  <JayIcon icon="material-symbols:add-circle-outline" :size="32" />
                  <p>暂无模块</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BlogApi } from '@/api';
import { JayIcon } from '@/components';
import { useBlogStore } from '@/store';
import { ref } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

const blogStore = useBlogStore();

onMounted(async () => {
  // 初始化博客分类
  await blogStore.initAllCategory();
  getDecorationConfig();
});

const defaultModules = ref([
  {
    key: 'user-profile',
    name: '博客用户',
    description: '显示博客用户信息',
    icon: 'material-symbols:person',
    category: 'user',
  },
  {
    key: 'user-stats',
    name: '用户统计',
    description: '显示用户数据统计信息',
    icon: 'material-symbols:analytics',
    category: 'user',
  },
  {
    key: 'navigation',
    name: '导航菜单',
    description: '网站主要导航链接',
    icon: 'material-symbols:menu',
    category: 'navigation',
  },
  {
    key: 'category-nav',
    name: '分类导航',
    description: '文章分类快速导航',
    icon: 'material-symbols:category',
    category: 'navigation',
  },
  {
    key: 'recent-posts',
    name: '最近文章',
    description: '显示最近发布的文章',
    icon: 'material-symbols:article',
    category: 'content',
  },
  {
    key: 'notice',
    name: '通知',
    description: '显示通知',
    icon: 'material-symbols:circle-notifications',
    category: 'content',
  },
]);

// 过滤出分类导航模块
const categoryNavModules = computed(() => {
  return blogStore.getAllCategory.map((category) => ({
    id: category.id,
    key: category.slug,
    name: `分类导航 - ${category.name}`,
    description: category.description,
    icon: category.icon,
    category: 'navigation',
  }));
});

// 可用模块库定义
const availableModules = computed(() => {
  console.log('🚀 ~ blogStore.getAllCategory:', blogStore.getAllCategory);

  // 获取所有基础模块
  const allModules = [...defaultModules.value, ...categoryNavModules.value];

  // 获取已经被使用的模块key
  const usedModuleKeys = [
    ...leftModules.value.map((m: Recordable) => m.key),
    ...rightModules.value.map((m: Recordable) => m.key),
  ];

  // 过滤掉已经被使用的模块
  return allModules.filter((module) => !usedModuleKeys.includes(module.key));
});

// 布局模块数据
const leftModules = ref<Recordable[]>([]);

const rightModules = ref<Recordable[]>([]);

const decorationConfig = ref<Blog.Config>();
const decoration = ref<Recordable>({});

/**
 * 拖拽事件处理函数
 * 当模块在不同区域之间拖拽时触发，用于调试和监控
 */
const handleDragChange = (evt: any, area: string) => {
  console.log(`🚀 ~ ${area} 区域拖拽变化:`, evt);
  console.log('🚀 ~ 当前可用模块数量:', availableModules.value.length);
  console.log('🚀 ~ 左侧模块数量:', leftModules.value.length);
  console.log('🚀 ~ 右侧模块数量:', rightModules.value.length);
};

/**
 * 获取装饰配置
 * 从后端获取页面装饰配置并初始化左右区域的模块
 */
const getDecorationConfig = async () => {
  const res = await BlogApi.getConfigByKey('decoration');
  console.log('🚀 ~ getDecorationConfig ~ res:', res);
  decorationConfig.value = res;
  if (res?.value) {
    decoration.value = JSON.parse(res?.value || '{}');
    leftModules.value = decoration.value?.leftModules || [];
    rightModules.value = decoration.value?.rightModules || [];
    // 注意：不再需要手动过滤availableModules，因为计算属性会自动处理
  }
};

/**
 * 更新装饰配置
 * 将当前的布局配置保存到后端
 */
const updateDecorationConfig = async (data: any) => {
  await BlogApi.updateConfig({
    id: decorationConfig.value?.id,
    ...data,
  });
};

/**
 * 保存布局配置
 * 将当前的左右区域模块配置保存到后端
 */
const handleSave = async () => {
  console.log('保存布局', { leftModules: leftModules.value, rightModules: rightModules.value });
  decoration.value = {
    leftModules: leftModules.value,
    rightModules: rightModules.value,
  };
  try {
    await updateDecorationConfig({
      value: JSON.stringify(decoration.value),
    });
    window.$message.success('保存成功');
    getDecorationConfig();
  } catch (error) {
    window.$message.error('保存失败');
  }
};
</script>

<style scoped lang="scss">
// 颜色变量
$primary-color: #007bff;
$border-color: #e5e5e5;
$bg-light: #f8f9fa;
$bg-gray: #f5f5f5;
$text-primary: #333;
$text-secondary: #666;
$text-muted: #999;

.decoration-page {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .page-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    width: 100%;
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-left h2 {
      margin: 0;
      font-weight: bold;
      color: $text-primary;
      font-size: 24px;
    }
  }

  .main-content {
    display: flex;
    gap: 24px;
    flex: 1;
    min-height: 0;
  }

  .module-library {
    width: 300px;
    min-width: 280px;
    max-height: calc(100vh - 320px);
    border: 1px solid $border-color;
    border-radius: 12px;
    overflow: hidden;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;

    .library-header {
      padding: 10px 20px;
      background: $bg-light;
      border-bottom: 1px solid $border-color;

      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: $text-primary;
      }
    }

    .module-list {
      padding: 16px;
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: $bg-light;
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: $border-color;
        border-radius: 3px;

        &:hover {
          background: #ccc;
        }
      }

      .module-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px;
        background: white;
        border: 2px solid $border-color;
        border-radius: 8px;
        cursor: grab;
        position: relative;

        &:hover {
          background: #f8f9ff;
          border-color: $primary-color;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
        }

        &:active {
          cursor: grabbing;
          transform: translateY(0);
        }

        .module-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: $primary-color;
          color: white;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .module-info {
          flex: 1;
          min-width: 0;

          .module-name {
            font-weight: 600;
            font-size: 14px;
            color: $text-primary;
            margin-bottom: 4px;
            line-height: 1.2;
          }

          .module-desc {
            font-size: 12px;
            color: $text-secondary;
            line-height: 1.3;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
  }

  .layout-preview {
    flex: 1;
    border: 1px solid $border-color;
    border-radius: 12px;
    overflow: hidden;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 320px);

    .preview-header {
      padding: 20px;
      background: $bg-light;
      border-bottom: 1px solid $border-color;

      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: $text-primary;
      }
    }

    .layout-container {
      display: flex;
      flex: 1;
      min-height: 0;
      gap: 1px;
      background: $border-color;
    }

    .layout-left {
      flex: 1;
    }
    .layout-right {
      flex: 2;
    }

    .layout-left,
    .layout-right {
      background: white;
      display: flex;
      flex-direction: column;
      min-height: 0;

      .area-header {
        padding: 16px;
        border-bottom: 1px solid $border-color;
        display: flex;
        align-items: center;
        justify-content: space-between;

        h4 {
          margin: 0;
          font-size: 14px;
          color: $text-primary;
        }

        span {
          font-size: 12px;
          color: $text-secondary;
          background: white;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid $border-color;
        }
      }

      .module-container {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        position: relative;

        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-track {
          background: $bg-light;
          border-radius: 3px;
        }

        &::-webkit-scrollbar-thumb {
          background: $border-color;
          border-radius: 3px;

          &:hover {
            background: #ccc;
          }
        }

        .draggable-area {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-height: 200px;

          .layout-module {
            .module-placeholder {
              background: white;
              border: 2px solid $border-color;
              border-radius: 8px;
              padding: 16px;

              &:hover {
                border-color: $primary-color;
                box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
              }

              .module-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 1px solid $border-color;

                .module-title {
                  font-weight: 600;
                  font-size: 14px;
                  color: $text-primary;
                }
              }

              .module-content {
                p {
                  margin: 0;
                  font-size: 12px;
                  color: $text-secondary;
                  line-height: 1.4;
                }
              }
            }
          }
        }

        .empty-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          border: 2px dashed $border-color;
          border-radius: 8px;
          background: $bg-light;
          color: $text-muted;

          &:hover {
            border-color: $primary-color;
            background: #f8f9ff;
            color: $primary-color;
          }

          p {
            margin: 8px 0 0 0;
            font-size: 14px;
            font-weight: 500;
          }
        }
      }
    }

    .layout-left {
      border-right: 1px solid $border-color;
    }
  }

  .layout-ghost {
    background: white;
    border: 2px dashed $primary-color;
    border-radius: 8px;
    padding: 16px;
    opacity: 0.8;
    transform: scale(0.98);
  }

  .internal-ghost {
    background: #fafbfc;
    border: 2px dashed $primary-color;
    border-radius: 8px;
    opacity: 0.8;
    transform: scale(0.98);
  }
}
</style>
