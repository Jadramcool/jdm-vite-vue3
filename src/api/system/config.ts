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
import { List } from '../types';

enum API {
  list = '/system/config/list',
  create = '/system/config/create',
  update = '/system/config/update',
  delete = '/system/config/delete',
  batchDelete = '/system/config/batchDelete',
  enable = '/system/config/status',
  public = '/system/config/public',
  detail = '/system/config/detail',
  key = '/system/config/key',
  validatePassword = '/system/config/validate-password',
}

/**
 * @description: 获取配置列表
 */
export const configList = (params: any) => {
  return request.get<List<System.SysConfig>>({
    url: API.list,
    params,
  });
};

/**
 * @description: 获取配置详情
 */
export const configDetail = (id: number) => {
  return request.get<System.SysConfig>({
    url: `${API.detail}/${id}`,
  });
};

/**
 * @description: 获取配置键值
 */
export const configKey = (key: string) => {
  return request.get<System.SysConfig>({
    url: `${API.key}/${key}`,
  });
};

/**
 * @description: 新增配置
 */
export const createConfig = (data: any) => {
  return request.post<System.SysConfig>({
    url: API.create,
    data,
  });
};

/**
 * @description: 更新配置
 */
export const updateConfig = (data: any) => {
  return request.put<System.SysConfig>({
    url: API.update,
    data,
  });
};

/**
 * @description: 删除配置
 */
export const deleteConfig = (id: number) => {
  return request.delete<System.SysConfig>({
    url: `${API.delete}/${id}`,
  });
};

/**
 * @description: 批量删除配置
 */
export const batchDeleteConfig = (ids: Array<number | string>) => {
  return request.put<System.SysConfig>({
    url: API.batchDelete,
    data: {
      ids,
    },
  });
};

/**
 * @description: 启用配置
 */
export const enableConfig = (id: number, status: number) => {
  return request.put<System.SysConfig>({
    url: `${API.enable}/${id}`,
    data: {
      status,
    },
  });
};

/**
 * @description: 查询配置
 */
export const publicConfig = () => {
  return request.get<System.SysConfig>({
    url: `${API.public}`,
  });
};

/**
 * @description: 校验密码
 */
export const validatePassword = (data: any) => {
  return request.post<System.SysConfig>({
    url: API.validatePassword,
    data,
  });
};
