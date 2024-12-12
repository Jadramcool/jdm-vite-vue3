import { keys } from '@/config/keys';
import axios from 'axios';

enum API {
  cityAddress = 'https://restapi.amap.com/v3/config/district',
  cityWeather = 'https://restapi.amap.com/v3/weather/weatherInfo',
  ipAddress = 'https://restapi.amap.com/v3/ip',
}

/**
 * @description: 获取省市区，暂时没用，数据量大了，采用存在本地的形式
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

  return res;
};

/**
 * @description: 获取当前城市的天气
 */
export const cityWeather = async (): Promise<any> => {
  // 首先拿到当前ip地址
  const ipRes = await axios({
    url: API.ipAddress,
    params: {
      key: keys.gaodeKey,
    },
    method: 'get',
  });

  if (ipRes?.data?.adcode) {
    const parameters = {
      key: keys.gaodeKey,
      city: ipRes?.data?.adcode || '320100', // 默认南京
    };

    const res = await axios({
      url: API.cityWeather,
      params: parameters,
      method: 'get',
    });
    return res.data;
  }
  return null;
};
