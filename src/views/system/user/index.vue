<!--
 * @Author: Jay
 * @Date: 2024-05-30 10:29:46
 * @LastEditors: jdm 1051780106@qq.com
 * @LastEditTime: 2025-06-30 14:33:02
 * @FilePath: \vite-vue3-jdm\src\views\system\user\index.vue
 * @Description: 
 * 
-->
<template>
  <div class="page page-user">
    <!-- 左侧部门树区域 -->
    <div class="department-panel" :class="{ collapsed: departmentCollapsed }">
      <div class="department-header">
        <div class="department-title" v-show="!departmentCollapsed">
          <n-icon class="department-icon" size="18">
            <i class="i-carbon:tree-view" />
          </n-icon>
          <span>组织架构</span>
        </div>
        <n-button
          class="collapse-btn"
          quaternary
          circle
          size="small"
          @click="toggleDepartmentPanel"
        >
          <n-icon size="16">
            <i :class="departmentCollapsed ? 'i-carbon:chevron-right' : 'i-carbon:chevron-left'" />
          </n-icon>
        </n-button>
      </div>

      <div class="department-content" v-show="!departmentCollapsed">
        <!-- 部门搜索框 -->
        <div class="department-search">
          <n-input
            v-model:value="departmentSearchValue"
            placeholder="搜索部门"
            clearable
            size="small"
          >
            <template #prefix>
              <n-icon size="14">
                <i class="i-carbon:search" />
              </n-icon>
            </template>
          </n-input>
        </div>

        <n-scrollbar class="department-tree-scroll">
          <div v-if="departmentTreeLoading" class="department-loading">
            <n-spin size="medium">
              <template #description>
                <span class="loading-text">加载组织架构中...</span>
              </template>
            </n-spin>
          </div>
          <n-tree
            v-else
            label-field="name"
            key-field="id"
            block-line
            show-line
            :indent="16"
            :data="filteredDepartmentTree"
            :default-expanded-keys="defaultExpandedKeys"
            :node-props="nodeProps"
            :pattern="departmentSearchValue"
            :selected-keys="selectedDepartmentKeys"
            class="department-tree"
          />
        </n-scrollbar>
      </div>
    </div>

    <n-divider style="height: 100%" dashed vertical />

    <!-- 右侧用户管理区域 -->
    <div class="user-panel">
      <!-- 搜索表单区域 -->
      <div class="search-section">
        <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" ref="formRef" />
      </div>

      <n-divider dashed />

      <!-- 用户表格区域 -->
      <div class="table-section">
        <BasicTable
          ref="tableRef"
          :title="$t('modules.system.user.table.title')"
          :columns="columns"
          :filters="queryParams"
          :request="loadUserList"
          :rowKey="(row: NaiveUI.RowData) => row.id"
          :pagination="{ pageSize: 10 }"
          :showAddBtn="true"
          :showBatchDeleteBtn="true"
          :checked-row-keys="checkedRows"
          :scroll-x="1500"
          @update:checked-row-keys="handleCheck"
          @add="handleAdd"
          @batchDelete="handleBatchDelete"
        />
      </div>
    </div>

    <!-- 用户抽屉组件 -->
    <UserDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>

<script lang="tsx" setup>
import { DepartmentApi, UserManagerApi } from '@/api/system';
import { BasicForm, BasicTable, useDrawer, useForm } from '@/components';
import { $t } from '@/locales/i18n';
import { UserDrawer } from './components';
import { useUserSchema } from './schema';

defineOptions({ name: 'UserManager' });

// 表格/表单配置  采用computed（适配i18n）
const tableRef = ref<any>(null);
const formRef = ref<any>(null);

const checkedRows = ref<Array<number | string>>([]);
const departmentTree = ref<any>([]);

// 请求参数
const queryParams = ref<Query.GetParams>({});

// 部门面板折叠状态
const departmentCollapsed = ref(false);

// 部门搜索
const departmentSearchValue = ref('');
const defaultExpandedKeys = ref<Array<string | number>>([]);
const selectedDepartmentId = ref<string | number | null>(null);

// 部门树加载状态
const departmentTreeLoading = ref(false);

// 部门树选中的keys
const selectedDepartmentKeys = computed(() => {
  return selectedDepartmentId.value ? [selectedDepartmentId.value] : [];
});

onMounted(() => {
  loadDepartmentTree();
});

// 表格/表单方法
const schemaMethods = {
  handleEdit(record: NaiveUI.RowData) {
    openDrawer({
      record,
      isUpdate: true,
    });
  },
  handleDelete(record: NaiveUI.RowData) {
    UserManagerApi.deleteUser(record.id).then(() => {
      tableRef.value.reload();
    });
  },
  handleEnable(record: NaiveUI.RowData) {
    UserManagerApi.enableUser(record.id, record.status === 0 ? 1 : 0).then(() => {
      tableRef.value.reload();
    });
  },
};

const handleAdd = () => {
  openDrawer({
    isUpdate: false,
  });
};

// 表格/表单配置  采用computed（适配i18n）
const { columns, formSchemas } = useUserSchema(schemaMethods);

const [register, { getFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  schemas: formSchemas,
  submitOnReset: true,
  tableRef,
});

const [registerDrawer, { openDrawer }] = useDrawer();

// 表格数据请求
const loadUserList = async (data: Query.GetParams) => {
  data.filters = { ...(data.filters || {}), ...getFieldsValue() };
  return UserManagerApi.userList(data);
};

/**
 * 重置表单处理函数
 * 响应BasicForm组件的reset事件，执行自定义重置逻辑
 * @param values 重置后的表单值
 */
