import request from '@/utils/http-vben/axios';
import { exampleModel } from '../types/hello';

enum API {
  login = '/api/user/login',
}

export const login = (data: any) => {
  return request.post<exampleModel[]>({
    url: API.login,
    data,
  });
};
