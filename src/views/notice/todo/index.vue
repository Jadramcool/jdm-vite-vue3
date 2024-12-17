<template>
  <div class="h-full overflow-x-auto">
    <!-- <n-skeleton v-if="loading" height="70px" width="320px" />
    <n-card v-else class="mb-10px" hoverable>
      <n-steps>
        <n-step v-for="todos in todoList" :key="todos.id" :title="todos.title" status="finish" />
      </n-steps>
    </n-card> -->
    <!-- 生成模拟数据 -->
    <n-button v-if="false" @click="handleAddMock">模拟数据</n-button>
    <VueDraggable
      v-model="todoList"
      :animation="150"
      filter=".none_draggable"
      @update="handleUpdateSortParent"
      class="inline-flex flex-nowrap gap-x-8px gap-y-12px h-80%"
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
          <div v-if="editParentFlagMap[todos.id]">
            <n-input v-model:value="inputParentValue[todos.id]"></n-input>
          </div>
          <div v-if="!editParentFlagMap[todos.id]">
            <n-text>{{ todos.title }}</n-text>
          </div>
        </template>
        <template #header-extra>
          <template v-if="editParentFlagMap[todos.id]">
            <CommonWrapper @click="handleEdit(todos, false, true)">
              <JayIcon :icon="'material-symbols:check-indeterminate-small'" :type="'warning'" />
            </CommonWrapper>
            <CommonWrapper @click="handleSubmit(todos, true)">
              <JayIcon :icon="'material-symbols:check-rounded'" :type="'success'" />
            </CommonWrapper>
          </template>
          <template v-if="!editParentFlagMap[todos.id]">
            <CommonWrapper @click="handleDelete(todos, todos)">
              <JayIcon :icon="'material-symbols:delete-forever-outline'" :type="'error'" />
            </CommonWrapper>
            <CommonWrapper @click="handleEdit(todos, true, true)">
              <JayIcon :icon="'material-symbols:ink-pen-outline-rounded'" />
            </CommonWrapper>
          </template>
        </template>

        <div class="max-h-400px cus-scroll">
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
                  :on-update:checked="(checked) => handleChecked(checked, todo)"
                >
                </n-checkbox>
                <div class="input-form flex-1">
                  <div v-if="editFlagMap[todo.id]">
                    <n-flex justify="space-between" align="center" :wrap="false">
                      <n-input v-model:value="inputValue[todo.id]"></n-input>
                      <n-button-group size="small">
                        <n-button round @click="handleEdit(todo, false)">
                          <JayIcon
                            :icon="'material-symbols:check-indeterminate-small'"
                            :type="'warning'"
                          />
                        </n-button>
                        <n-button round @click="handleSubmit(todo)">
                          <JayIcon :icon="'material-symbols:check-rounded'" :type="'success'" />
                        </n-button>
                      </n-button-group>
                    </n-flex>
                  </div>
                  <div v-if="!editFlagMap[todo.id]">
                    <n-flex justify="space-between" align="center" :wrap="false">
                      <n-text>{{ todo.title }}</n-text>
                      <n-button-group size="small" v-if="!todo.isDone">
                        <n-button round @click="handleDelete(todo, todos)">
                          <JayIcon
                            :icon="'material-symbols:delete-forever-outline'"
                            :type="'error'"
                          />
                        </n-button>
                        <n-button round @click="handleEdit(todo, true)">
                          <JayIcon :icon="'material-symbols:ink-pen-outline-rounded'" />
                        </n-button>
                      </n-button-group>
                    </n-flex>
                  </div>
                </div>
              </n-flex>
            </n-spin>
          </VueDraggable>
        </div>
        <template #footer>
          <div class="flex justify-center mt-4">
            <CommonWrapper @click="handleAddTodo(todos)">
              <JayIcon :icon="'material-symbols:add-2'" hover :type="'primary'" />
            </CommonWrapper>
          </div>
        </template>
      </n-card>

      <CommonWrapper class="w-200px" @click="handleAddTodoList()">
        <JayIcon :icon="'material-symbols:add-2'" :size="50" hover :type="'primary'" />
      </CommonWrapper>
    </VueDraggable>
  </div>
