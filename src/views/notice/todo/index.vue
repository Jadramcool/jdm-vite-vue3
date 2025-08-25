<template>
  <div class="h-full overflow-x-auto">
    <!-- <n-skeleton v-if="loading" height="70px" width="320px" />
    <n-card v-else class="mb-10px" hoverable>
      <n-steps>
        <n-step v-for="todos in todoList" :key="todos.id" :title="todos.title" status="finish" />
      </n-steps>
    </n-card> -->
    <VueDraggable
      v-model="todoList"
      :animation="150"
      filter=".none_draggable"
      @update="handleUpdateSortParent"
      class="inline-flex flex-nowrap gap-x-8px gap-y-12px h-90%"
    >
      <n-skeleton v-if="loading" height="100%" width="320px" />
      <n-card
        v-else
        class="w-360px"
        style="color: #eeeeee"
        v-for="todos in todoList"
        :key="todos.id"
        size="small"
        hoverable
      >
        <template #header>
          <!-- 父级标题编辑 -->
          <n-input
            v-if="editParentFlagMap[todos.id]"
            v-model:value="inputParentValue[todos.id]"
            placeholder="请输入标题"
          />
          <n-text v-else>{{ todos.title }}</n-text>
        </template>

        <template #header-extra>
          <!-- 父级操作按钮 -->
          <template v-if="editParentFlagMap[todos.id]">
            <CommonWrapper @click="handleEdit(todos, false, true)" title="取消">
              <JayIcon icon="material-symbols:check-indeterminate-small" type="warning" />
            </CommonWrapper>
            <CommonWrapper @click="handleSubmit(todos, true)" title="保存">
              <JayIcon icon="material-symbols:check-rounded" type="success" />
            </CommonWrapper>
          </template>
          <template v-else>
            <CommonWrapper @click="handleDelete(todos, todos)" title="删除">
              <JayIcon icon="material-symbols:delete-forever-outline" type="error" />
            </CommonWrapper>
            <CommonWrapper @click="handleEdit(todos, true, true)" title="编辑">
              <JayIcon icon="material-symbols:ink-pen-outline-rounded" />
            </CommonWrapper>
          </template>
        </template>

        <div class="max-h-500px cus-scroll">
          <!-- 进度条 -->
          <n-progress
            class="mb-20px"
            type="line"
            :color="{ stops: ['#E3F2FD', '#2080f0'] }"
            :percentage="calcPercent(todos)"
            :show-indicator="false"
            :processing="!todos.isDone"
          />

          <!-- 列表 -->
          <VueDraggable
            v-model="todos.children"
            group="todo"
            :animation="150"
            filter=".none_draggable"
            :id="todos.id"
            @update="handleUpdateSort"
            @add="handleAdd"
          >
            <n-spin :show="submitLoading[todos.id]">
              <n-flex
                :wrap="false"
                justify="start"
                v-for="todo in todos.children"
                :key="todo.id"
                class="flex-x-center mb-10px"
                size="small"
              >
                <n-checkbox
                  :checked="todo.isDone"
                  :on-update:checked="(checked: boolean) => handleChecked(checked, todo)"
                >
                </n-checkbox>
                <div class="input-form flex-1">
                  <!-- 子项目编辑状态 -->
                  <n-flex
                    v-if="editFlagMap[todo.id]"
                    justify="space-between"
                    align="center"
                    :wrap="false"
                  >
                    <n-input v-model:value="inputValue[todo.id]" placeholder="请输入待办事项" />
                    <n-button-group size="small">
                      <n-button round @click="handleEdit(todo, false)" title="取消">
                        <JayIcon icon="material-symbols:check-indeterminate-small" type="warning" />
                      </n-button>
                      <n-button round @click="handleSubmit(todo)" title="保存">
                        <JayIcon icon="material-symbols:check-rounded" type="success" />
                      </n-button>
                    </n-button-group>
                  </n-flex>

                  <!-- 子项目显示状态 -->
                  <n-flex v-else justify="space-between" align="center" :wrap="false">
                    <n-text :class="{ 'line-through opacity-60': todo.isDone }">
                      {{ todo.title }}
                    </n-text>
                    <n-button-group size="small" v-if="!todo.isDone">
                      <n-button round @click="handleDelete(todo, todos)" title="删除">
                        <JayIcon icon="material-symbols:delete-forever-outline" type="error" />
                      </n-button>
                      <n-button round @click="handleEdit(todo, true)" title="编辑">
                        <JayIcon icon="material-symbols:ink-pen-outline-rounded" />
                      </n-button>
                    </n-button-group>
                  </n-flex>
                </div>
              </n-flex>
            </n-spin>
          </VueDraggable>
        </div>
        <template #footer>
          <!-- 添加子项目按钮 -->
          <div class="flex justify-center mt-4">
            <CommonWrapper @click="handleAddTodo(todos)" title="添加待办事项">
              <JayIcon icon="material-symbols:add-2" hover type="primary" />
            </CommonWrapper>
          </div>
        </template>
      </n-card>

      <!-- 添加新列表按钮 -->
      <div class="w-200px flex items-center justify-center">
        <CommonWrapper @click="handleAddTodoList()" title="添加新列表">
          <JayIcon icon="material-symbols:add-2" :size="50" hover type="primary" />
        </CommonWrapper>
      </div>
    </VueDraggable>
  </div>
