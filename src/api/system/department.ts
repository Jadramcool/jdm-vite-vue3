import request from '@/utils/http/axios';
import type {
  CreateDepartmentParams,
  DepartmentListParams,
  PaginationResponse,
  UpdateDepartmentParams,
} from '#/api/user';

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
 * @param {DepartmentListParams} params
 */
export const getDepartmentList = (
  params?: DepartmentListParams,
): Promise<PaginationResponse<System.Department>> => {
  return request.get<PaginationResponse<System.Department>>({
    url: API.list,
    params,
  });
};

/**
 * @description: 获取部门树形结构
 * @param {{ status?: number }} params
 */
export const getDepartmentTree = (params?: { status?: number }): Promise<System.Department[]> => {
  return request.get<System.Department[]>({
    url: API.tree,
    params,
  });
};

/**
 * @description: 创建部门
 * @param {CreateDepartmentParams} data
 */
export const createDepartment = (data: CreateDepartmentParams): Promise<System.Department> => {
  return request.post<System.Department>({
    url: API.create,
    data,
  });
};

/**
 * @description: 更新部门信息
 * @param {UpdateDepartmentParams} data
 */
export const updateDepartment = (data: UpdateDepartmentParams): Promise<System.Department> => {
  return request.put<System.Department>({
    url: API.update,
    data,
  });
};

/**
 * @description: 获取部门详情
 * @param {number | string} id
 */
export const getDepartmentDetail = (id: number | string): Promise<System.Department> => {
  return request.get<System.Department>({
    url: `${API.detail}/${id}`,
  });
};

/**
 * @description: 删除部门
 * @param {number | string} id
 */
export const deleteDepartment = (id: number | string): Promise<void> => {
  return request.delete<void>({
    url: `${API.delete}/${id}`,
  });
};

/**
 * @description: 获取部门成员列表
 * @param {number | string} id
 * @param {{ page?: number; pageSize?: number }} params
 */
export const getDepartmentMembers = (
  id: number | string,
  params?: { page?: number; pageSize?: number },
): Promise<PaginationResponse<System.User>> => {
  return request.get<PaginationResponse<System.User>>({
    url: `${API.members}/${id}`,
    params,
  });
};

/**
 * @description: 分配用户到部门
 * @param {{ userId: number | string; departmentId: number | string }} data
 */
export const assignUserToDepartment = (data: {
  userId: number | string;
  departmentId: number | string;
}): Promise<void> => {
  return request.post<void>({
    url: API.assignUser,
    data,
  });
};

/**
 * @description: 批量分配用户到部门
 * @param {{ userIds: Array<number | string>; departmentId: number | string }} data
 */
export const batchAssignUsersToDepartment = (data: {
  userIds: Array<number | string>;
  departmentId: number | string;
}): Promise<void> => {
  return request.post<void>({
    url: API.batchAssignUsers,
    data,
  });
};

/**
 * @description: 从部门移除用户
 * @param {{ userId: number | string; departmentId: number | string }} data
 */
export const removeUserFromDepartment = (data: {
  userId: number | string;
  departmentId: number | string;
}): Promise<void> => {
  return request.delete<void>({
    url: API.removeUser,
    data,
  });
};

/**
 * @description: 分配角色到部门
 * @param {{ roleId: number | string; departmentId: number | string }} data
 */
export const assignRoleToDepartment = (data: {
  roleId: number | string;
  departmentId: number | string;
}): Promise<void> => {
  return request.post<void>({
    url: API.assignRole,
    data,
  });
};

/**
 * @description: 从部门移除角色
 * @param {{ roleId: number | string; departmentId: number | string }} data
 */
export const removeRoleFromDepartment = (data: {
  roleId: number | string;
  departmentId: number | string;
}): Promise<void> => {
  return request.delete<void>({
    url: API.removeRole,
    data,
  });
};

/**
 * @description: 搜索部门
 * @param {{ keyword: string; [key: string]: any }} params
 */
export const searchDepartments = (params: {
  keyword: string;
  [key: string]: any;
}): Promise<System.Department[]> => {
  return request.get<System.Department[]>({
    url: API.search,
    params,
  });
};

/**
 * @description: 获取部门统计信息
 * @param {number | string} id
 */
export const getDepartmentStats = (id?: number | string): Promise<any> => {
  return request.get<any>({
    url: id ? `${API.stats}/${id}` : API.stats,
  });
};

/**
 * @description: 启用部门
 * @param {number | string} id
 */
export const enableDepartment = (id: number | string): Promise<void> => {
  return request.put<void>({
    url: `${API.enable}/${id}`,
  });
};

/**
 * @description: 停用部门
 * @param {number | string} id
 */
export const disableDepartment = (id: number | string): Promise<void> => {
  return request.put<void>({
    url: `${API.disable}/${id}`,
  });
};
