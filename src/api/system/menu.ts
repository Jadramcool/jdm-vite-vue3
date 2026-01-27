import request from '@/utils/http/axios';
import type { CreateMenuParams, MenuListParams, UpdateMenuParams } from '#/api/user';

enum API {
  menu = '/system/menu/list',
  create = '/system/menu/create',
  update = '/system/menu/update',
  delete = '/system/menu/delete',
  batchDelete = '/system/menu/batchDelete',
  onlineMenu = '/system/menu/onlineMenus', // 非登陆模式下获取在线菜单
}

/**
 * @description: 获取菜单
 * @param {MenuListParams} params
 */
export const menuList = (params?: MenuListParams): Promise<System.Menu[]> => {
  return request.get<System.Menu[]>({
    url: API.menu,
    params,
  });
};

/**
 * @description: 创建菜单
 * @param {CreateMenuParams} data
 */
export const createMenu = (data: CreateMenuParams): Promise<System.Menu> => {
  return request.post<System.Menu>({
    url: API.create,
    data,
  });
};

/**
 * @description: 更新菜单
 * @param {UpdateMenuParams} data
 */
export const updateMenu = (data: UpdateMenuParams): Promise<System.Menu> => {
  return request.put<System.Menu>({
    url: API.update,
    data,
  });
};

/**
 * @description: 删除菜单
 * @param {number} id
 */
export const deleteMenu = (id: number): Promise<void> => {
  return request.delete<void>({
    url: `${API.delete}/${id}`,
  });
};

/**
 * @description: 批量删除菜单
 * @param {Array<number | string>} ids
 */
export const batchDeleteMenu = (ids: Array<number | string>): Promise<void> => {
  return request.delete<void>({
    url: API.batchDelete,
    data: {
      ids,
    },
  });
};

/**
 * @description: 获取在线菜单
 */
export const onlineMenu = (): Promise<System.Menu[]> => {
  return request.get<System.Menu[]>({
    url: API.onlineMenu,
  });
};
