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
        <!-- 分组状态筛选按钮 -->
        <div v-if="showAdminFeatures" class="group-filter-container">
          <n-button
            :type="showOnlyEnabledGroups ? 'primary' : 'default'"
            size="small"
            class="group-filter-button"
            @click="toggleGroupStatusFilter"
          >
            <template #icon>
              <jay-icon
                :icon="showOnlyEnabledGroups ? 'mdi:eye' : 'mdi:eye-off'"
                class="button-icon"
              />
            </template>
            {{ showOnlyEnabledGroups ? '仅启用分组' : '全部分组' }}
          </n-button>
        </div>
      </div>

      <!-- 导航组列表 -->
      <div class="groups-container">
        <!-- 全部分组 -->
        <div class="groups-list">
          <div
            v-if="allGroup"
            class="tag-item none_draggable"
            @click="selectTag(allGroup)"
            :class="{
              active: navigationGroup?.id === allGroup.id,
            }"
          >
            <div class="tag-icon">
              <jay-icon :icon="allGroup.icon" :size="24" class="icon" />
            </div>
            <div class="tag-info">
              <div class="tag-name">{{ allGroup.name }}</div>
              <div class="tag-meta">
                <span class="tag-count">{{ allGroup.navigationCount || 0 }} 个导航</span>
              </div>
            </div>
          </div>
        </div>
        <VueDraggable
          v-model="navigationGroups"
          group="navigationGroups"
          :animation="200"
          :easing="'cubic-bezier(0.25, 0.46, 0.45, 0.94)'"
          filter=".none_draggable"
          :class="[
            'groups-list',
            showAdminFeatures ? 'admin-draggable-groups' : 'non-admin-groups',
          ]"
          ghostClass="group-drag-ghost"
          chosenClass="group-drag-chosen"
          dragClass="group-drag-dragging"
          :disabled="!showAdminFeatures"
          @start="onGroupDragStart"
          @end="onGroupDragEnd"
          @move="onGroupDragMove"
        >
          <div
            v-for="tag in filteredGroups"
            :key="tag.id"
            class="tag-item"
            :class="{
              active: navigationGroup?.id === tag.id,
              none_draggable: tag.id === 0,
            }"
            @click="selectTag(tag)"
          >
            <div class="tag-icon">
              <jay-icon :icon="tag.icon" :size="24" class="icon" />
            </div>
            <div class="tag-info">
              <div class="tag-name">{{ tag.name }}</div>
              <div class="tag-meta">
                <span class="tag-count">{{ tag.navigationCount || 0 }} 个导航</span>
                <template v-if="showAdminFeatures">
                  <span
                    class="tag-status cursor-pointer"
                    :class="tag.status === 1 ? 'active' : 'inactive'"
                    @click.stop="toggleNavigationGroupStatus(tag)"
                    >{{ tag.status === 1 ? '启用' : '禁用' }}</span
                  >
                </template>
              </div>
            </div>
            <div class="tag-actions">
              <n-button
                v-if="showAdminFeatures && tag.id !== 0"
                class="tag-action-btn delete"
                @click.stop="deleteNavigationGroup(tag)"
                text
                size="small"
              >
                <template #icon>
                  <jay-icon icon="mdi:delete" class="action-icon" />
                </template>
              </n-button>
              <div class="tag-arrow">
                <jay-icon icon="mdi:chevron-right" class="arrow-icon" />
              </div>
            </div>
          </div>
        </VueDraggable>

        <!-- 空状态 -->
        <div v-if="!filteredGroups.length" class="empty-state">
          <jay-icon icon="mdi:folder-outline" class="empty-icon" />
          <div class="empty-text">{{ searchQuery ? '未找到匹配的分组' : '暂无分组' }}</div>
          <div v-if="!searchQuery && showAdminFeatures" class="empty-action">
            <n-button class="add-button" @click="editGroup" type="primary">
              <template #icon>
                <jay-icon icon="mdi:plus" class="button-icon" />
              </template>
              创建第一个分组
            </n-button>
          </div>
        </div>
      </div>

      <!-- 底部操作区 -->
      <div v-if="showAdminFeatures" class="sidebar-footer">
        <n-button class="add-group-button" @click="editGroup" type="primary" block>
          <template #icon>
            <jay-icon icon="mdi:plus" class="button-icon" />
          </template>
          <span>添加分组</span>
        </n-button>
      </div>
    </div>

    <!-- 右侧内容区域 -->
    <div class="content-area">
      <div v-if="navigationGroup" class="group-detail">
        <!-- 分组头部 -->
        <div class="group-header">
          <div class="header-main">
            <div class="group-icon-large">
              <jay-icon :icon="navigationGroup.icon" :size="40" class="icon" />
            </div>
            <div class="group-info">
              <h1 class="group-title">{{ navigationGroup.name }}</h1>
              <p class="group-description">{{ navigationGroup.description || '暂无描述' }}</p>
              <div class="group-stats">
                <div class="stat-item">
                  <jay-icon icon="mdi:link-variant" class="stat-icon" />
                  <span>{{ currentNavigations?.length || 0 }} 个导航</span>
                </div>
                <div class="stat-item" v-if="showAdminFeatures && navigationGroup.id !== 0">
                  <jay-icon icon="mdi:sort-numeric-variant" class="stat-icon" />
                  <span>排序: {{ navigationGroup.sortOrder }}</span>
                </div>
                <div class="stat-item" v-if="showAdminFeatures">
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
          <div class="header-actions" v-if="isAdminUser">
            <!-- 游客模式切换按钮 -->
            <n-button
              class="action-button guest-mode"
              @click="toggleGuestMode"
              :type="isGuestMode ? 'warning' : 'default'"
            >
              <template #icon>
                <jay-icon
                  :icon="isGuestMode ? 'mdi:account-check' : 'mdi:account-eye'"
                  class="button-icon"
                />
              </template>
              {{ isGuestMode ? '退出游客模式' : '游客模式预览' }}
            </n-button>

            <n-button
              v-if="showAdminFeatures && navigationGroup?.id !== 0"
              class="action-button danger"
              @click="deleteNavigationGroup(navigationGroup!)"
              type="error"
            >
              <template #icon>
                <jay-icon icon="mdi:delete" class="button-icon" />
              </template>
              删除分组
            </n-button>
            <n-button
              v-if="showAdminFeatures && navigationGroup?.id !== 0"
              class="action-button secondary"
              @click="openEditGroupModal(navigationGroup!)"
              type="default"
            >
              <template #icon>
                <jay-icon icon="mdi:pencil" class="button-icon" />
              </template>
              编辑分组
            </n-button>
            <n-button
              v-if="showAdminFeatures && navigationGroup?.id === 0"
              class="action-button primary"
              @click="resetSortOrder"
            >
              <template #icon>
                <jay-icon icon="mdi:refresh" class="button-icon" />
              </template>
              重置排序
            </n-button>
            <n-button
              v-if="showAdminFeatures && navigationGroup?.id === 0"
              class="reset-group-button"
              @click="resetNavigationGroupsSort"
            >
              <template #icon>
                <jay-icon icon="mdi:refresh" class="button-icon" />
              </template>
              <span>重置分组排序</span>
            </n-button>
            <!-- 状态筛选按钮 -->
            <n-button
              v-if="showAdminFeatures"
              class="action-button filter"
              @click="toggleStatusFilter"
              :type="showOnlyEnabled ? 'primary' : 'default'"
            >
              <template #icon>
                <jay-icon :icon="showOnlyEnabled ? 'mdi:eye' : 'mdi:eye-off'" class="button-icon" />
              </template>
              {{ showOnlyEnabled ? '仅启用' : '全部状态' }}
            </n-button>
            <!-- 刷新按钮 -->
            <n-button class="action-button refresh" @click="refreshData" type="success">
              <template #icon>
                <jay-icon icon="mdi:refresh" class="button-icon" />
              </template>
              刷新
            </n-button>
            <n-button
              v-if="showAdminFeatures"
              class="action-button primary"
              @click="openCreateNavigationModal()"
              type="primary"
            >
              <template #icon>
                <jay-icon icon="mdi:plus" class="button-icon" />
              </template>
              添加导航
            </n-button>
          </div>
        </div>

        <!-- 导航列表 -->
        <div class="navigations-container">
          <Transition :name="appStore.transitionAnimation" mode="out-in">
            <div v-if="currentNavigations?.length" :key="navigationGroup.id">
              <VueDraggable
                ref="draggableRef"
                v-model="currentNavigations"
                group="navigation"
                :animation="200"
                :easing="'cubic-bezier(0.25, 0.46, 0.45, 0.94)'"
                filter=".none_draggable"
                :id="navigationGroup.id"
                :class="['navigations-grid', showAdminFeatures ? 'admin-draggable' : 'non-admin']"
                :scrollSensitivity="80"
                :scroll-speed="10"
                ghostClass="drag-ghost"
                chosenClass="drag-chosen"
                dragClass="drag-dragging"
                :force-fallback="false"
                :fallback-tolerance="3"
                :delay="0"
                :delay-on-touch-start="false"
                :touch-start-threshold="5"
                :disabled="!showAdminFeatures"
                @start="onDragStart"
                @end="onDragEnd"
                @move="onDragMove"
              >
                <NavigationCard
                  v-for="navigation in currentNavigations"
                  :key="navigation.id"
                  :navigation="navigation"
                  :is-admin="showAdminFeatures"
                  :loading="loadingStates[navigation.id] || false"
                  @click="openBookmark"
                  @edit="editNavigation"
                  @delete="deleteNavigation"
                  @copyPath="copyPath"
                  @toggle-status="toggleNavigationStatus"
                  @groupClick="selectTag"
                />
              </VueDraggable>
            </div>

            <!-- 空状态 -->
            <div v-else class="empty-navigations">
              <jay-icon icon="mdi:link-variant-off" class="empty-icon" />
              <div class="empty-text">该分组暂无导航</div>
              <n-button
                v-if="showAdminFeatures"
                class="add-navigation-button"
                @click="openCreateNavigationModal()"
                type="primary"
              >
                <template #icon>
                  <jay-icon icon="mdi:plus" class="button-icon" />
                </template>
                添加第一个导航
              </n-button>
            </div>
          </Transition>
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
import { NavigationApi, PublicApi } from '@/api';
import { useModal } from '@/components';
import { useAppStore } from '@/store';
import { isAdmin } from '@/utils/common/hasPermission';
import { UseDraggableReturn, VueDraggable } from 'vue-draggable-plus';
import { CreateModal, NavigationCard } from './components';

