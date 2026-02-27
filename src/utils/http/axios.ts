import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios';
import qs from 'qs';

import { router } from '@/router';
import { useAuthStore } from '@/store';
import { getLStorage } from '@/utils/storage';
import { getToken } from '../token/index';
import { CodeConfig as HttpCodeConfig } from './codeConfig.ts';
import { ResponseModel } from './types/index.ts';

const lStorage = getLStorage();

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

/**
 * 移除重复请求
 * @param config
 */
const removePending = (config: AxiosRequestConfig) => {
  const key = getPendingUrl(config);
  if (pendingMap.has(key)) {
    const controller = pendingMap.get(key);
    controller?.abort();
    pendingMap.delete(key);
  }
};

/**
 * 解析错误信息
 * @param error 错误对象或响应数据
 */
const resolveErrorMessage = (error: Record<string, any>): string => {
  const lang: string = lStorage.getItem('lang') || 'zhCN';
  // 优先取后端返回的 errMsg
  if (error?.errMsg) {
    if (typeof error.errMsg === 'string') return error.errMsg;
    // 如果是对象，根据语言取值
    if (typeof error.errMsg === 'object') {
      return error.errMsg[lang] || error.message || '未知错误';
    }
  }
  // 其次取 message
  return error?.message || '接口请求失败，请稍后再试';
};

/**
 * 处理未授权（登录过期）
 */
const handleUnauthorized = () => {
  const authStore = useAuthStore();
  lStorage.removeItem(import.meta.env.VITE_APP_TOKEN_KEY);
  lStorage.removeItem('auth');
  authStore.resetToken();
  router.push({ path: '/login', replace: true });
  window.$message?.error('登录信息已过期，请重新登录！');
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
        // 自动取消重复请求
        removePending(config);
        // 添加到pendingMap
        const controller = new AbortController();
        config.signal = controller.signal;
        const key = getPendingUrl(config);
        pendingMap.set(key, controller);

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
      (response: AxiosResponse<ResponseModel>): Promise<ResponseModel> | AxiosResponse['data'] => {
        // 请求完成，从pendingMap移除
        const key = getPendingUrl(response.config);
        pendingMap.delete(key);

        const { data } = response;
        const { code } = data;

        // 业务成功
        if (code === HttpCodeConfig.success) {
          return data;
        }

        // 业务失败处理
        const errMsg = resolveErrorMessage(data);

        // 特殊状态码处理
        switch (code) {
          case HttpCodeConfig.noPermission: // 401
            handleUnauthorized();
            break;
          case HttpCodeConfig.notFound: // 404
            window.$message?.error('请求资源不存在');
            break;
          default:
            window.$message?.error(errMsg);
            break;
        }

        // 返回 Promise.reject 以便调用方捕获
        return Promise.reject(new Error(errMsg));
      },
      (error: any) => {
        // 请求失败或取消，从pendingMap移除
        // 类型断言为 AxiosError 以访问 config 和 response
        const axiosError = error as AxiosError<ResponseModel>;

        if (axiosError.config) {
          const key = getPendingUrl(axiosError.config);
          pendingMap.delete(key);
        }

        // 如果是取消请求，直接抛出
        if (axios.isCancel(error)) {
          return Promise.reject(error);
        }

        // 处理 HTTP 状态码错误
        let errMsg = '网络请求错误';
        if (axiosError.response) {
          const { status } = axiosError.response;
          const { data } = axiosError.response;

          // 尝试从响应体获取错误信息
          if (data && (data.errMsg || data.message)) {
            errMsg = resolveErrorMessage(data);
          } else {
            // 默认状态码消息
            switch (status) {
              case 401:
                handleUnauthorized();
                return Promise.reject(new Error('登录已过期'));
              case 403:
                errMsg = '拒绝访问';
                break;
              case 404:
                errMsg = '请求资源不存在';
                break;
              case 500:
                errMsg = '服务器错误';
                break;
              default:
                errMsg = `请求失败 (${status})`;
            }
          }
        } else {
          errMsg = error.message;
        }

        window.$message?.error(errMsg);
        return Promise.reject(new Error(errMsg));
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
    // 将请求参数中的数组和对象转换JSON字符串
    if (config.params) {
      // 使用 reduce 生成新的 params 对象，避免直接修改原始 config.params
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

    try {
      const response = await this.service.request<T>(config);
      return response.data as unknown as T;
    } catch (error: any) {
      // 这里的 error 已经是拦截器处理过的 Error 对象或取消对象
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