</template>

<script lang="ts" setup>
import { TodoApi } from '@/api';
import { $t } from '@/locales';
import { adminTodo, doctorTodo, patientTodo } from '@/mockData/todo';
import { VueDraggable } from 'vue-draggable-plus';
// import JayIcon from '@/components/common/JayIcon.vue';

const todoList = ref<Notice.Todo[]>([]);

const loading = ref<boolean>(false);
const submitLoading = ref<Record<string | number, boolean>>({});

const editFlagMap = ref<Record<string | number, boolean>>({});
const editParentFlagMap = ref<Record<string | number, boolean>>({});

const inputValue = ref<any>({});
const inputParentValue = ref<any>({});

const getTodoList = async () => {
  const res: Notice.Todo[] = await TodoApi.todoList();
  todoList.value = res.map((item: Notice.Todo) => item);
  nextTick(() => {
    generateTemp(todoList.value);
  });
};

onMounted(async () => {
  loading.value = true;
  await getTodoList();
  loading.value = false;
});

const generateTemp = (data: Notice.Todo[]) => {
  data.forEach((todos) => {
    inputValue.value[todos.id] = todos.children?.reduce((acc: any, cur: Notice.Todo) => {
      acc[cur.id] = cur.title;
      return acc;
    }, {});
    editFlagMap.value[todos.id] = todos.children?.reduce((acc: any, cur: Notice.Todo) => {
      acc[cur.id] = false;
      return acc;
    }, {});
    inputParentValue.value[todos.id] = todos.title;
    editParentFlagMap.value[todos.id] = false;
    submitLoading.value[todos.id] = false;
  });
};

const calcPercent = (todos: any) => {
  const { children } = todos;
  const doneCount = children?.filter((item: Notice.Todo) => item.isDone).length;
  const totalLength = children?.length || 0;
  return totalLength > 0 ? parseFloat((doneCount / totalLength).toFixed(2)) * 100 : 0;
};

// 切换编辑状态
const handleEdit = (todo: any, flag: boolean, isParent: boolean = false) => {
  if (isParent) {
    // 恢复原始数据
    if (flag) {
      inputParentValue.value[todo.id] = todo.title;
    }
    editParentFlagMap.value[todo.id] = flag;
  } else {
    // 恢复原始数据
    if (flag) {
      inputValue.value[todo.id] = todo.title;
    }
    editFlagMap.value[todo.id] = flag;
  }
};

// 新增待办事项
const handleAddTodo = async (todos: Notice.Todo) => {
  // id为时间戳
  const id = Date.now();
  const lastItem = todos.children[todos.children.length - 1];
  const sortOrder = (lastItem?.sortOrder ?? todos.children.length) + 1;
  todos?.children.push({
    id,
    title: '',
    isDone: false,
    tag: 'create',
    pid: todos.id,
    sortOrder,
  });
  nextTick(() => {
    generateTemp(todoList.value);
    editFlagMap.value[id] = true;
  });
};

// 新增待办事项-父级
const handleAddTodoList = async () => {
  const id = Date.now();
  const lastItem = todoList.value[todoList.value.length - 1];
  const sortOrder = (lastItem?.sortOrder ?? todoList.value.length) + 1;
  todoList.value.push({
    id,
    title: '',
    isDone: false,
    tag: 'create',
    sortOrder,
  });
  nextTick(() => {
    generateTemp(todoList.value);
    editParentFlagMap.value[id] = true;
  });
};

// 更新待办事项
const handleSubmit = async (todo: any, isParent: boolean = false) => {
  try {
    submitLoading.value[isParent ? todo.id : todo.pid] = true;
    if (todo.tag && todo.tag === 'create') {
      await TodoApi.createTodo({
        title: isParent ? inputParentValue.value[todo.id] : inputValue.value[todo.id],
        sortOrder: todo.sortOrder || 0,
        ...(isParent ? {} : { pid: todo.pid }),
      });
      editFlagMap.value[todo.id] = false;
      todo.title = inputValue.value[todo.id];
      window.$message?.success($t('common.createSuccess'));
    } else {
      await TodoApi.updateTodo({
        id: todo.id,
        title: isParent ? inputParentValue.value[todo.id] : inputValue.value[todo.id],
      });
      isParent ? (editParentFlagMap.value[todo.id] = false) : (editFlagMap.value[todo.id] = false);
      // 将本地todo同步
      todo.title = isParent ? inputParentValue.value[todo.id] : inputValue.value[todo.id];
      window.$message?.success($t('common.updateSuccess'));
    }

    getTodoList();
  } catch (e: any) {
    window.$message?.error(e.message || e);
  } finally {
    submitLoading.value[isParent ? todo.id : todo.pid] = false;
  }
};

