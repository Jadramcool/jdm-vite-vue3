import { keys } from '@/config/keys';
import axios from 'axios';

enum API {
  cityAddress = 'https://restapi.amap.com/v3/config/district',
}

/**
 * @description: 获取菜单
 */
export const cityAddress = async (params?: any): Promise<any> => {
  const parameters = {
    key: keys.gaodeKey,
    keywords: params?.keywords || '中国',
    subdistrict: params?.subdistrict || 3,
  };

  const res = await axios({
    url: API.cityAddress,
    params: parameters,
    method: 'get',
  });
  console.log('🚀 ~ cityAddress ~ res:', res);

  return res;
};