defineOptions({ name: 'Navigation' });

const appStore = useAppStore();
// 权限控制的响应式变量
const isAdminUser = ref(isAdmin());
// 游客模式切换状态（仅在管理员模式下可用）
const isGuestMode = ref(false);
// 计算当前是否应该显示管理员功能（真实管理员权限 && 未开启游客模式）
const showAdminFeatures = computed(() => isAdminUser.value && !isGuestMode.value);
const draggableRef = ref<UseDraggableReturn>();

onMounted(async () => {
  await getNavigationGroup();

  // 获取所有导航的数量用于"全部"分组
  const allNavigations = await getNavigationList(0);
  const allNavigationCount = allNavigations.length;

  // 初始化"全部"分组
  allGroup.value.navigationCount = allNavigationCount;
  // 默认选择"全部"分组并同步数据
  await selectDefaultAllGroup();
});

const navigationGroups = ref<Navigation.NavigationGroup[]>([]);
const allGroup = ref<Navigation.NavigationGroup>({
  id: 0,
  name: '全部',
  icon: 'streamline-emojis:ballot-box-with-check',
  navigations: [],
  navigationCount: 0,
  status: 1,
});

/**
 * 获取导航分组列表
 * 支持状态筛选：非管理员只能查看启用状态的分组，管理员可以根据筛选设置查看
 */
