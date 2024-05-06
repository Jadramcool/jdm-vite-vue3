import request from '@/utils/http/axios';
import { exampleModel } from '../types/hello';
import { loginModel } from '../types/user';

enum API {
  login = '/user/login',
  register = '/user/register',
}

export const login = (data: loginModel) => {
  return request.post<exampleModel[]>({
    url: API.login,
    data,
  });
};

export const register = (data: loginModel) => {
  return request.post<exampleModel[]>({
    url: API.register,
    data,
  });
};
