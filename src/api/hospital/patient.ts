import request from '@/utils/http/axios';
import { List } from '../types';

enum API {
  list = '/hospital/patient/list',
  create = '/hospital/patient/create',
  update = '/hospital/patient/update',
  delete = '/hospital/patient/delete',
  batchDelete = '/hospital/patient/batchDelete',
  enable = '/hospital/patient/status',
  detail = '/hospital/patient/detail',
}

/**
 * @description: 获取患者列表
 */
export const list = (params: any) => {
  return request.get<List<Hospital.Patient>>({
    url: API.list,
    params,
  });
};

/**
 * @description: 获取患者详情
 */
export const detail = (id: number) => {
  return request.get<Hospital.Patient>({
    url: `${API.detail}/${id}`,
  });
};

/**
 * @description: 新增患者
 */
export const create = (data: any) => {
  return request.post<Hospital.Patient>({
    url: API.create,
    data,
  });
};

/**
 * @description: 更新患者
 */
export const update = (data: any) => {
  return request.put<Hospital.Patient>({
    url: API.update,
    data,
  });
};

/**
 * @description: 删除患者
 */
export const deletePatient = (id: number) => {
  return request.delete<Hospital.Patient>({
    url: `${API.delete}/${id}`,
  });
};

/**
 * @description: 批量删除患者
 */
export const batchDelete = (ids: Array<number | string>) => {
  return request.delete<Hospital.Patient>({
    url: API.batchDelete,
    data: {
      ids,
    },
  });
};

/**
 * @description: 启用患者
 */
export const enable = (id: number, status: number) => {
  return request.put<Hospital.Patient>({
    url: `${API.enable}/${id}`,
    data: {
      status,
    },
  });
};
