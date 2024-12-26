import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { router } from '@/router';
import { useAuthStore } from '@/store';
import { lStorage } from '@/utils';
import { isString } from 'lodash';
import { getToken } from '../token/index';
import { CodeConfig as HttpCodeConfig } from './codeConfig.ts';
import { ResponseModel, UploadFileItemModel, UploadRequestConfig } from './types/index.ts';

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
        if (import.meta.env.VITE_APP_TOKEN_KEY && getToken()) {
          config.headers.authorization = `Bearer ${getToken()}`;
        }
        return config;
      },
      (error: AxiosError) => {
        console.error('requestError: ', error);
        return Promise.reject(error);
      },
    );

    // 响应拦截器
    this.service.interceptors.response.use(
      (response: AxiosResponse<ResponseModel>): AxiosResponse['data'] => {
        // console.info('响应拦截器触发', response); // 调试用
        const { data } = response;
        const { code } = data;
        if (code && code !== HttpCodeConfig.success) {
          switch (code) {
            case HttpCodeConfig.notFound:
              // 处理未找到的情况
              break;
            case HttpCodeConfig.noPermission:
              // 处理无权限的情况
              break;
            default:
              break;
          }
          // const errMsg = data.errMsg || data.message || 'Unknown error';
          return Promise.reject(data);
        }
        return data;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );
  }

  // 执行请求
  private async executeRequest<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      // 这个方法会影响原始参数，导致isEqual方法返回false
      // if (config.params) {
      //   Object.entries(config.params).forEach(([key, value]) => {
      //     if (Array.isArray(value) || typeof value === 'object') {
      //       config.params[key] = JSON.stringify(value);
      //     }
      //   });
      // }
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
      if (error && typeof error === 'object') {
        // 处理401错误
        if (error.response && error.response.status === 401) {
          const authStore = useAuthStore();
          console.error('未授权访问', error);
          // 可以在这里添加额外的处理逻辑，例如重定向到登录页面
          lStorage.removeItem(import.meta.env.VITE_APP_TOKEN_KEY);
          lStorage.removeItem('auth');
          authStore.resetToken();
          router.push({ path: '/login', replace: true });
          window.$message.error('登录信息已过期，请重新登录！');
        }
        const lang: string = lStorage.getItem('lang') || 'zhCN';
        const errMsg =
          (error.errMsg as { [key: string]: any })[lang] ||
          (isString(error.errMsg) && error.errMsg) ||
          error.message ||
          '接口请求失败，请稍后再试';
        return Promise.reject(errMsg);
      }
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

  // 上传文件
  public async upload<T = string>(
    fileItem: UploadFileItemModel,
    config?: UploadRequestConfig,
  ): Promise<T | null> {
    if (!import.meta.env.VITE_UPLOAD_URL) return null;

    const fd = new FormData();
    fd.append(fileItem.name, fileItem.value);

    const configCopy: UploadRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    };

    return this.executeRequest({
      url: import.meta.env.VITE_UPLOAD_URL,
      data: fd,
      ...configCopy,
    });
  }
}

const httpRequest = new HttpRequest();
export default httpRequest;