const getNavigationGroup = async () => {
  // 分组状态筛选逻辑：
  // 1. 非管理员：只查询启用状态的分组
  // 2. 管理员在游客模式下：只查询启用状态的分组
  // 3. 管理员在管理模式下：根据showOnlyEnabledGroups变量决定是否筛选状态
  const shouldFilterByStatus = !showAdminFeatures.value || showOnlyEnabledGroups.value;

  const res = await NavigationApi.getNavigationGroup({
    options: {
      showPagination: false,
      with_navigation: false,
      with_navigation_count: true,
    },
    filters: {
      ...(shouldFilterByStatus ? { status: 1 } : {}),
    },
  });
  navigationGroups.value = res.data;
};

/**
 * 选择默认的"全部"分组并同步数据
 */
const selectDefaultAllGroup = async () => {
  await selectTag(allGroup.value);
};

/**
 * 获取导航列表
 * @param groupId 分组ID，0表示全部分组
 * @returns 导航列表
 */
const getNavigationList = async (groupId?: number): Promise<Navigation.Navigation[]> => {
  if (groupId === 0) {
    groupId = undefined;
  }

  // 状态筛选逻辑：
  // 1. 非管理员：只查询启用状态的导航
  // 2. 管理员在游客模式下：只查询启用状态的导航
  // 3. 管理员在管理模式下：根据showOnlyEnabled变量决定是否筛选状态
  const shouldFilterByStatus = !showAdminFeatures.value || showOnlyEnabled.value;

  const res = await NavigationApi.navigationList({
    filters: {
      groupId: groupId ?? undefined,
      ...(shouldFilterByStatus ? { status: 1 } : {}),
    },
    options: {
      showPagination: false,
      with_navigation_group: true,
    },
  });
  return res.data;
};

