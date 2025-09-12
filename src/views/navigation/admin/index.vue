<template>
  <div class="navigation-body">
    <!-- 左侧标签导航栏 -->
    <div class="sidebar">
      <!-- 搜索框 -->
      <div class="search-container">
        <div class="search-input-wrapper">
          <jay-icon icon="mdi:magnify" class="search-icon" />
          <input v-model="searchQuery" type="text" placeholder="搜索分组..." class="search-input" />
          <div v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
            <jay-icon icon="mdi:close" class="clear-icon" />
          </div>
        </div>
      </div>

      <!-- 导航组列表 -->
      <div class="groups-container">
        <div class="groups-list">
          <div
            v-for="tag in filteredGroups"
            :key="tag.id"
            class="tag-item"
            :class="{ active: navigationGroup?.id === tag.id }"
            @click="selectTag(tag)"
          >
            <div class="tag-icon">
              <jay-icon :icon="tag.icon" :size="24" class="icon" />
            </div>
            <div class="tag-info">
              <div class="tag-name">{{ tag.name }}</div>
              <div class="tag-meta">
                <span class="tag-count"
                  >{{ tag.navigations ? tag.navigations.length : 0 }} 个导航</span
                >
                <span v-if="tag.status === 1" class="tag-status active">启用</span>
                <span v-else class="tag-status inactive">禁用</span>
              </div>
            </div>
            <div class="tag-arrow">
              <jay-icon icon="mdi:chevron-right" class="arrow-icon" />
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!filteredGroups.length" class="empty-state">
          <jay-icon icon="mdi:folder-outline" class="empty-icon" />
          <div class="empty-text">{{ searchQuery ? '未找到匹配的分组' : '暂无分组' }}</div>
          <div v-if="!searchQuery" class="empty-action">
            <button class="add-button" @click="editGroup">
              <jay-icon icon="mdi:plus" class="button-icon" />
              创建第一个分组
            </button>
          </div>
        </div>
      </div>

      <!-- 底部操作区 -->
      <div class="sidebar-footer">
        <button class="add-group-button" @click="editGroup">
          <jay-icon icon="mdi:plus" class="button-icon" />
          <span>添加分组</span>
        </button>
      </div>
    </div>

    <!-- 右侧内容区域 -->
    <div class="content-area">
      <div v-if="navigationGroup" class="group-detail">
        <!-- 分组头部 -->
        <div class="group-header">
          <div class="header-main">
            <div class="group-icon-large">
              <jay-icon :icon="navigationGroup.icon" class="icon" />
            </div>
            <div class="group-info">
              <div class="breadcrumb">
                <span class="breadcrumb-item">导航管理</span>
                <jay-icon icon="mdi:chevron-right" class="breadcrumb-separator" />
                <span class="breadcrumb-current">{{ navigationGroup.name }}</span>
              </div>
              <h1 class="group-title">{{ navigationGroup.name }}</h1>
              <p class="group-description">{{ navigationGroup.description || '暂无描述' }}</p>
              <div class="group-stats">
                <div class="stat-item">
                  <jay-icon icon="mdi:link-variant" class="stat-icon" />
                  <span>{{ navigationGroup.navigations?.length || 0 }} 个导航</span>
                </div>
                <div class="stat-item">
                  <jay-icon icon="mdi:sort-numeric-variant" class="stat-icon" />
                  <span>排序: {{ navigationGroup.sortOrder }}</span>
                </div>
                <div class="stat-item">
                  <jay-icon
                    icon="mdi:circle"
                    class="stat-icon"
                    :class="navigationGroup.status === 1 ? 'status-active' : 'status-inactive'"
                  />
                  <span>{{ navigationGroup.status === 1 ? '已启用' : '已禁用' }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="header-actions">
            <button class="action-button secondary" @click="openEditGroupModal(navigationGroup!)">
              <jay-icon icon="mdi:pencil" class="button-icon" />
              编辑分组
            </button>
            <button class="action-button primary" @click="openCreateNavigationModal()">
              <jay-icon icon="mdi:plus" class="button-icon" />
              添加导航
            </button>
          </div>
        </div>

        <!-- 导航列表 -->
        <div class="navigations-container">
          <div v-if="navigationGroup.navigations?.length" class="navigations-grid">
            <div
              v-for="navigation in navigationGroup.navigations"
              :key="navigation.id"
              class="navigation-card"
              @click="openBookmark(navigation)"
            >
              <div class="navigation-header">
                <div class="navigation-favicon">
                  <div class="favicon-placeholder">
                    {{ navigation.name.charAt(0).toUpperCase() }}
                  </div>
                </div>
                <div class="navigation-actions">
                  <button class="nav-action-btn" @click.stop="editNavigation(navigation)">
                    <jay-icon icon="mdi:pencil" class="action-icon" />
                  </button>
                  <button class="nav-action-btn" @click.stop="deleteNavigation(navigation)">
                    <jay-icon icon="mdi:delete" class="action-icon" />
                  </button>
                </div>
              </div>
              <div class="navigation-content">
                <h3 class="navigation-title">{{ navigation.name }}</h3>
                <p class="navigation-description">{{ navigation.description || '暂无描述' }}</p>
                <div class="navigation-url">{{ navigation.path }}</div>
                <div class="navigation-meta">
                  <span class="meta-item">
                    <jay-icon icon="mdi:sort-numeric-variant" class="meta-icon" />
                    排序: {{ navigation.sortOrder }}
                  </span>
                  <span
                    class="meta-item"
                    :class="navigation.status === 1 ? 'status-active' : 'status-inactive'"
                  >
                    <jay-icon icon="mdi:circle" class="meta-icon" />
                    {{ navigation.status === 1 ? '启用' : '禁用' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="empty-navigations">
            <jay-icon icon="mdi:link-variant-off" class="empty-icon" />
            <div class="empty-text">该分组暂无导航</div>
            <button class="add-navigation-button" @click="openCreateNavigationModal()">
              <jay-icon icon="mdi:plus" class="button-icon" />
              添加第一个导航
            </button>
          </div>
        </div>
      </div>

      <!-- 未选择分组的状态 -->
      <div v-else class="no-selection">
        <div class="welcome-content">
          <div class="welcome-illustration">
            <jay-icon icon="mdi:folder-multiple-outline" class="welcome-icon" />
          </div>
          <h2 class="welcome-title">导航管理系统</h2>
          <p class="welcome-description">选择左侧的分组来查看和管理导航链接</p>
          <div class="welcome-features">
            <div class="feature-item">
              <jay-icon icon="mdi:folder-plus" class="feature-icon" />
              <span>创建分组</span>
            </div>
            <div class="feature-item">
              <jay-icon icon="mdi:link-plus" class="feature-icon" />
              <span>添加导航</span>
            </div>
            <div class="feature-item">
              <jay-icon icon="mdi:sort" class="feature-icon" />
              <span>排序管理</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建分组/导航弹窗 -->
    <CreateModal @register="registerModal" @success="handleModalSuccess" />
  </div>
</template>

<script setup lang="ts">
import { NavigationApi } from '@/api';
import { JayIcon, useModal } from '@/components';
import { computed, ref } from 'vue';
import CreateModal from './components/CreateModal.vue';

defineOptions({ name: 'Navigation' });

onMounted(() => {
  getNavigationGroup();
});

const navigationGroups = ref<Navigation.NavigationGroup[]>([]);

const getNavigationGroup = async () => {
  const res = await NavigationApi.getNavigationGroup({
    options: {
      showPagination: false,
      with_navigation: true,
    },
  });
  console.log('🚀 ~ getNavigationGroup ~ res:', res);
  navigationGroups.value = res.data;
};

// 响应式数据
const searchQuery = ref('');
const navigationGroup = ref<Navigation.NavigationGroup | null>(null);

// 计算属性：过滤标签
const filteredGroups = computed(() => {
  if (!searchQuery.value) {
    return navigationGroups.value;
  }
  return navigationGroups.value.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

/**
 * 编辑标签
 */
const editGroup = () => {
  openCreateGroupModal();
};

/**
 * 选择标签
 * @param tag 标签数据
 */
const selectTag = (group: Navigation.NavigationGroup) => {
  navigationGroup.value = group;
};

/**
 * 打开书签
 * @param bookmark 书签数据
 */
const openBookmark = (bookmark: Navigation.Navigation) => {
  window.open(bookmark.path, '_blank');
};

/**
 * 编辑导航
 * @param navigation 导航数据
 */
const editNavigation = (navigation: Navigation.Navigation) => {
  openEditNavigationModal(navigation);
};

/**
 * 删除导航
 * @param navigation 导航数据
 */
const deleteNavigation = (navigation: Navigation.Navigation) => {
  console.log('删除导航:', navigation);
};

// 弹窗相关
const [registerModal, { openModal }] = useModal();

/**
 * 打开创建分组弹窗
 */
const openCreateGroupModal = () => {
  openModal(true, {
    type: 'group',
    isUpdate: false,
  });
};

/**
 * 打开编辑分组弹窗
 * @param group 分组数据
 */
const openEditGroupModal = (group: Navigation.NavigationGroup) => {
  openModal(true, {
    type: 'group',
    isUpdate: true,
    record: group,
  });
};

/**
 * 打开创建导航弹窗
 * @param group 所属分组
 */
const openCreateNavigationModal = (group?: Navigation.NavigationGroup) => {
  const targetGroup = group || navigationGroup.value;
  if (!targetGroup) {
    window.$message?.warning('请先选择一个分组');
    return;
  }

  openModal(true, {
    type: 'navigation',
    isUpdate: false,
    group: targetGroup,
  });
};

/**
 * 打开编辑导航弹窗
 * @param navigation 导航数据
 */
const openEditNavigationModal = (navigation: Navigation.Navigation) => {
  openModal(true, {
    type: 'navigation',
    isUpdate: true,
    record: navigation,
    group: navigationGroup.value,
  });
};

/**
 * 弹窗操作成功回调
 */
const handleModalSuccess = () => {
  // 刷新数据
  getNavigationGroup();
};
</script>

<style scoped lang="scss">
.navigation-body {
  display: flex;
  flex: 1;
  height: 100%;
  background: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;

  .sidebar {
    width: 320px;
    background: #ffffff;
    border-right: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;

    .search-container {
      padding: 20px;
      border-bottom: 1px solid #f1f5f9;
      background: #ffffff;

      .search-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;

        .search-icon {
          position: absolute;
          left: 14px;
          font-size: 18px;
          color: #64748b;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          padding: 14px 44px 14px 44px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: #f8fafc;
          font-size: 14px;
          color: #334155;
          transition: all 0.3s ease;
          font-weight: 500;

          &:focus {
            outline: none;
            border-color: #667eea;
            background: #ffffff;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
          }

          &::placeholder {
            color: #94a3b8;
            font-weight: 400;
          }
        }

        .search-clear {
          position: absolute;
          right: 14px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background: #64748b;
          }

          .clear-icon {
            font-size: 12px;
            color: white;
          }
        }
      }
    }

    .groups-container {
      flex: 1;
      overflow-y: auto;
      padding: 0;

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 2px;
        transition: background 0.2s ease;

        &:hover {
          background: #94a3b8;
        }
      }

      .groups-list {
        padding: 8px 0;
        .tag-item {
          display: flex;
          align-items: center;
          padding: 12px;
          margin: 0 12px 8px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;

          &:hover {
            background: #f8fafc;
            border-color: #e2e8f0;

            .tag-arrow {
              opacity: 1;
            }
          }

          &.active {
            border-color: #667eea;
            box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
            background: #dbeafe;

            .tag-icon {
              background: rgba(255, 255, 255, 0.2) !important;
            }

            .tag-arrow {
              opacity: 1;
              transform: translateX(0);
              color: #667eea;
            }
          }

          .tag-icon {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 16px;
            flex-shrink: 0;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .tag-info {
            flex: 1;
            min-width: 0;

            .tag-name {
              font-size: 16px;
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 6px;
              transition: all 0.3s ease;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .tag-meta {
              display: flex;
              align-items: center;
              gap: 12px;
              font-size: 13px;

              .tag-count {
                color: #64748b;
                font-weight: 500;
              }

              .tag-status {
                padding: 2px 8px;
                border-radius: 6px;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;

                &.active {
                  background: #dcfce7;
                  color: #166534;
                }

                &.inactive {
                  background: #fef2f2;
                  color: #dc2626;
                }
              }
            }
          }

          .tag-arrow {
            opacity: 0;
            transform: translateX(-8px);
            transition: all 0.3s ease;
            color: #94a3b8;

            .arrow-icon {
              font-size: 16px;
            }
          }
        }
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        text-align: center;

        .empty-icon {
          font-size: 64px;
          color: #cbd5e1;
          margin-bottom: 20px;
        }

        .empty-text {
          font-size: 16px;
          color: #64748b;
          margin-bottom: 24px;
          font-weight: 500;
        }

        .empty-action {
          .add-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

            &:hover {
              background: #2563eb;
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
            }

            .button-icon {
              font-size: 16px;
            }
          }
        }
      }
    }

    .sidebar-footer {
      padding: 20px;
      border-top: 1px solid #f1f5f9;
      background: #ffffff;

      .add-group-button {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 14px 20px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

        &:hover {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .button-icon {
          font-size: 18px;
        }
      }
    }
  }

  .content-area {
    flex: 1;
    background: #f8fafc;
    overflow-y: auto;
    display: flex;
    flex-direction: column;

    .group-detail {
      flex: 1;
      display: flex;
      flex-direction: column;

      .group-header {
        background: #ffffff;
        border-bottom: 1px solid #e2e8f0;
        padding: 32px 40px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

        .header-main {
          display: flex;
          align-items: flex-start;
          gap: 24px;
          flex: 1;

          .group-icon-large {
            width: 72px;
            height: 72px;
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);

            .icon {
              font-size: 36px;
              color: #ffffff;
            }
          }

          .group-info {
            flex: 1;

            .breadcrumb {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 12px;
              font-size: 14px;

              .breadcrumb-item {
                color: #64748b;
                font-weight: 500;
              }

              .breadcrumb-separator {
                color: #cbd5e1;
                font-size: 12px;
              }

              .breadcrumb-current {
                color: #334155;
                font-weight: 600;
              }
            }

            .group-title {
              font-size: 32px;
              font-weight: 700;
              color: #1e293b;
              margin: 0 0 12px 0;
              line-height: 1.2;
            }

            .group-description {
              font-size: 16px;
              color: #64748b;
              margin: 0 0 20px 0;
              line-height: 1.5;
            }

            .group-stats {
              display: flex;
              gap: 24px;
              flex-wrap: wrap;

              .stat-item {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                color: #64748b;
                font-weight: 500;

                .stat-icon {
                  font-size: 16px;

                  &.status-active {
                    color: #22c55e;
                  }

                  &.status-inactive {
                    color: #ef4444;
                  }
                }
              }
            }
          }
        }

        .header-actions {
          display: flex;
          gap: 12px;
          flex-shrink: 0;

          .action-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            border: none;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;

            .button-icon {
              font-size: 16px;
            }

            &.primary {
              background: #3b82f6;
              color: white;
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

              &:hover {
                background: #2563eb;
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
              }
            }

            &.secondary {
              background: #f8fafc;
              color: #475569;
              border: 1px solid #e2e8f0;

              &:hover {
                background: #f1f5f9;
                border-color: #cbd5e1;
                transform: translateY(-1px);
              }
            }
          }
        }
      }

      .navigations-container {
        flex: 1;
        padding: 24px 40px;
        overflow-y: auto;

        .navigations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 24px;

          .navigation-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
            position: relative;
            overflow: hidden;

            &::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: #3b82f6;
              transform: scaleX(0);
              transition: transform 0.3s ease;
            }

            &:hover {
              border-color: #cbd5e1;
              box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
              transform: translateY(-4px);

              &::before {
                transform: scaleX(1);
              }

              .navigation-actions {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .navigation-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 20px;

              .navigation-favicon {
                .favicon-placeholder {
                  width: 48px;
                  height: 48px;
                  border-radius: 12px;
                  background: #f3f4f6;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 20px;
                  font-weight: 700;
                  color: #6b7280;
                  text-transform: uppercase;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
              }

              .navigation-actions {
                display: flex;
                gap: 8px;
                opacity: 0;
                transform: translateY(-8px);
                transition: all 0.3s ease;

                .nav-action-btn {
                  width: 32px;
                  height: 32px;
                  border: none;
                  border-radius: 8px;
                  background: #f8fafc;
                  color: #64748b;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transition: all 0.2s ease;

                  &:hover {
                    background: #e2e8f0;
                    color: #334155;
                    transform: scale(1.1);
                  }

                  .action-icon {
                    font-size: 14px;
                  }
                }
              }
            }

            .navigation-content {
              .navigation-title {
                font-size: 20px;
                font-weight: 700;
                color: #1e293b;
                margin: 0 0 12px 0;
                line-height: 1.3;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .navigation-description {
                font-size: 14px;
                color: #64748b;
                line-height: 1.6;
                margin: 0 0 16px 0;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                min-height: 44px;
              }

              .navigation-url {
                font-size: 13px;
                color: #3b82f6;
                background: #eff6ff;
                padding: 8px 12px;
                border-radius: 8px;
                margin-bottom: 16px;
                font-family: 'Monaco', 'Menlo', monospace;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                border: 1px solid #dbeafe;
              }

              .navigation-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                color: #64748b;

                .meta-item {
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  font-weight: 500;

                  .meta-icon {
                    font-size: 12px;
                  }

                  &.status-active {
                    color: #22c55e;
                  }

                  &.status-inactive {
                    color: #ef4444;
                  }
                }
              }
            }
          }
        }

        .empty-navigations {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          text-align: center;

          .empty-icon {
            font-size: 80px;
            color: #cbd5e1;
            margin-bottom: 24px;
          }

          .empty-text {
            font-size: 18px;
            color: #64748b;
            margin-bottom: 32px;
            font-weight: 500;
          }

          .add-navigation-button {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 16px 32px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

            &:hover {
              background: #2563eb;
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
            }

            .button-icon {
              font-size: 18px;
            }
          }
        }
      }
    }

    .no-selection {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      margin: 20px;

      .welcome-content {
        text-align: center;
        max-width: 500px;
        padding: 60px 40px;

        .welcome-illustration {
          margin-bottom: 32px;

          .welcome-icon {
            font-size: 120px;
            color: #cbd5e1;
            opacity: 0.8;
          }
        }

        .welcome-title {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 16px 0;
        }

        .welcome-description {
          font-size: 16px;
          color: #64748b;
          margin: 0 0 32px 0;
          line-height: 1.6;
        }

        .welcome-features {
          display: flex;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;

          .feature-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 16px;
            background: #f8fafc;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;

            &:hover {
              background: #f1f5f9;
              border-color: #cbd5e1;
              transform: translateY(-2px);
            }

            .feature-icon {
              font-size: 24px;
              color: #3b82f6;
            }

            span {
              font-size: 14px;
              font-weight: 500;
              color: #475569;
            }
          }
        }
      }
    }
  }
}
</style>