</template>

<script lang="ts" setup>
import { TodoApi } from '@/api';
import { $t } from '@/locales';
import { VueDraggable } from 'vue-draggable-plus';

// ==================== 响应式数据 ====================
const todoList = ref<Notice.Todo[]>([]);
const loading = ref<boolean>(false);

// 加载状态管理
const submitLoading = ref<Record<string | number, boolean>>({});

// 编辑状态管理
const editFlagMap = ref<Record<string | number, boolean>>({});
const editParentFlagMap = ref<Record<string | number, boolean>>({});

// 输入值管理
const inputValue = ref<Record<string | number, string>>({});
const inputParentValue = ref<Record<string | number, string>>({});

// ==================== 数据初始化 ====================
/**
 * 获取待办事项列表
 */
const getTodoList = async (): Promise<void> => {
  try {
    const res: Notice.Todo[] = await TodoApi.todoList();
    todoList.value = res;
    nextTick(() => {
      initializeEditStates(todoList.value);
    });
  } catch (error: any) {
    handleError(error, '获取待办事项失败');
  }
};

/**
 * 初始化编辑状态和输入值
 */
const initializeEditStates = (data: Notice.Todo[]): void => {
  data.forEach((todos) => {
    // 初始化子项目的输入值和编辑状态
    if (todos.children) {
      todos.children.forEach((child: any) => {
        inputValue.value[child.id] = child.title;
        editFlagMap.value[child.id] = false;
      });
    }

    // 初始化父项目状态
    inputParentValue.value[todos.id] = todos.title;
    editParentFlagMap.value[todos.id] = false;
    submitLoading.value[todos.id] = false;
  });
};

// ==================== 工具函数 ====================
/**
 * 计算完成百分比
 */
const calcPercent = (todos: Notice.Todo): number => {
  const { children } = todos;
  if (!children || children.length === 0) return 0;

  const doneCount = children.filter((item: Notice.Todo) => item.isDone).length;
  return Math.round((doneCount / children.length) * 100);
};

/**
 * 统一错误处理
 */
const handleError = (error: any, defaultMessage: string): void => {
  const message = error?.message || error?.errMsg || error || defaultMessage;
  window.$message?.error(message);
};

/**
 * 生成唯一ID
 */
const generateId = (): number => Date.now();

// ==================== 生命周期 ====================
onMounted(async () => {
  loading.value = true;
  await getTodoList();
  loading.value = false;
});

// ==================== 编辑操作 ====================
/**
 * 切换编辑状态
 * @param todo 待办事项对象
 * @param flag 编辑状态标志
 * @param isParent 是否为父级项目
 */
