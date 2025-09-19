<template>
  <div class="navigation-card" @click="handleCardClick">
    <!-- 卡片头部：图标、标题和操作按钮 -->
    <div class="card-header">
      <div class="title-section">
        <div class="favicon-container">
          <!-- 如果是图片链接，显示图片 -->
          <div v-if="isUrl(navigation.icon)" class="favicon">
            <n-image
              height="20"
              width="20"
              :src="navigation.icon"
              :preview-src-list="[navigation.icon]"
              class="favicon-image"
            />
          </div>
          <!-- 如果是iconify图标，显示图标 -->
          <jay-icon
            v-else-if="isIconifyIcon(navigation.icon)"
            :icon="navigation.icon"
            class="favicon-icon"
            :size="20"
          />
          <!-- 默认显示首字母 -->
          <div v-else class="favicon-letter">
            {{ navigation.name.charAt(0).toUpperCase() }}
          </div>
        </div>
        <h3 class="card-title">{{ navigation.name }}</h3>
      </div>

      <!-- 操作按钮 -->
      <div v-if="props.isAdmin" class="card-actions">
        <n-tooltip trigger="hover" placement="top">
          <template #trigger>
            <button class="action-btn edit-btn" @click.stop="handleEdit">
              <jay-icon icon="mdi:pencil" :size="14" />
            </button>
          </template>
          编辑
        </n-tooltip>
        <n-tooltip trigger="hover" placement="top">
          <template #trigger>
            <button class="action-btn delete-btn" @click.stop="handleDelete">
              <jay-icon icon="mdi:delete" :size="14" />
            </button>
          </template>
          删除
        </n-tooltip>
      </div>
    </div>

    <!-- 卡片内容 -->
    <div class="card-content">
      <div class="card-description">
        {{ navigation.description || '暂无描述' }}
      </div>
      <div class="card-url cursor-pointer" @click.stop="handleCopyPath">{{ navigation.path }}</div>
    </div>

    <!-- 卡片底部：分组、状态和排序 -->
    <div class="card-footer">
      <!-- 分组标签 -->
      <div class="card-groups">
        <span
          v-for="group in navigation.groups"
          :key="group.id"
          class="group-tag cursor-pointer"
          @click.stop="handleGroupClick(group)"
        >
          {{ group.name }}
        </span>
      </div>

      <!-- 管理员操作区域 -->
      <div class="admin-actions" v-if="props.isAdmin">
        <div
          class="status-indicator cursor-pointer"
          :class="{ active: navigation.status === 1 }"
          @click.stop="handleStatusClick(navigation)"
        >
          {{ navigation.status === 1 ? '启用' : '禁用' }}
        </div>
        <div class="sort-order">#{{ navigation.sortOrder }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { JayIcon } from '@/components/common';
import { isIconifyIcon, isUrl } from '@/utils/common/is';

/**
 * 导航卡片组件
 * 用于显示单个导航项的信息和操作按钮
 */
defineOptions({ name: 'NavigationCard' });

/**
 * 组件属性定义
 */
interface Props {
  /** 导航数据 */
  navigation: Navigation.Navigation;
  /** 是否为管理员 */
  isAdmin?: boolean;
}

/**
 * 组件事件定义
 */
