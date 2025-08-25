import request from '@/utils/http/axios';
import { BasicModel } from '../types/base';

enum API {
  list = '/system/department/list',
  tree = '/system/department/tree',
  create = '/system/department/create',
  update = '/system/department/update',
  detail = '/system/department/detail',
  delete = '/system/department/delete',
  members = '/system/department/members',
  assignUser = '/system/department/assign-user',
  batchAssignUsers = '/system/department/batch-assign-users',
  removeUser = '/system/department/remove-user',
  assignRole = '/system/department/assign-role',
  removeRole = '/system/department/remove-role',
  search = '/system/department/search',
  stats = '/system/department/stats',
  enable = '/system/department/enable',
  disable = '/system/department/disable',
}

/**
 * @description: 获取部门列表（分页）
 */
export const getDepartmentList = (params?: any) => {
  return request.get<{
    list: System.Department[];
    total: number;
  }>({
    url: API.list,
    params,
  });
};

/**
 * @description: 获取部门树形结构
 */
export const getDepartmentTree = (params?: any) => {
  return request.get<System.Department[]>({
    url: API.tree,
    params,
  });
};

/**
 * @description: 创建部门
 */
export const createDepartment = (data: any) => {
  return request.post<System.Department>({
    url: API.create,
    data,
  });
};

/**
 * @description: 更新部门信息
 */
export const updateDepartment = (data: any) => {
  return request.put<System.Department>({
    url: API.update,
    data,
  });
};

/**
 * @description: 获取部门详情
 */
export const getDepartmentDetail = (id: number | string) => {
  return request.get<System.Department>({
    url: `${API.detail}/${id}`,
  });
};

/**
 * @description: 删除部门
 */
export const deleteDepartment = (id: number | string) => {
  return request.delete<BasicModel>({
    url: `${API.delete}/${id}`,
  });
};

/**
 * @description: 获取部门成员列表
 */
export const getDepartmentMembers = (id: number | string, params?: any) => {
  return request.get<System.User[]>({
    url: `${API.members}/${id}`,
    params,
  });
};

/**
 * @description: 分配用户到部门
 */
export const assignUserToDepartment = (data: {
  userId: number | string;
  departmentId: number | string;
}) => {
  return request.post<BasicModel>({
    url: API.assignUser,
    data,
  });
};

/**
 * @description: 批量分配用户到部门
 */
export const batchAssignUsersToDepartment = (data: {
  userIds: Array<number | string>;
  departmentId: number | string;
}) => {
  return request.post<BasicModel>({
    url: API.batchAssignUsers,
    data,
  });
};

/**
 * @description: 从部门移除用户
 */
export const removeUserFromDepartment = (data: {
  userId: number | string;
  departmentId: number | string;
}) => {
  return request.delete<BasicModel>({
    url: API.removeUser,
    data,
  });
};

/**
 * @description: 分配角色到部门
 */
export const assignRoleToDepartment = (data: {
  roleId: number | string;
  departmentId: number | string;
}) => {
  return request.post<BasicModel>({
    url: API.assignRole,
    data,
  });
};

/**
 * @description: 从部门移除角色
 */
export const removeRoleFromDepartment = (data: {
  roleId: number | string;
  departmentId: number | string;
}) => {
  return request.delete<BasicModel>({
    url: API.removeRole,
    data,
  });
};

/**
 * @description: 搜索部门
 */
export const searchDepartments = (params: { keyword: string; [key: string]: any }) => {
  return request.get<System.Department[]>({
    url: API.search,
    params,
  });
};

/**
 * @description: 获取部门统计信息
 */
export const getDepartmentStats = (id?: number | string) => {
  return request.get<any>({
    url: id ? `${API.stats}/${id}` : API.stats,
  });
};

/**
 * @description: 启用部门
 */
export const enableDepartment = (id: number | string) => {
  return request.put<BasicModel>({
    url: `${API.enable}/${id}`,
  });
};

/**
 * @description: 停用部门
 */
export const disableDepartment = (id: number | string) => {
  return request.put<BasicModel>({
    url: `${API.disable}/${id}`,
  });
};
