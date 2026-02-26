import request from '@/utils/http/axios';
import { BasicModel, List } from '../types';

enum API {
  list = '/system/role/list',
  create = '/system/role/create',
  update = '/system/role/update',
  delete = '/system/role/delete',
  roleMenu = '/system/role/update/menu',
}

/**
 * @description: 获取角色列表
 */
export const roleList = (params?: any) => {
  return request.get<List<System.Role>>({
    url: API.list,
    params,
  });
};

/**
 * @description: 获取所有角色
 */
export const getAllRoleList = () => {
  return request.get<List<System.Role>>({
    url: API.list,
    params: {
      pagination: {
        page: 1,
        pageSize: 999,
      },
    },
  });
};

/**
 * @description: 创建角色
 */
export const addRole = (data: any) => {
  return request.post<System.Role>({
    url: API.create,
    data,
  });
};

/**
 * @description: 更新角色
 */
export const updateRole = (data: any) => {
  return request.put<BasicModel[]>({
    url: API.update,
    data,
  });
};

/**
 * @description: 删除角色
 */
export const deleteRole = (id: number) => {
  return request.delete<BasicModel[]>({
    url: `${API.delete}/${id}`,
  });
};

/**
 * @description: 更新角色菜单
 */
export const updateRoleMenu = (data: any) => {
  return request.post<BasicModel[]>({
    url: API.roleMenu,
    data,
  });
};