interface Emits {
  /** 点击卡片事件 */
  (e: 'click', navigation: Navigation.Navigation): void;
  /** 编辑导航事件 */
  (e: 'edit', navigation: Navigation.Navigation): void;
  /** 删除导航事件 */
  (e: 'delete', navigation: Navigation.Navigation): void;
  /** 复制路径事件 */
  (e: 'copyPath', path: string): void;
  /** 切换状态事件 */
  (e: 'toggle-status', navigation: Navigation.Navigation): void;
  /** 分组点击事件 */
  (e: 'groupClick', group: Navigation.NavigationGroup): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

/**
 * 处理卡片点击事件
 * 打开导航链接
 */
const handleCardClick = () => {
  if (props.isAdmin) {
    return;
  }
  emit('click', props.navigation);
};

/**
 * 处理编辑按钮点击事件
 */
const handleEdit = () => {
  emit('edit', props.navigation);
};

/**
 * 处理删除按钮点击事件
 */
const handleDelete = () => {
  emit('delete', props.navigation);
};

/**
 * 处理状态点击事件
 */
const handleStatusClick = (navigation: Navigation.Navigation) => {
  emit('toggle-status', navigation);
};

/**
 * 处理分组点击事件
 */
const handleGroupClick = (group: Navigation.NavigationGroup) => {
  emit('groupClick', group);
};

/**
 * 处理复制路径按钮点击事件
 */
const handleCopyPath = (e: MouseEvent) => {
  e.preventDefault();
  emit('copyPath', props.navigation.path);
};
</script>

<style scoped lang="scss">
.navigation-card {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 1px 2px rgba(0, 0, 0, 0.06);
  position: relative;
  backdrop-filter: saturate(180%) blur(20px);

  &:hover {
    border-color: rgba(157, 219, 238, 0.8);
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.08),
      0 2px 4px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0) scale(0.98);
    transition-duration: 0.5s;
  }

  // 卡片头部
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .favicon-container {
      .favicon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8f9fa;

        .favicon-image {
          border-radius: 6px;
          object-fit: cover;
        }
      }

      .favicon-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: #f8f9fa;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7280;
      }

      .favicon-letter {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 600;
        color: white;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    .card-title {
      font-size: 20px;
      font-weight: bold;
      color: #1f2937;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;
      min-height: 40px;
      max-height: 40px;
    }

    .card-actions {
      display: flex;
      gap: 8px;

      .action-btn {
        width: 28px;
        height: 28px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;
        background: rgba(0, 0, 0, 0.04);
        color: #6b7280;

        &:hover {
          background: rgba(0, 0, 0, 0.08);
          transform: scale(1.1);
        }

        &:active {
          transform: scale(0.95);
        }

        &.edit-btn:hover {
          background: #007aff;
          color: white;
        }

        &.delete-btn:hover {
          background: #ff3b30;
          color: white;
        }
      }
    }
  }

  // 卡片内容
  .card-content {
    margin: 16px 0;

    .card-description {
      font-size: 14px;
      color: #6b7280;
      margin: 0 0 8px 0;
      line-height: 1.5;
      overflow: hidden;
      min-height: 30px; /* 确保即使没有描述也保持一致的高度 */
    }

    .card-url {
      font-size: 12px;
      color: #007aff;
      background: rgba(0, 122, 255, 0.08);
      padding: 6px 10px;
      border-radius: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 500;
      letter-spacing: 0.2px;
    }
  }

  // 卡片底部
  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid rgba(0, 0, 0, 0.04);
    min-height: 32px;

    .card-groups {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      flex: 1;
      margin-right: 12px;

      .group-tag {
        font-size: 11px;
        font-weight: 500;
        padding: 4px 12px;
        border-radius: 12px;
        background: #f8fafc;
        color: #64748b;
        letter-spacing: 0.3px;
        white-space: nowrap;
        border: 1px solid #e2e8f0;
        transition: all 0.2s ease;

        &:hover {
          background: #f1f5f9;
          color: #475569;
          border-color: #cbd5e1;
        }
      }
    }

    .admin-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;

      .status-indicator {
        font-size: 11px;
        font-weight: 500;
        padding: 3px 6px;
        border-radius: 4px;
        background: rgba(255, 59, 48, 0.1);
        color: #ff3b30;
        letter-spacing: 0.1px;
        border: 1px solid rgba(255, 59, 48, 0.2);

        &.active {
          background: rgba(52, 199, 89, 0.1);
          color: #34c759;
          border-color: rgba(52, 199, 89, 0.2);
        }
      }

      .sort-order {
        font-size: 10px;
        font-weight: 500;
        color: #999;
        background: rgba(0, 0, 0, 0.04);
        padding: 3px 6px;
        border-radius: 4px;
        letter-spacing: 0.3px;
        border: 1px solid rgba(0, 0, 0, 0.08);
      }
    }
  }
}
</style>