// 删除待办事项
const handleDelete = async (todo: Notice.Todo, todos: Notice.Todo) => {
  try {
    submitLoading.value[todos.id] = true;
    if (todo.tag && todo.tag === 'create') {
      todos.children = todos.children.filter((item: any) => item.id !== todo.id);
    } else {
      await TodoApi.deleteTodo(todo.id);
      // 将本地todo同步
      if (todos.children) {
        todos.children = todos.children.filter((item: any) => item.id !== todo.id);
      }
      window.$message?.success($t('common.deleteSuccess'));
      getTodoList();
    }
  } catch (e: any) {
    window.$message?.error(e.message || e);
  } finally {
    submitLoading.value[todos.id] = false;
  }
};

// 完成
const handleChecked = async (checked: boolean, todo: Notice.Todo) => {
  try {
    todo.isDone = checked;
    await TodoApi.doneTodo(todo.id, checked ? 1 : 0);
    getTodoList();
  } catch (error: any) {
    window.$message.error(error.errMsg || error.message || error);
  }
};

// 排序
const handleUpdateSort = async (event: any) => {
  try {
    const { pid } = event.data;
    console.log('unref(todoList)', unref(todoList));
    const sortTodos = unref(todoList)
      .find((item: any) => item.id === pid)
      ?.children.map((todo: Notice.Todo, index: number) => {
        return {
          id: todo.id,
          sortOrder: index,
        };
      });
    await TodoApi.updateTodoOrder({ sort: sortTodos, pid });
  } catch (error: any) {
    window.$message.error(error.errMsg || error.message || error);
  }
};

// 父卡片拖拽排序
const handleUpdateSortParent = async () => {
  try {
    const sortTodoList = unref(todoList).map((todo: Notice.Todo, index: number) => {
      return {
        id: todo.id,
        sortOrder: index,
      };
    });
    await TodoApi.updateTodoOrder({ sort: sortTodoList });
  } catch (error: any) {
    window.$message.error(error.errMsg || error.message || error);
  }
};
// 跨表拖拽
const handleAdd = async (event: any) => {
  try {
    // const prePid = event.data.pid;
    const pid = Number(event.to.id);
    const sortTodos = unref(todoList)
      .find((item: any) => item.id === pid)
      ?.children.map((todo: Notice.Todo, index: number) => {
        return {
          id: todo.id,
          sortOrder: index,
        };
      });
    await TodoApi.updateTodoOrder({ sort: sortTodos, pid });
  } catch (error: any) {
    window.$message.error(error.errMsg || error.message || error);
  }
};

// 模拟数据
const handleAddMock = async () => {
  console.log('adminTodo', adminTodo);
  console.log('doctorTodo', doctorTodo);
  console.log('patientTodo', patientTodo);
  todoList.value.forEach(async (item: any) => {
    if (item.title === '管理员角色') {
      adminTodo.forEach(async (todo: any, index: number) => {
        await TodoApi.createTodo({
          title: todo,
          sortOrder: index,
          pid: item.id,
        });
      });
    }
    if (item.title === '医生角色') {
      doctorTodo.forEach(async (todo: any, index: number) => {
        await TodoApi.createTodo({
          title: todo,
          sortOrder: index,
          pid: item.id,
        });
      });
    }
    if (item.title === '患者角色') {
      patientTodo.forEach(async (todo: any, index: number) => {
        await TodoApi.createTodo({
          title: todo,
          sortOrder: index,
          pid: item.id,
        });
      });
    }
  });
};
</script>
