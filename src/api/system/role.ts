import request from '@/utils/http/axios';
import type {
  CreateRoleParams,
  PaginationResponse,
  RoleListParams,
  UpdateRoleParams,
} from '#/api/user';

enum API {
  list = '/system/role/list',
  create = '/system/role/create',
  update = '/system/role/update',
  delete = '/system/role/delete',
  roleMenu = '/system/role/update/menu',
}

/**
 * @description: 获取角色列表
 * @param {RoleListParams} params
 */
export const roleList = (params?: RoleListParams): Promise<PaginationResponse<System.Role>> => {
  return request.get<PaginationResponse<System.Role>>({
    url: API.list,
    params,
  });
};

/**
 * @description: 获取所有角色
 */
export const getAllRoleList = (): Promise<PaginationResponse<System.Role>> => {
  return request.get<PaginationResponse<System.Role>>({
    url: API.list,
    params: {
      page: 1,
      pageSize: 999,
    },
  });
};

/**
 * @description: 创建角色
 * @param {CreateRoleParams} data
 */
export const addRole = (data: CreateRoleParams): Promise<System.Role> => {
  return request.post<System.Role>({
    url: API.create,
    data,
  });
};

/**
 * @description: 更新角色
 * @param {UpdateRoleParams} data
 */
export const updateRole = (data: UpdateRoleParams): Promise<System.Role> => {
  return request.put<System.Role>({
    url: API.update,
    data,
  });
};

/**
 * @description: 删除角色
 * @param {number} id
 */
export const deleteRole = (id: number): Promise<void> => {
  return request.delete<void>({
    url: `${API.delete}/${id}`,
  });
};

/**
 * @description: 更新角色菜单
 * @param {{ roleId: number; menuIds: number[] }} data
 */
export const updateRoleMenu = (data: { roleId: number; menuIds: number[] }): Promise<void> => {
  return request.post<void>({
    url: API.roleMenu,
    data,
  });
};