// 响应式数据
const searchQuery = ref('');
const navigationGroup = ref<Navigation.NavigationGroup | null>(null);
const currentNavigations = ref<Navigation.Navigation[] | null>([]);
// 导航状态筛选：管理员可以切换是否只显示启用状态的导航
const showOnlyEnabled = ref(false);
// 分组状态筛选：管理员可以切换是否只显示启用状态的分组
const showOnlyEnabledGroups = ref(false);
// 加载状态管理
const loadingStates = ref<Record<number, boolean>>({});

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
 * 切换导航状态筛选
 * 管理员可以切换是否只显示启用状态的导航
 */
const toggleStatusFilter = async () => {
  showOnlyEnabled.value = !showOnlyEnabled.value;

  // 切换导航筛选状态后，重新获取当前分组的导航数据
  if (navigationGroup.value?.id === 0) {
    await selectDefaultAllGroup();
  } else if (navigationGroup.value) {
    // 如果选中的是其他分组，重新获取该分组的导航数据
    await selectTag(navigationGroup.value);
  }
};

/**
 * 切换分组状态筛选
 * 管理员可以切换是否只显示启用状态的分组
 */
const toggleGroupStatusFilter = async () => {
  showOnlyEnabledGroups.value = !showOnlyEnabledGroups.value;

  // 切换分组筛选状态后，重新获取分组列表
  await getNavigationGroup();

  // 如果当前选中的分组在筛选后不可见，则选择"全部"分组
  if (navigationGroup.value && navigationGroup.value.id !== 0) {
    const currentGroupExists = navigationGroups.value.some(
      (group) => group.id === navigationGroup.value?.id,
    );
    if (!currentGroupExists) {
      await selectDefaultAllGroup();
    } else {
      // 如果当前分组仍然存在，重新获取该分组的导航数据
      await selectTag(navigationGroup.value);
    }
  } else {
    // 如果当前选中的是"全部"分组，重新同步数据
    await selectDefaultAllGroup();
  }
};

/**
 * 切换游客模式
 * 管理员可以一键切换到游客模式来预览页面效果
 */
const toggleGuestMode = async () => {
  // 只有真实的管理员才能切换游客模式
  if (!isAdminUser.value) {
    return;
  }

  isGuestMode.value = !isGuestMode.value;

  // 切换模式后重新获取数据，因为游客模式下的数据筛选逻辑不同
  await getNavigationGroup();

  // 重新获取当前分组的导航数据
  if (navigationGroup.value?.id === 0) {
    await selectDefaultAllGroup();
  } else if (navigationGroup.value) {
    await selectTag(navigationGroup.value);
  }

  // 显示切换提示
  const modeText = isGuestMode.value ? '游客模式' : '管理员模式';
  window.$message?.success(`已切换到${modeText}`);
};

/**
 * 刷新数据
 * 重新获取分组列表和当前选中分组的导航数据
 */
const refreshData = async () => {
  try {
    // 重新获取分组列表
    await getNavigationGroup();

    // 重新获取当前选中分组的导航数据
    if (navigationGroup.value?.id === 0) {
      // 如果选中的是"全部"分组，重新获取所有导航数据
      await selectDefaultAllGroup();
    } else if (navigationGroup.value) {
      // 如果选中的是其他分组，重新获取该分组的导航数据
      await selectTag(navigationGroup.value);
    }

    // 显示刷新成功提示
    window.$message?.success('数据刷新成功');
  } catch (error) {
    console.error('刷新数据失败:', error);
    window.$message?.error('数据刷新失败');
  }
};

/**
 * 选择标签
 * @param tag 标签数据
 */
const selectTag = async (group: Navigation.NavigationGroup) => {
  currentNavigations.value = await getNavigationList(group.id);
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
  window.$dialog?.warning({
    title: '确认删除',
    content: `确定要删除导航"${navigation.name}"吗？此操作不可撤销。`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await NavigationApi.deleteNavigation(navigation.id);
        window.$message?.success('删除成功');

        // 刷新数据
        await getNavigationGroup();

        // 如果当前选中的是"全部"分组，需要重新同步数据
        if (navigationGroup.value?.id === 0) {
          await selectDefaultAllGroup();
        } else if (navigationGroup.value) {
          // 如果选中的是其他分组，重新获取该分组的导航数据
          await selectTag(navigationGroup.value);
        }
      } catch (error) {
        console.error('删除导航失败:', error);
        window.$message?.error('删除失败，请重试');
      }
    },
  });
};

/**
 * 切换导航状态（启用/禁用）
 * @param navigation 导航数据
 */
