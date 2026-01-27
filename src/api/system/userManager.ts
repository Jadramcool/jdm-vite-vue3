import request from '@/utils/http/axios';
import type { PaginationResponse, UpdateUserParams, UserListParams } from '#/api/user';

enum API {
  list = '/system/user/list',
  create = '/system/user/create',
  update = '/system/user/update',
  delete = '/system/user/delete',
  batchDelete = '/system/user/batchDelete',
  enable = '/system/user/status',
}

/**
 * @description: 获取用户列表
 * @param {UserListParams} params 查询参数
 */
export const userList = (params: UserListParams): Promise<PaginationResponse<System.User>> => {
  return request.get<PaginationResponse<System.User>>({
    url: API.list,
    params,
  });
};

/**
 * @description: 新增用户
 * @param {{ username: string; password: string; email?: string; phone?: string; departmentId?: number; roleIds?: number[] }} data
 */
export const addUser = (data: {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  departmentId?: number;
  roleIds?: number[];
}): Promise<System.User> => {
  return request.post<System.User>({
    url: API.create,
    data,
  });
};

/**
 * @description: 更新用户
 * @param {UpdateUserParams} data
 */
export const updateUser = (data: UpdateUserParams): Promise<System.User> => {
  return request.put<System.User>({
    url: API.update,
    data,
  });
};

/**
 * @description: 删除用户
 * @param {number} id
 */
export const deleteUser = (id: number): Promise<void> => {
  return request.put<void>({
    url: `${API.delete}/${id}`,
  });
};

/**
 * @description: 批量删除用户
 * @param {Array<number | string>} ids
 */
export const batchDeleteUser = (ids: Array<number | string>): Promise<void> => {
  return request.put<void>({
    url: API.batchDelete,
    data: {
      ids,
    },
  });
};

/**
 * @description: 启用用户
 * @param {number} id
 * @param {number} status
 */
export const enableUser = (id: number, status: number): Promise<System.User> => {
  return request.put<System.User>({
    url: `${API.enable}/${id}`,
    data: {
      status,
    },
  });
};
