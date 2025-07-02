import request from '@/utils/http/axios';

enum API {
  xiaochengLogin = '/xiaocheng/login',
  xiaochengProjects = '/xiaocheng/projects',
  xiaochengJoinedTasks = '/xiaocheng/joined_tasks',
  xiaochengProjectTasks = '/xiaocheng/tasks',
}

export const xiaochengLogin = (data: XiaoCheng.LoginForm) => {
  const res = request.put({
    url: API.xiaochengLogin,
    data,
  });

  return res;
};

export const xiaochengProjects = (token: string) => {
  const res = request.get({
    url: API.xiaochengProjects,
    params: {
      with_options: JSON.stringify({ with_users: true, with_bots: true, with_lanes: true }),
      token,
    },
  });

  return res;
};

export const xiaochengJoinedTasks = (params: any) => {
  const res = request.get({
    url: API.xiaochengJoinedTasks,
    params,
  });

  return res;
};

export const xiaochengProjectTasks = (params: any) => {
  const res = request.get({
    url: API.xiaochengProjectTasks,
    params,
  });
  return res;
};
