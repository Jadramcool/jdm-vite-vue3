import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import qs from 'qs';

import errorHandler from '@/utils/error/ErrorHandler';
import Logger from '@/utils/logger/Logger';
import { getToken } from '../token/index';
import { CodeConfig as HttpCodeConfig } from './codeConfig.ts';
import { ResponseModel } from './types/index.ts';

// 存储当前挂起的请求
const pendingMap = new Map<string, AbortController>();

/**
 * 生成请求的唯一标识
 * @param config
 */
const getPendingUrl = (config: AxiosRequestConfig) => {
  return [config.method, config.url, qs.stringify(config.params), qs.stringify(config.data)].join(
    '&',
  );
};

class HttpRequest {
  service: AxiosInstance;

  constructor() {
    const baseURL = import.meta.env.VITE_MOCK === 'true' ? '' : import.meta.env.VITE_APP_BASE_URL;
    this.service = axios.create({
      baseURL,
      timeout: 10 * 1000,
    });

    // 请求拦截器
    this.service.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // 添加到pendingMap
        const controller = new AbortController();
        config.signal = controller.signal;
        const key = getPendingUrl(config);
        if (!pendingMap.has(key)) {
          pendingMap.set(key, controller);
        }

        if (import.meta.env.VITE_APP_TOKEN_KEY && getToken()) {
          config.headers.authorization = `Bearer ${getToken()}`;
        }
        return config;
      },
      (error: AxiosError) => {
        Logger.error('requestError: ', error);
        return Promise.reject(error);
      },
    );

    // 响应拦截器
    this.service.interceptors.response.use(
      (response: AxiosResponse<ResponseModel>): AxiosResponse['data'] => {
        // 请求完成，从pendingMap移除
        const key = getPendingUrl(response.config);
        pendingMap.delete(key);

        const { data } = response;
        const { code } = data;
        if (code && code !== HttpCodeConfig.success) {
          // 使用统一的错误处理
          errorHandler.handle(
            {
              response,
              message: data.errMsg || data.message || 'Unknown error',
            },
            'HTTP Response',
          );
          return Promise.reject(data);
        }
        return data;
      },
      (error: AxiosError) => {
        // 请求失败或取消，从pendingMap移除
        if (error.config) {
          const key = getPendingUrl(error.config);
          pendingMap.delete(key);
        }
        if (axios.isCancel(error)) {
          return Promise.reject(error);
        }
        // 使用统一的错误处理
        errorHandler.handle(error, 'HTTP Request');
        return Promise.reject(error);
      },
    );
  }

  /**
   * 取消所有挂起的请求
   */
  // eslint-disable-next-line class-methods-use-this
  public cancelAllRequest() {
    for (const controller of pendingMap.values()) {
      controller.abort();
    }
    pendingMap.clear();
  }

  // 执行请求
  private async executeRequest<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      // 这个方法会影响原始参数，导致isEqual方法返回false
      if (config.params) {
        Object.entries(config.params).forEach(([key, value]) => {
          if (Array.isArray(value) || typeof value === 'object') {
            config.params[key] = JSON.stringify(value);
          }
        });
      }
      // 将请求参数中的数组和对象转换JSON字符串
      if (config.params) {
        config.params = Object.entries(config.params).reduce(
          (acc, [key, value]) => {
            if (Array.isArray(value) || typeof value === 'object') {
              acc[key] = JSON.stringify(value);
            } else {
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<string, any>,
        );
      }
      const response = await this.service.request<T>(config);
      return response.data;
    } catch (error: any) {
      // 错误已在拦截器中统一处理，这里直接reject
      return Promise.reject(error);
    }
  }

  // 发起请求
  public async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.executeRequest(config);
  }

  // 发起 get 请求
  public async get<T = any>({ ...config }: AxiosRequestConfig): Promise<T> {
    return this.executeRequest({ method: 'GET', ...config });
  }

  // 发起 post 请求
  public async post<T = any>({ ...config }: AxiosRequestConfig): Promise<T> {
    return this.executeRequest({ method: 'POST', ...config });
  }

  // 发起 put 请求
  public async put<T = any>({ ...config }: AxiosRequestConfig): Promise<T> {
    return this.executeRequest({ method: 'PUT', ...config });
  }

  // 发起 delete 请求
  public async delete<T = any>({ ...config }: AxiosRequestConfig): Promise<T> {
    return this.executeRequest({ method: 'DELETE', ...config });
  }
}

const httpRequest = new HttpRequest();
export default httpRequest;
