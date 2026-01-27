/**
 * 统一错误处理类
 * 提供全局错误处理、错误上报、用户友好的错误提示
 */

import { useAuthStore } from '@/store';

// eslint-disable-next-line class-methods-use-this
class ErrorHandler {
  private static instance: ErrorHandler;

  private errorQueue: AppError[] = [];

  private maxQueueSize = 50;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * 处理错误
   * @param error 错误对象
   * @param context 错误上下文
   * @param showMessage 是否显示错误提示
   */
  handle(error: any, context?: string, showMessage: boolean = true): void {
    if (!error) return;

    if (import.meta.env.DEV) {
      console.error(`[${context || 'Unknown'}] Error:`, error);
    }

    this.addToQueue(error, context);

    if (error.response) {
      this.handleHttpError(error, showMessage);
    } else if (error.request) {
      this.handleNetworkError(error, showMessage);
    } else if (error instanceof Error) {
      this.handleApplicationError(error, showMessage);
    } else {
      this.handleUnknownError(error, showMessage);
    }

    this.reportError(error, context);
  }

  /**
   * 处理HTTP错误
   */
  private handleHttpError(error: any, showMessage: boolean = true): void {
    const { status, data } = error.response;

    switch (status) {
      case 400:
        this.showError('请求参数错误', data?.message || '请检查输入内容', showMessage);
        break;
      case 401:
        this.handleUnauthorized();
        break;
      case 403:
        this.showError('权限不足', '您没有权限访问该资源', showMessage);
        break;
      case 404:
        this.showError('资源不存在', '请求的资源不存在或已被删除', showMessage);
        break;
      case 422:
        this.showError('数据验证失败', data?.message || '提交的数据格式不正确', showMessage);
        break;
      case 429:
        this.showError('请求过于频繁', '请稍后再试', showMessage);
        break;
      case 500:
        this.showError('服务器错误', '服务器内部错误,请稍后重试', showMessage);
        break;
      case 502:
        this.showError('网关错误', '网关错误,请稍后重试', showMessage);
        break;
      case 503:
        this.showError('服务不可用', '服务暂时不可用,请稍后重试', showMessage);
        break;
      default:
        this.showError('请求失败', data?.message || `HTTP错误: ${status}`, showMessage);
    }
  }

  /**
   * 处理网络错误
   */
  private handleNetworkError(_error: any, showMessage: boolean = true): void {
    if (!navigator.onLine) {
      this.showError('网络断开', '请检查您的网络连接', showMessage);
    } else {
      this.showError('网络错误', '网络连接失败,请检查网络设置', showMessage);
    }
  }

  /**
   * 处理应用错误
   */
  private handleApplicationError(error: globalThis.Error, showMessage: boolean = true): void {
    this.showError('应用错误', error.message || '应用发生未知错误', showMessage);
  }

  /**
   * 处理未知错误
   */
  private handleUnknownError(error: any, showMessage: boolean = true): void {
    const errorMessage = typeof error === 'string' ? error : '发生未知错误,请联系管理员';
    this.showError('未知错误', errorMessage, showMessage);
  }

  /**
   * 处理未授权错误
   */
  // eslint-disable-next-line class-methods-use-this
  private handleUnauthorized(): void {
    const authStore = useAuthStore();
    authStore.logout();

    if (window.$message) {
      window.$message.error('登录已过期,请重新登录');
    }

    const router = useRouter();
    if (router) {
      router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } });
    }
  }

  /**
   * 显示错误提示
   */
  // eslint-disable-next-line class-methods-use-this
  private showError(title: string, message: string, showMessage: boolean = true): void {
    if (showMessage && window.$message) {
      window.$message.error(`${title}: ${message}`);
    }
  }

  /**
   * 添加错误到队列
   */
  private addToQueue(error: any, context?: string): void {
    const errorItem: AppError = {
      name: error.name || 'UnknownError',
      message: error.message || 'Unknown error',
      stack: error.stack,
      timestamp: Date.now(),
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.errorQueue.push(errorItem);

    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }
  }

  /**
   * 上报错误到服务器
   */
  // eslint-disable-next-line class-methods-use-this
  private reportError(error: any, context?: string): void {
    if (import.meta.env.PROD) {
      const errorData = {
        name: error.name || 'UnknownError',
        message: error.message || 'Unknown error',
        stack: error.stack,
        context,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      fetch('/api/error-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData),
      }).catch((err) => {
        if (import.meta.env.DEV) {
          console.error('Error report failed:', err);
        }
      });
    }
  }

  /**
   * 获取错误队列
   */
  getErrorQueue(): AppError[] {
    return [...this.errorQueue];
  }

  /**
   * 清空错误队列
   */
  clearErrorQueue(): void {
    this.errorQueue = [];
  }
}

export interface AppError {
  name: string;
  message: string;
  stack?: string;
  timestamp: number;
  context?: string;
  userAgent: string;
  url: string;
}

export const errorHandler = ErrorHandler.getInstance();
export default errorHandler;