const handleEdit = (todo: Notice.Todo, flag: boolean, isParent: boolean = false): void => {
  // 如果是取消编辑且是新创建的项目，则删除
  if (!flag && todo.tag === 'create') {
    handleCancelCreate(todo, isParent);
    return;
  }

  if (isParent) {
    // 恢复原始数据
    if (flag) {
      inputParentValue.value[todo.id] = todo.title || '';
    }
    editParentFlagMap.value[todo.id] = flag;
  } else {
    // 恢复原始数据
    if (flag) {
      inputValue.value[todo.id] = todo.title || '';
    }
    editFlagMap.value[todo.id] = flag;
  }
};

// ==================== 新增操作 ====================
/**
 * 新增子待办事项
 * @param parentTodo 父级待办事项
 */
const handleAddTodo = (parentTodo: Notice.Todo): void => {
  const id = generateId();
  const children = parentTodo.children || [];
  const lastItem = children[children.length - 1];
  const sortOrder = (lastItem?.sortOrder ?? children.length) + 1;

  const newTodo: Notice.Todo = {
    id,
    title: '',
    isDone: false,
    tag: 'create',
    pid: parentTodo.id,
    sortOrder,
  };

  if (!parentTodo.children) {
    parentTodo.children = [];
  }
  parentTodo.children.push(newTodo);

  nextTick(() => {
    initializeEditStates(todoList.value);
    editFlagMap.value[id] = true;
  });
};

/**
 * 新增父级待办事项列表
 */
const handleAddTodoList = (): void => {
  const id = generateId();
  const lastItem = todoList.value[todoList.value.length - 1];
  const sortOrder = (lastItem?.sortOrder ?? todoList.value.length) + 1;

  const newTodoList: Notice.Todo = {
    id,
    title: '',
    isDone: false,
    tag: 'create',
    sortOrder,
    children: [],
  };

  todoList.value.push(newTodoList);

  nextTick(() => {
    initializeEditStates(todoList.value);
    editParentFlagMap.value[id] = true;
  });
};

// ==================== 提交操作 ====================
/**
 * 提交待办事项（创建或更新）
 * @param todo 待办事项对象
 * @param isParent 是否为父级项目
 */
const handleSubmit = async (todo: Notice.Todo, isParent: boolean = false): Promise<void> => {
  const title = isParent ? inputParentValue.value[todo.id] : inputValue.value[todo.id];
  const loadingKey = isParent ? todo.id : todo.pid!;

  // 验证标题不能为空
  if (!title || title.trim() === '') {
    window.$message?.warning('标题不能为空');
    return;
  }

  try {
    submitLoading.value[loadingKey] = true;

    if (todo.tag === 'create') {
      // 创建新待办事项
      await TodoApi.createTodo({
        title: title.trim(),
        sortOrder: todo.sortOrder || 0,
        ...(isParent ? {} : { pid: todo.pid }),
      });

      todo.title = title.trim();
      delete todo.tag; // 移除创建标记
      window.$message?.success($t('common.createSuccess'));
    } else {
      // 更新现有待办事项
      await TodoApi.updateTodo({
        id: todo.id,
        title: title.trim(),
      });

      todo.title = title.trim();
      window.$message?.success($t('common.updateSuccess'));
    }

    // 退出编辑状态
    if (isParent) {
      editParentFlagMap.value[todo.id] = false;
    } else {
      editFlagMap.value[todo.id] = false;
    }

    // 刷新数据
    await getTodoList();
  } catch (error: any) {
    handleError(error, '操作失败');
  } finally {
    submitLoading.value[loadingKey] = false;
  }
};

// ==================== 删除操作 ====================
/**
 * 删除待办事项
 * @param todo 要删除的待办事项
 * @param parentTodo 父级待办事项
 */
