import request from '@/utils/http/axios';
import { BasicModel } from '../types/base';

enum API {
  list = '/system/operation-log/list',
  create = '/system/operation-log/create',
  update = '/system/operation-log/update',
  detail = '/system/operation-log/detail',
  delete = '/system/operation-log/delete',
}

/**
 * @description: 获取操作日志列表（分页）
 */
export const getOpLogList = (params?: any) => {
  return request.get<{
    list: System.OperationLog[];
    total: number;
  }>({
    url: API.list,
    params,
  });
};

/**
 * @description: 创建操作日志
 */
export const createOpLog = (data: any) => {
  return request.post<System.OperationLog>({
    url: API.create,
    data,
  });
};

/**
 * @description: 更新操作日志
 */
export const updateOpLog = (data: any) => {
  return request.put<System.OperationLog>({
    url: API.update,
    data,
  });
};

/**
 * @description: 获取操作日志详情
 */
export const getOpLogDetail = (id: number | string) => {
  return request.get<System.OperationLog>({
    url: `${API.detail}/${id}`,
  });
};

/**
 * @description: 删除操作日志
 */
export const deleteOpLog = (id: number | string) => {
  return request.delete<BasicModel>({
    url: `${API.delete}/${id}`,
  });
};
