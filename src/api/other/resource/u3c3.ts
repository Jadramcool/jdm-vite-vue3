import request from '@/utils/http/axios';
import { BasicModel, List } from '@/api/types';

enum API {
  list = '/external/u3c3/list',
  create = '/external/u3c3/create',
  update = '/external/u3c3/update',
  delete = '/external/u3c3/delete',
  roleMenu = '/external/u3c3/update/menu',
}

/**
 * @description: 获取列表
 */
export const list = (params?: any) => {
  return request.get<List<System.Role>>({
    url: API.list,
    params,
  });
};

/**
 * @description: 获取角色
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