const toggleNavigationStatus = (navigation: Navigation.Navigation) => {
  const isEnable = navigation.status === 0; // 当前是禁用状态，要启用
  const action = isEnable ? '启用' : '禁用';
  const dialogType = isEnable ? 'info' : 'warning';

  window.$dialog[dialogType]({
    title: `确认${action}`,
    content: `确定要${action}导航【${navigation.name}】吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        // 设置加载状态
        loadingStates.value[navigation.id] = true;

        // 调用对应的API
        if (isEnable) {
          await NavigationApi.enable(navigation.id);
        } else {
          await NavigationApi.disable(navigation.id);
        }

        // 更新本地数据状态
        if (currentNavigations.value) {
          const targetNavigation = currentNavigations.value.find((nav) => nav.id === navigation.id);
          if (targetNavigation) {
            targetNavigation.status = isEnable ? 1 : 0;
          }
        }

        window.$message.success(`导航已${action}`);
      } catch (error) {
        window.$message.error(`${action}导航失败`);
        console.error(`${action}导航失败:`, error);
      } finally {
        // 清除加载状态
        loadingStates.value[navigation.id] = false;
      }
    },
  });
};

/**
 * 切换导航分组状态（启用/禁用）
 * @param group 导航分组数据
 */
const toggleNavigationGroupStatus = (group: Navigation.NavigationGroup) => {
  const isEnable = group.status === 0; // 当前是禁用状态，要启用
  const action = isEnable ? '启用' : '禁用';
  const dialogType = isEnable ? 'info' : 'warning';

  // 禁用时的特殊提示
  const content = isEnable
    ? `确定要${action}导航分组【${group.name}】吗？`
    : `确定要${action}导航分组【${group.name}】吗？如果禁用则同时禁用该分组下的所有导航。`;

  window.$dialog[dialogType]({
    title: `确认${action}`,
    content,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        // 设置加载状态
        loadingStates.value[group.id] = true;

        // 调用对应的API
        if (isEnable) {
          await NavigationApi.enableNavigationGroup(group.id);
        } else {
          await NavigationApi.disableNavigationGroup(group.id);
        }

        // 更新本地数据状态
        if (navigationGroups.value) {
          const targetGroup = navigationGroups.value.find((nav) => nav.id === group.id);
          if (targetGroup) {
            targetGroup.status = isEnable ? 1 : 0;
          }
        }

        window.$message.success(`导航分组已${action}`);
      } catch (error) {
        window.$message.error(`${action}导航分组失败`);
        console.error(`${action}导航分组失败:`, error);
      } finally {
        // 清除加载状态
        loadingStates.value[group.id] = false;
      }
    },
  });
};

/**
 * 复制路径
 * @param path 路径
 */
const copyPath = async (path: string) => {
  const { copy, text } = useClipboard({ source: path });
  try {
    await copy();
    window.$message?.success(`复制成功 ${text.value}`);
  } catch (error) {
    console.error('复制路径失败:', error);
    window.$message?.error('复制失败，请重试');
  }
};

// 弹窗相关
const [registerModal, { openModal }] = useModal();

/**
 * 打开创建分组弹窗
 */
const openCreateGroupModal = () => {
  openModal({
    type: 'group',
    isUpdate: false,
  });
};

/**
 * 打开编辑分组弹窗
 * @param group 分组数据
 */
const openEditGroupModal = (group: Navigation.NavigationGroup) => {
  openModal({
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

  openModal({
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
  openModal({
    type: 'navigation',
    isUpdate: true,
    record: navigation,
    group: navigationGroup.value,
  });
};

/**
 * 删除导航组
 * @param group 导航组数据
 */
const deleteNavigationGroup = (group: Navigation.NavigationGroup) => {
  const navigationCount = group.navigationCount || group.navigations?.length || 0;
  const hasNavigations = navigationCount > 0;

  window.$dialog?.warning({
    title: '确认删除',
    content: hasNavigations
      ? `分组"${group.name}"中还有 ${navigationCount} 个导航，删除分组将同时删除所有导航。此操作不可撤销，确定要继续吗？`
      : `确定要删除分组"${group.name}"吗？此操作不可撤销。`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await NavigationApi.deleteNavigationGroup(group.id);
        window.$message?.success('删除成功');

        // 刷新数据
        await getNavigationGroup();

        // 删除分组后自动选择"全部"分组
        await selectDefaultAllGroup();
      } catch (error) {
        console.error('删除导航组失败:', error);
        window.$message?.error(`删除分组"${group.name}"失败，${error}`);
      }
    },
  });
};

/**
 * 弹窗操作成功回调
 */
const handleModalSuccess = async () => {
  // 刷新数据
  await getNavigationGroup();

  // 如果当前选中的是"全部"分组，需要重新同步数据
  if (navigationGroup.value?.id === 0) {
    await selectDefaultAllGroup();
  } else if (navigationGroup.value) {
    // 如果选中的是其他分组，重新获取该分组的导航数据
    await selectTag(navigationGroup.value);
  }
};

/**
 * 重置排序
 * @param group 导航组数据
 */
const resetSortOrder = async () => {
  try {
    await PublicApi.resetSort({
      tableName: 'navigation',
    });
    window.$message?.success('重置排序成功');

    // 刷新数据
    await getNavigationGroup();

    // 如果当前选中的是"全部"分组，需要重新同步数据
    if (navigationGroup.value?.id === 0) {
      await selectDefaultAllGroup();
    } else if (navigationGroup.value) {
      // 如果选中的是其他分组，重新获取该分组的导航数据
      await selectTag(navigationGroup.value);
    }
  } catch (error) {
    console.error('重置排序失败:', error);
    window.$message?.error('重置排序失败，请重试');
  }
};

/**
 * 重置导航组
 * 删除所有自定义导航组，保留"全部"分组
 */
const resetNavigationGroupsSort = () => {
  const groupCount = navigationGroups.value.length;

  if (groupCount === 0) {
    window.$message?.info('当前没有可重置的分组');
    return;
  }

  window.$dialog?.warning({
    title: '确认重置',
    content: `确定要重置所有导航分组的排序吗？此操作不可撤销！`,
    positiveText: '重置',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        // 显示加载状态
        window.$message?.loading('正在重置分组...', { duration: 0 });

        // 批量删除所有导航组
        await PublicApi.resetSort({
          tableName: 'navigation_group',
        });

        // 清除加载状态
        window.$message?.destroyAll();
        window.$message?.success('重置成功');

        // 刷新数据
        await getNavigationGroup();

        // 自动选择"全部"分组
        await selectDefaultAllGroup();
      } catch (error) {
        // 清除加载状态
        window.$message?.destroyAll();
        console.error('重置导航组失败:', error);
        window.$message?.error(`重置失败：${error}`);
      }
    },
  });
};

/**
 * 拖拽开始事件处理
 * @param evt 拖拽事件对象
 */
const onDragStart = (evt: any) => {
  // 添加拖拽开始时的视觉反馈
  const draggedElement = evt.item;
  if (draggedElement) {
    draggedElement.style.transition = 'none';
  }
};

/**
 * 拖拽结束事件处理
 * @param evt 拖拽事件对象
 */
const onDragEnd = (evt: any) => {
  // 恢复拖拽元素的过渡效果
  const draggedElement = evt.item;
  if (draggedElement) {
    draggedElement.style.transition = '';
  }

  // 获取位置信息
  const { oldIndex } = evt;
  const { newIndex } = evt;

  // 如果位置发生了变化
  if (oldIndex !== newIndex && currentNavigations.value && currentNavigations.value.length > 0) {
    const navigations = currentNavigations.value;

    // 获取被拖拽元素的信息
    const draggedItem = navigations[newIndex];
    const draggedItemId = draggedItem.id;

    // 获取新位置前后的元素ID
    const previousItemId = newIndex > 0 ? navigations[newIndex - 1].id : null;

    const data = {
      tableName: 'navigation',
      sourceId: draggedItemId,
      targetId: previousItemId,
      position: newIndex === 0 ? 'first' : 'after',
    };

    // 保存排序
    saveDragOrder(data);
  }
};

/**
 * 拖拽移动事件处理
 * @param evt 拖拽移动事件对象
 * @returns {boolean} 是否允许移动
 */
const onDragMove = () => {
  return true; // 允许移动
};

/**
 * 保存拖拽排序结果
 */
const saveDragOrder = async (data: Recordable) => {
  if (!currentNavigations.value || currentNavigations.value.length === 0) {
    console.warn('没有可保存的导航数据');
    return;
  }

  // 构建新的排序数据
  const sortedNavigations = currentNavigations.value.map((nav: any, index: number) => ({
    id: nav.id,
    sort_order: index + 1,
    name: nav.name,
  }));

  console.log('新的排序数据:', sortedNavigations);

  try {
    await PublicApi.sort(data);
    window.$message?.success('排序保存成功');
  } catch (error) {
    console.error('排序保存失败:', error);
    // 提示用户排序保存失败
    window.$message?.error('排序保存失败，请重试');
    // 重新加载
    currentNavigations.value = await getNavigationList(navigationGroup.value?.id);
  }
};

/**
 * 导航组拖拽开始事件处理
 * @param evt 拖拽事件对象
 */
const onGroupDragStart = (evt: any) => {
  // 添加拖拽开始时的视觉反馈
  const draggedElement = evt.item;
  if (draggedElement) {
    draggedElement.style.transition = 'none';
  }
};

/**
 * 导航组拖拽结束事件处理
 * @param evt 拖拽事件对象
 */
const onGroupDragEnd = (evt: any) => {
  // 恢复拖拽元素的过渡效果
  const draggedElement = evt.item;
  if (draggedElement) {
    draggedElement.style.transition = '';
  }

  // 获取位置信息
  const { oldIndex } = evt;
  const { newIndex } = evt;
  // 如果位置发生了变化且不是"全部"分组
  if (oldIndex !== newIndex && filteredGroups.value && filteredGroups.value.length > 0) {
    const groups = filteredGroups.value;
    // 获取被拖拽元素的信息（使用oldIndex获取原始被拖拽的元素）
    const draggedItem = groups[newIndex];
    // 如果拖拽的是"全部"分组，不允许移动
    if (draggedItem.id === 0) {
      // 恢复原始顺序
      getNavigationGroup();
      return;
    }

    const draggedItemId = draggedItem.id;

    // 获取新位置前一个元素的ID，跳过"全部"分组
    let targetItemId = null;
    for (let i = newIndex - 1; i >= 0; i--) {
      if (groups[i].id !== 0) {
        targetItemId = groups[i].id;
        break;
      }
    }

    const data = {
      tableName: 'navigation_group',
      sourceId: draggedItemId, // 被拖拽的元素ID
      targetId: targetItemId, // 目标位置前一个元素的ID
      position: targetItemId === null ? 'first' : 'after',
    };
    // 保存导航组排序
    saveGroupDragOrder(data);
  }
};

/**
 * 导航组拖拽移动事件处理
 * @param evt 拖拽移动事件对象
 * @returns {boolean} 是否允许移动
 */
const onGroupDragMove = (evt: any) => {
  // 不允许拖拽"全部"分组
  const draggedElement = evt.dragged;
  if (draggedElement && draggedElement.classList.contains('none_draggable')) {
    return false;
  }
  return true; // 允许移动
};

/**
 * 保存导航组拖拽排序结果
 */
const saveGroupDragOrder = async (data: Recordable) => {
  if (!filteredGroups.value || filteredGroups.value.length === 0) {
    console.warn('没有可保存的导航组数据');
    return;
  }

  try {
    await PublicApi.sort(data);
    window.$message?.success('导航组排序保存成功');

    // 重新获取导航组数据以同步最新排序
    // await getNavigationGroup();
  } catch (error) {
    console.error('导航组排序保存失败:', error);
    // 提示用户排序保存失败
    window.$message?.error('导航组排序保存失败，请重试');
    // 重新加载导航组数据
    await getNavigationGroup();
  }
};
</script>

<style scoped lang="scss">
.navigation-body {
  display: flex;
  flex: 1;
  height: 100%;
  background: #f8fafc;

  .sidebar {
    width: 280px;
    background: #ffffff;
    border-right: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;

    .search-container {
      padding: 16px 16px 20px;
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
          padding: 10px 36px 10px 36px;
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

      .group-filter-container {
        margin-top: 12px;

        .group-filter-button {
          width: 100%;
          height: 36px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.3s ease;

          .button-icon {
            font-size: 16px;
          }

          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
        /* 导航组拖拽相关样式 */
        :deep(.group-drag-ghost) {
          opacity: 0.4;
          background: #f1f5f9;
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          transform: rotate(1deg);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        :deep(.group-drag-chosen) {
          transform: scale(1.02);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border: 2px solid #667eea;
          z-index: 1000;
          transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        :deep(.group-drag-dragging) {
          opacity: 0.8;
          transform: rotate(2deg) scale(1.05);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
          z-index: 1001;
          cursor: grabbing !important;
        }

        /* 管理员用户的拖拽手势 */
        &.admin-draggable-groups {
          .tag-item {
            cursor: grab;

            &:active {
              cursor: grabbing;
            }

            &:not(.none_draggable):hover {
              cursor: grab;
            }
          }
        }

        /* 非管理员用户的普通手势 */
        &.non-admin-groups {
          .tag-item {
            cursor: pointer;

            &:hover {
              cursor: pointer;
            }

            &:active {
              cursor: pointer;
            }
          }
        }

        /* "全部"分组不可拖拽的样式 */
        .tag-item.none_draggable {
          cursor: pointer !important;

          &:hover {
            cursor: pointer !important;
          }

          &:active {
            cursor: pointer !important;
          }
        }

        .tag-item {
          display: flex;
          align-items: center;
          padding: 12px;
          margin: 0 12px 8px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;

          &:hover {
            background: #f8fafc;
            border-color: #e2e8f0;

            .tag-actions {
              .tag-action-btn {
                opacity: 1;
                transform: scale(1);
              }

              .tag-arrow {
                opacity: 1;
              }
            }
          }

          &.active {
            border-color: #667eea;
            box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
            background: #dbeafe;

            .tag-icon {
              background: rgba(255, 255, 255, 0.2) !important;
            }

            .tag-actions {
              .tag-action-btn {
                opacity: 1;
                transform: scale(1);
              }

              .tag-arrow {
                opacity: 1;
                transform: translateX(0);
                color: #667eea;
              }
            }
          }

          .tag-icon {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
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

          .tag-actions {
            display: flex;
            align-items: center;
            gap: 8px;

            .tag-action-btn {
              opacity: 0;
              transform: scale(0.8);
              transition: all 0.2s ease;

              .action-icon {
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
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
            .button-icon {
              font-size: 16px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
      }
    }
  }

  .sidebar-footer {
    padding: 16px;
    border-top: 1px solid #f1f5f9;
    background: #ffffff;

    .add-group-button {
      .button-icon {
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
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
      padding: 20px 32px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

      .header-main {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        flex: 1;

        .group-icon-large {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);

          .icon {
            font-size: 40px;
          }
        }

        .group-info {
          flex: 1;

          .breadcrumb {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 6px;
            font-size: 12px;

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
            font-size: 24px;
            font-weight: 700;
            color: #1e293b;
            margin: 0 0 6px 0;
            line-height: 1.2;
          }

          .group-description {
            font-size: 14px;
            color: #64748b;
            margin: 0 0 12px 0;
            line-height: 1.5;
          }

          .group-stats {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;

            .stat-item {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 12px;
              color: #64748b;
              font-weight: 500;

              .stat-icon {
                font-size: 14px;

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
          .button-icon {
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          &.guest-mode {
            position: relative;
            transition: all 0.3s ease;

            &:hover {
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            /* 游客模式激活状态的特殊样式 */
            &.n-button--warning-type {
              background: linear-gradient(135deg, #f59e0b, #d97706);
              border-color: #d97706;

              &:hover {
                background: linear-gradient(135deg, #d97706, #b45309);
                border-color: #b45309;
              }
            }
          }

          &.refresh {
            transition: all 0.3s ease;

            &:hover {
              .button-icon {
                transform: rotate(180deg);
              }
            }

            &:active {
              .button-icon {
                transform: rotate(360deg);
              }
            }
          }
        }
      }
    }

    .navigations-container {
      flex: 1;
      padding: 20px 32px;
      overflow-y: auto;

      .navigations-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 20px;
        position: relative;

        /* 拖拽相关样式 */
        :deep(.drag-ghost) {
          opacity: 0.4;
          background: #f1f5f9;
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          transform: rotate(2deg);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        :deep(.drag-chosen) {
          transform: scale(1.02);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
          border: 2px solid #3b82f6;
          z-index: 1000;
          transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        :deep(.drag-dragging) {
          opacity: 0.8;
          transform: rotate(3deg) scale(1.05);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
          z-index: 1001;
          cursor: grabbing !important;
        }

        /* 拖拽时的网格项动画 */
        :deep(.navigation-card) {
          transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
          }
        }

        /* 管理员用户的拖拽手势 */
        &.admin-draggable {
          :deep(.navigation-card) {
            cursor: grab;

            &:active {
              cursor: grabbing;
            }
          }
        }

        /* 非管理员用户的普通手势 */
        &.non-admin {
          :deep(.navigation-card) {
            cursor: default;

            &:hover {
              cursor: default;
            }

            &:active {
              cursor: default;
            }
          }
        }

        /* 拖拽区域指示器 */
        &::before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border: 2px dashed transparent;
          border-radius: 16px;
          pointer-events: none;
          transition: all 0.3s ease;
        }

        &.drag-over::before {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
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
          .button-icon {
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
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
          margin-bottom: 40px;

          .welcome-icon {
            font-size: 96px;
            color: #cbd5e1;
            opacity: 0.9;
          }
        }

        .welcome-title {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 20px 0;
        }

        .welcome-description {
          font-size: 18px;
          color: #64748b;
          margin: 0 0 40px 0;
          line-height: 1.6;
        }

        .welcome-features {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;

          .feature-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            padding: 20px;
            background: #f8fafc;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;

            &:hover {
              background: #f1f5f9;
              border-color: #cbd5e1;
              transform: translateY(-2px);
            }

            .feature-icon {
              font-size: 28px;
              color: #3b82f6;
            }

            span {
              font-size: 15px;
              font-weight: 600;
              color: #475569;
            }
          }
        }
      }
    }
  }
}
</style>
