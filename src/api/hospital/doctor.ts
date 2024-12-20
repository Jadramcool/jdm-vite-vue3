import request from '@/utils/http/axios';
import { List } from '../types';
import { BasicModel } from '../types/base';

enum API {
  list = '/hospital/doctor/list',
  create = '/hospital/doctor/create',
  update = '/hospital/doctor/update',
  delete = '/hospital/doctor/delete',
  batchDelete = '/hospital/doctor/batchDelete',
  enable = '/hospital/doctor/status',
}

/**
 * @description: 获取医生列表
 */
export const list = (params: any) => {
  return request.get<List<Hospital.Doctor>>({
    url: API.list,
    params,
  });
};

/**
 * @description: 新增医生
 */
export const create = (data: any) => {
  return request.post<BasicModel>({
    url: API.create,
    data,
  });
};

/**
 * @description: 更新医生
 */
export const update = (data: any) => {
  return request.put<BasicModel>({
    url: API.update,
    data,
  });
};

/**
 * @description: 删除医生
 */
export const deleteDoctor = (id: number) => {
  return request.delete<BasicModel>({
    url: `${API.delete}/${id}`,
  });
};

/**
 * @description: 批量删除医生
 */
export const batchDelete = (ids: Array<number | string>) => {
  return request.delete<BasicModel>({
    url: API.batchDelete,
    data: {
      ids,
    },
  });
};

/**
 * @description: 启用医生
 */
export const enable = (id: number, status: number) => {
  return request.put<BasicModel>({
    url: `${API.enable}/${id}`,
    data: {
      status,
    },
  });
};
