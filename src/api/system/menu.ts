import request from '@/utils/http/axios';
import { BasicModel } from '../types/base';

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
 */
export const menuList = (params?: any) => {
  return request.get<System.Menu[]>({
    url: API.menu,
    params,
  });
};

/**
 * @description: 创建菜单
 */
export const createMenu = (data: any) => {
  return request.post<System.Menu>({
    url: API.create,
    data,
  });
};

/**
 * @description: 更新菜单
 */
export const updateMenu = (data: any) => {
  return request.put<System.Menu>({
    url: API.update,
    data,
  });
};

/**
 * @description: 删除菜单
 */
export const deleteMenu = (id: number) => {
  return request.delete<BasicModel>({
    url: `${API.delete}/${id}`,
  });
};

/**
 * @description: 批量删除菜单
 */
export const batchDeleteMenu = (ids: Array<number | string>) => {
  return request.delete<BasicModel>({
    url: API.batchDelete,
    data: {
      ids,
    },
  });
};

/**
 * @description: 获取在线菜单
 */
export const onlineMenu = () => {
  return request.get<System.Menu[]>({
    url: API.onlineMenu,
  });
};
