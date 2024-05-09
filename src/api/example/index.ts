import request from '@/utils/http/axios';
import { exampleModel } from '../types/hello';

enum API {
  example = '/dailyEnglish',
  hupu = 'hotlist/huPu',
  mockUserInfo = '/mock/user/info',
  mockLogin = '/mock/user/login',
  mockPremission = '/mock/premission/menu',
  mockPremission1 = '/mock/premission/menu1',
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
