import { BasicModel, List } from '@/api/types';
import request from '@/utils/http/axios';

enum API {
  list = '/external/u3c3/list',
  create = '/external/u3c3/create',
  update = '/external/u3c3/update',
  delete = '/external/u3c3/delete',
  roleMenu = '/external/u3c3/update/menu',
  log = '/external/execution-logs',
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
 * @description: 更新角色
 */
export const updateRole = (data: any) => {
  return request.put<BasicModel[]>({
    url: API.update,
    data,
  });
};

/**
 * @description: 删除数据
 */
export const deleteData = (id: number) => {
  return request.delete<BasicModel[]>({
    url: `${API.delete}/${id}`,
  });
};

/**
 * @description: 查看日志
 */
export const logData = (params: any) => {
  return request.get<BasicModel[]>({
    url: API.log,
    params,
  });
};
