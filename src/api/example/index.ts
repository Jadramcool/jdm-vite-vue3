import request from '@/utils/http-vben/axios';
import { exampleModel } from '../types/hello';

enum API {
  example = '/dailyEnglish',
  hupu = 'hotlist/huPu',
  mockUserInfo = '/api/user/info',
  mockLogin = '/api/user/login',
  mockPremission = '/api/premission/menu',
  mockPremission1 = '/api/premission/menu1',
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

export const mockGetUserInfoAPI = () => {
  return request.get<exampleModel[]>({
    url: API.mockUserInfo,
  });
};

export const mockPostAPI = (data: any) => {
  return request.post<exampleModel[]>({
    url: API.mockLogin,
    data,
  });
};

export const mockPremissionAPI = () => {
  return request.get<exampleModel[]>({
    url: API.mockPremission,
  });
};

export const mockPremission1API = () => {
  return request.get<exampleModel[]>({
    url: API.mockPremission1,
  });
};
