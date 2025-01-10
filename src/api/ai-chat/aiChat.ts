import request from '@/utils/http/axios';

enum API {
  zhipuAI = '/aiChat/zhipu-chat',
}

/**
 * @description: 获取挂号列表
 */
export const zhipuAI = (data: any) => {
  return request.post<any>({
    url: API.zhipuAI,
    data,
  });
};
