/*
 * @Author: Jay
 * @Date: 2024-05-30 10:29:46
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-30 17:46:14
 * @FilePath: \vite-vue3-jdm\src\api\system\userManager.ts
 * @Description:
 *
 */
import request from '@/utils/http/axios';
// import qs from 'qs';
import { BasicModel } from '../types/base';

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
 */
export const userList = (params: any) => {
  return request.get<BasicModel[]>({
    url: API.list,
    params,
  });
};

/**
 * @description: 新增用户
 */
export const addUser = (data: any) => {
  return request.post<BasicModel>({
    url: API.create,
    data,
  });
};

/**
 * @description: 更新用户
 */
export const updateUser = (data: any) => {
  return request.put<BasicModel>({
    url: API.update,
    data,
  });
};

/**
 * @description: 删除用户
 */
export const deleteUser = (id: number) => {
  return request.put<BasicModel>({
    url: `${API.delete}/${id}`,
  });
};

/**
 * @description: 批量删除用户
 */
export const batchDeleteUser = (ids: Array<number | string>) => {
  return request.put<BasicModel>({
    url: API.batchDelete,
    data: {
      ids,
    },
  });
};

/**
 * @description: 启用用户
 */
export const enableUser = (id: number, status: number) => {
  return request.put<BasicModel>({
    url: `${API.enable}/${id}`,
    data: {
      status,
    },
  });
};