const handleDelete = async (todo: Notice.Todo, parentTodo: Notice.Todo): Promise<void> => {
  try {
    submitLoading.value[parentTodo.id] = true;

    if (todo.tag === 'create') {
      // 删除未保存的新建项目
      if (parentTodo.children) {
        parentTodo.children = parentTodo.children.filter(
          (item: { id: number }) => item.id !== todo.id,
        );
      }
    } else {
      // 删除已保存的项目
      await TodoApi.deleteTodo(todo.id);

      // 本地同步删除
      if (parentTodo.children) {
        parentTodo.children = parentTodo.children.filter(
          (item: { id: number }) => item.id !== todo.id,
        );
      }

      window.$message?.success($t('common.deleteSuccess'));
      await getTodoList();
    }
  } catch (error: any) {
    handleError(error, '删除失败');
  } finally {
    submitLoading.value[parentTodo.id] = false;
  }
};

// ==================== 状态切换 ====================
/**
 * 切换待办事项完成状态
 * @param checked 是否完成
 * @param todo 待办事项对象
 */
const handleChecked = async (checked: boolean, todo: Notice.Todo): Promise<void> => {
  try {
    todo.isDone = checked;
    await TodoApi.doneTodo(todo.id, checked ? 1 : 0);
    await getTodoList();
  } catch (error: any) {
    // 回滚状态
    todo.isDone = !checked;
    handleError(error, '状态更新失败');
  }
};

// ==================== 排序操作 ====================
/**
 * 更新子项目排序
 * @param event 拖拽事件对象
 */
const handleUpdateSort = async (event: any): Promise<void> => {
  try {
    const { pid } = event.data;
    const parentTodo = todoList.value.find((item) => item.id === pid);

    if (!parentTodo?.children) {
      return;
    }

    const sortTodos = parentTodo.children.map((todo: Notice.Todo, index: number) => ({
      id: todo.id,
      sortOrder: index,
    }));

    await TodoApi.updateTodoOrder({ sort: sortTodos, pid });
  } catch (error: any) {
    handleError(error, '排序更新失败');
  }
};

/**
 * 更新父级项目排序
 */
const handleUpdateSortParent = async (): Promise<void> => {
  try {
    const sortTodoList = todoList.value.map((todo: Notice.Todo, index: number) => ({
      id: todo.id,
      sortOrder: index,
    }));

    await TodoApi.updateTodoOrder({ sort: sortTodoList });
  } catch (error: any) {
    handleError(error, '排序更新失败');
  }
};
// ==================== 辅助操作 ====================
/**
 * 取消创建新项目（删除未保存的项目）
 * @param todo 待办事项对象
 * @param isParent 是否为父级项目
 */
const handleCancelCreate = (todo: Notice.Todo, isParent: boolean = false): void => {
  if (isParent) {
    // 删除父级项目
    const index = todoList.value.findIndex((item) => item.id === todo.id);
    if (index > -1) {
      todoList.value.splice(index, 1);
    }

    // 清理相关状态
    delete editParentFlagMap.value[todo.id];
    delete inputParentValue.value[todo.id];
    delete submitLoading.value[todo.id];
  } else {
    // 删除子项目
    const parent = todoList.value.find((item) => item.id === todo.pid);
    if (parent?.children) {
      const index = parent.children.findIndex((item: any) => item.id === todo.id);
      if (index > -1) {
        parent.children.splice(index, 1);
      }
    }

    // 清理相关状态
    delete editFlagMap.value[todo.id];
    delete inputValue.value[todo.id];
  }
};

/**
 * 处理跨列表拖拽
 * @param event 拖拽事件对象
 */
const handleAdd = async (event: any): Promise<void> => {
  try {
    const pid = Number(event.to.id);
    const parentTodo = todoList.value.find((item) => item.id === pid);

    if (!parentTodo?.children) {
      return;
    }

    const sortTodos = parentTodo.children.map((todo: Notice.Todo, index: number) => ({
      id: todo.id,
      sortOrder: index,
    }));

    await TodoApi.updateTodoOrder({ sort: sortTodos, pid });
  } catch (error: any) {
    handleError(error, '跨列表拖拽失败');
  }
};
</script>
