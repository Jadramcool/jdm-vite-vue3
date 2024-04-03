import request from '@/utils/http-vben/axios';
import { exampleModel } from '../types/hello';

enum API {
  example = '/dailyEnglish',
  hupu = 'hotlist/huPu',
  mock = '/api/user/info',
  mockLogin = '/api/user/login',
}

export const exampleAPI = () => {
  return request.get<exampleModel[]>({
    url: API.example,
    params: {
      type: 'sj',
    },
  });
};

export const exampleHupuAPI = () => {
  return request.get<exampleModel[]>({
    url: API.hupu,
  });
};

export const mockAPI = () => {
  return request.get<exampleModel[]>({
    url: API.mock,
  });
};

export const mockPostAPI = (data: any) => {
  return request.post<exampleModel[]>({
    url: API.mockLogin,
    data,
  });
};
