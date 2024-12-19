import request from '@/utils/http/axios';
import { List } from '../types';

enum API {
  list = '/hospital/department/list',
  detail = '/hospital/department/detail',
  create = '/hospital/department/create',
  update = '/hospital/department/update',
  delete = '/hospital/department/delete',
}

/**
 * @description: 获取部门
 */
export const departmentList = (params?: any) => {
  return request.get<List<Hospital.Department>>({
    url: API.list,
    params,
  });
};

/**
 * @description: 获取科室详细信息
 */
export const departmentDetail = (noticeId: number) => {
  return request.get<Hospital.Department>({
    url: `${API.detail}/${noticeId}`,
  });
};

/**
 * @description: 创建科室
 */
export const createDepartment = (data: any) => {
  return request.post<Hospital.Department>({
    url: API.create,
    data,
  });
};

/**
 * @description: 更新科室
 */
export const updateDepartment = (data: any) => {
  return request.put<Hospital.Department>({
    url: API.update,
    data,
  });
};

/**
 * @description: 删除科室
 */
export const deleteDepartment = (id: number) => {
  return request.delete<Hospital.Department>({
    url: `${API.delete}/${id}`,
  });
};
