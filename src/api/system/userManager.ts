import request from '@/utils/http/axios';
import qs from 'qs';
import { exampleModel } from '../types/hello';

enum API {
  userList = '/system/user/list',
}

/**
 * @description: 获取用户列表
 */
export const userList = (params: any) => {
  return request.get<exampleModel[]>({
    url: API.userList,
    params,
    paramsSerializer: (params) => {
      return qs.stringify(params, { encode: true, arrayFormat: 'repeat' });
    },
  });
};
