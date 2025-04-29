<template>
  <div>
    <n-space>
      <n-button type="primary" @click="handleLogin">登录</n-button>
      <n-button type="warning" @click="handleProjects">获取项目</n-button>
    </n-space>

    <n-tabs type="segment" animated :value="checkedTab" @update:value="handleChangeTab">
      <n-tab :name="'0'" tab="全部"> </n-tab>
      <n-tab v-for="project in projects" :key="project.id" :name="project.id" :tab="project.name">
      </n-tab>
    </n-tabs>
    <div>
      <BasicTable
        ref="tableRef"
        :title="$t('modules.system.user.table.title')"
        :columns="columns"
        :request="handleJoinedTasks"
        :rowKey="(row: NaiveUI.RowData) => row.id"
        :pagination="{ pageSize: 10 }"
        :showAddBtn="false"
        :localPagination="true"
        :scroll-x="'max-content'"
      >
      </BasicTable>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { XiaoChengApi } from '@/api';
import { BasicTable } from '@/components';
import { lStorage } from '@/utils';
import { useTaskSchema } from './schema';

const userInfo = ref<any>({});
const projects = ref<any>([]);
const nowLanes = ref<any>([]);
const allLanes = ref<any>({});
const allTasks = ref<any>([]);

const token = computed(() => userInfo.value?.token || lStorage.getItem('xiaochengToken'));
const checkedTab = ref<number>(-1);
const tableRef = ref<any>(null);

const { columns } = useTaskSchema({ allLanes: allLanes.value });

// 解析token
const decodedToken = computed(() => {
  if (token.value) {
    try {
      const base64Url = token.value.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => {
            return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
          })
          .join(''),
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Token decoding failed', error);
      return null;
    }
  }
  return null;
});

// 获取用户id 通过token或者登录后拿到
const userId = computed(() => userInfo.value?.user_id || decodedToken.value?.data?.user_id);

onMounted(async () => {
  await handleProjects();
});

const loginForm = {
  username: '15952054087',
  password: 'JIADAOMING0119++',
  login_key: '15952054087',
  login_secret: 'JIADAOMING0119++',
};

/**
 * 处理用户登录的异步函数。
 * 该函数调用小诚 API 进行登录，并将返回的用户信息存储在响应式变量中。
 * 如果登录成功，令牌将被存储在本地存储中。
 *
 * @async
 * @function handleLogin
 * @returns {Promise<void>} 无返回值
 */
const handleLogin = async () => {
  const res = await XiaoChengApi.xiaochengLogin(loginForm);
  userInfo.value = res;
  if (res.token) {
    lStorage.setItem('xiaochengToken', res.token);
  }
};

/**
 * 处理项目数据的异步函数。
 * 该函数调用 XiaoChengApi 获取TeamDo项目列表，并将结果存储在 projects 变量中。
 * 同时，将选中的标签设置为第一个项目的 ID。
 *
 * @async
 * @function handleProjects
 * @returns {Promise<void>} 无返回值
 */
const handleProjects = async (): Promise<void> => {
  const res = await XiaoChengApi.xiaochengProjects(token.value);
  projects.value = res;
  projects.value.forEach((item: any) => {
    item.lanes.forEach((item: any) => {
      allLanes.value[item.id] = item.name;
    });
  });
  checkedTab.value = 0;
};

const handleJoinedTasks = async (data: Query.GetParams) => {
  const params: any = {
    user_id: 0,
    // filters: { status__in: ['0'] },
    order_fields: '-assignor_display_index,-importance,-updated_at',
    cur_page: data?.pagination?.page || 1,
    page_size: data?.pagination?.pageSize || 10,
    with_options: { with_users: true, with_tags: true, with_project: true },
    token: token.value,
  };
  const res = await XiaoChengApi.xiaochengJoinedTasks(params);
  const resp = {
    data: res.tasks,
    pagination: {
      page: res.page_info.cur_page,
      pageSize: res.page_info.page_size,
      totalRecords: res.page_info.total_count,
      totalPages: res.page_info.max_page,
    },
  };
  return resp;
};

const handleProjectTasks = async (projectId: number, lanes: Array<number>) => {
  const baseParams: any = {
    project_id: projectId,
    with_options: {
      with_users: true,
      with_tags: true,
      with_lane_stats: true,
    },
    filters: { assignor_id: userId.value },
    cur_page: 1,
    page_size: 200,
    order_fields: '-display_index',
    token: token.value,
  };

  const params = [];

  for (let i = 0; i < lanes.length; i++) {
    const laneId = lanes[i];
    params.push({ ...baseParams, lane_id: laneId });
  }

  const resArray = await Promise.all(
    params.map((param) => XiaoChengApi.xiaochengProjectTasks(param)),
  );
  const tasksData = resArray.reduce((acc, cur) => {
    acc.push(...cur.tasks);
    return acc;
  }, []);

  allTasks.value = [...tasksData];
};

const handleChangeTab = async (id: number) => {
  checkedTab.value = id;

  if (Number(checkedTab.value) === 0) {
    tableRef.value.reload();
  } else {
    const nowProject = projects.value.find((item: any) => item.id === id);
    const lanes = nowProject?.lanes
      .filter((item: any) => item.kanban_type === 'kanban')
      .map((item: any) => item.id);
    nowLanes.value = nowProject?.lanes.map((item: any) => item);
    await handleProjectTasks(checkedTab.value, lanes);
  }
};
</script>