const handleReset = () => {
  // 清空部门选择（会自动同步到tree的选中状态）
  selectedDepartmentId.value = null;
  // 清空查询参数
  queryParams.value = {};
};

/**
 * 加载部门树数据
 */
const loadDepartmentTree = async () => {
  try {
    departmentTreeLoading.value = true;
    const res = await DepartmentApi.getDepartmentTree();
    departmentTree.value = res;
    // 默认展开所有节点
    defaultExpandedKeys.value = getAllNodeKeys(res);
  } catch (error) {
    console.error('加载部门树失败:', error);
  } finally {
    departmentTreeLoading.value = false;
  }
};

/**
 * 获取所有节点的key，用于默认展开
 * @param nodes 节点数组
 */
const getAllNodeKeys = (nodes: any[]): Array<string | number> => {
  const keys: Array<string | number> = [];
  const traverse = (nodeList: any[]) => {
    nodeList.forEach((node) => {
      keys.push(node.id);
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    });
  };
  traverse(nodes);
  return keys;
};

/**
 * 过滤部门树数据（支持搜索）
 */
const filteredDepartmentTree = computed(() => {
  if (!departmentSearchValue.value) {
    return departmentTree.value;
  }

  const filterNodes = (nodes: any[]): any[] => {
    return nodes
      .filter((node) => {
        const matchesSearch = node.name
          .toLowerCase()
          .includes(departmentSearchValue.value.toLowerCase());
        const hasMatchingChildren = node.children && filterNodes(node.children).length > 0;

        if (matchesSearch || hasMatchingChildren) {
          return {
            ...node,
            children: node.children ? filterNodes(node.children) : [],
          };
        }
        return false;
      })
      .map((node) => ({
        ...node,
        children: node.children ? filterNodes(node.children) : [],
      }));
  };

  return filterNodes(departmentTree.value);
});

// 表单提交
const handleSubmit = (data: any) => {
  console.log(getFieldsValue());
  data && tableRef.value.reload();
};

// 新增/编辑成功回调
const handleSuccess = () => {
  tableRef.value.reload();
};

// 批量删除
const handleBatchDelete = () => {
  if (!checkedRows.value.length) {
    window.$message.error($t('message.pleaseSelectDeleteUser'));
    return;
  }
  UserManagerApi.batchDeleteUser(checkedRows.value).then(() => {
    checkedRows.value = [];
    tableRef.value.reload();
  });
};

/**
 * 处理表格行选择变化
 * @param keys 选中的行键数组
 */
const handleCheck = (keys: Array<string | number>) => {
  checkedRows.value = keys;
};

/**
 * 部门树节点属性配置
 * @param info 节点信息
 */
const nodeProps = ({ option }: { option: any }) => {
  return {
    class: selectedDepartmentId.value === option.id ? 'selected-node' : '',
    onClick() {
      // 点击部门节点时的处理逻辑
      const isCurrentlySelected = selectedDepartmentId.value === option.id;

      if (isCurrentlySelected) {
        // 如果当前节点已选中，则取消选择
        selectedDepartmentId.value = null;
      } else {
        // 选择新的部门节点
        selectedDepartmentId.value = option.id;
      }

      // 更新查询参数并重新加载用户列表
      if (selectedDepartmentId.value) {
        queryParams.value.filters = {
          ...queryParams.value.filters,
          departmentId: selectedDepartmentId.value,
        };
      } else {
        // 取消选择时，移除部门筛选条件
        const restFilters = queryParams.value.filters || {};
        delete restFilters.departmentId;
        queryParams.value.filters = restFilters;
      }

      tableRef.value?.reload();
    },
  };
};

/**
 * 切换部门面板折叠状态
 */
const toggleDepartmentPanel = () => {
  departmentCollapsed.value = !departmentCollapsed.value;
};
</script>

<style lang="scss" scoped>
/**
 * 用户管理页面布局样式
 * 采用左右分栏布局，左侧为部门树，右侧为用户管理区域
 */
.page-user {
  display: flex;
  height: 100%;

  // 左侧部门面板
  .department-panel {
    width: 280px;
    min-width: 280px;
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    overflow: hidden;

    &.collapsed {
      width: 48px;
      min-width: 48px;
    }

    .department-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      flex-shrink: 0;

      .department-title {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        gap: 8px;
        font-weight: 600;
        font-size: 14px;
        min-width: 0;
        flex: 1;
        white-space: nowrap;
        overflow: hidden;

        .department-icon {
          flex-shrink: 0;
        }

        span {
          flex-shrink: 1;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .collapse-btn {
        flex-shrink: 0;
        transition: all 0.2s ease;
        background-color: rgba($color: #333, $alpha: 0.1);
      }
    }

    .department-content {
      flex: 1;
      min-height: 0;
      padding: 12px;
      display: flex;
      flex-direction: column;

      .department-search {
        flex-shrink: 0;
        margin-bottom: 12px;
      }

      .department-tree-scroll {
        flex: 1;
        min-height: 0;
        overflow: hidden;

        .department-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 200px;
          flex-direction: column;
          gap: 12px;

          .loading-text {
            font-size: 12px;
            color: var(--n-text-color-2);
          }
        }

        .department-tree {
          :deep(.n-tree-node) {
            border-radius: 4px;
            transition: all 0.2s ease;

            .n-tree-node-content {
              padding: 6px 8px;
              min-height: 28px;

              .n-tree-node-content__text {
                font-size: 12px;
                line-height: 1.4;
              }
            }
          }
        }
      }
    }
  }

  // 右侧用户面板
  .user-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;

    .table-section {
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>
