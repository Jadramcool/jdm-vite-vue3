import request from '@/utils/http/axios';

enum API {
  list = '/todo/list',
  create = '/todo/create',
  update = '/todo/update',
  delete = '/todo/delete',
  done = '/todo/done',
  updateOrder = '/todo/updateOrder',
  timeLine = '/todo/timeLine',
}

/**
 * @description: 获取待办事项
 */
export const todoList = (params?: any) => {
  return request.get<Notice.Todo[]>({
    url: API.list,
    params,
  });
};

/**
 * @description: 创建待办事项
 */
export const createTodo = (data: any) => {
  return request.post<Notice.Todo>({
    url: API.create,
    data,
  });
};

/**
 * @description: 更新待办事项
 */
export const updateTodo = (data: any) => {
  return request.put<Notice.Todo>({
    url: API.update,
    data,
  });
};

/**
 * @description: 删除待办事项
 */
export const deleteTodo = (id: number) => {
  return request.delete<Notice.Todo>({
    url: `${API.delete}/${id}`,
  });
};

/**
 * @description: 用户阅读待办事项
 */
export const doneTodo = (id: number, status?: number) => {
  return request.put<number>({
    url: `${API.done}/${id}/${status}`,
  });
};

/**
 * @description: 更新顺序
 */
export const updateTodoOrder = (data: any) => {
  return request.put<Notice.Todo>({
    url: API.updateOrder,
    data,
  });
};

/**
 * @description: 获取完成时间线
 */
export const getTodoTimeLine = () => {
  return request.get<Notice.Todo[]>({
    url: API.timeLine,
  });
};
