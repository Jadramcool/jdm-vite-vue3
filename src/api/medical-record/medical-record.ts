import request from '@/utils/http/axios';
import { List } from '../types';

enum API {
  list = '/medicalRecord/list',
  create = '/medicalRecord/create',
  update = '/medicalRecord/update',
}

/**
 * @description: 获取挂号列表
 */
export const list = (params: any) => {
  return request.get<List<MedicalRecord.MedicalRecord>>({
    url: API.list,
    params,
  });
};

/**
 * @description: 新建病例
 */
export const create = (data: any) => {
  return request.post<MedicalRecord.MedicalRecord>({
    url: API.create,
    data,
  });
};

/**
 * @description: 更新病例
 */
export const update = (data: any) => {
  return request.put<MedicalRecord.MedicalRecord>({
    url: API.update,
    data,
  });
};
