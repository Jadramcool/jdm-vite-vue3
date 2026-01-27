/**
 * 统一日志工具
 * 提供不同级别的日志输出,生产环境自动过滤
 */
class Logger {
  private static isDev = import.meta.env.DEV;

  /**
   * 普通日志
   */
  static log(...args: any[]): void {
    if (this.isDev) {
      console.log('[LOG]', ...args);
    }
  }

  /**
   * 信息日志
   */
  static info(...args: any[]): void {
    if (this.isDev) {
      console.info('[INFO]', ...args);
    }
  }

  /**
   * 警告日志
   */
  static warn(...args: any[]): void {
    console.warn('[WARN]', ...args);
  }

  /**
   * 错误日志
   */
  static error(...args: any[]): void {
    console.error('[ERROR]', ...args);
  }

  /**
   * 调试日志
   */
  static debug(...args: any[]): void {
    if (this.isDev) {
      console.debug('[DEBUG]', ...args);
    }
  }

  /**
   * 成功日志
   */
  static success(...args: any[]): void {
    if (this.isDev) {
      console.log('%c[SUCCESS]', 'color: #52c41a; font-weight: bold;', ...args);
    }
  }

  /**
   * 分组日志开始
   */
  static group(label: string): void {
    if (this.isDev) {
      console.group(`[GROUP] ${label}`);
    }
  }

  /**
   * 分组日志结束
   */
  static groupEnd(): void {
    if (this.isDev) {
      console.groupEnd();
    }
  }

  /**
   * 表格日志
   */
  static table(data: any): void {
    if (this.isDev) {
      console.table(data);
    }
  }

  /**
   * 时间日志开始
   */
  static time(label: string): void {
    if (this.isDev) {
      console.time(`[TIME] ${label}`);
    }
  }

  /**
   * 时间日志结束
   */
  static timeEnd(label: string): void {
    if (this.isDev) {
      console.timeEnd(`[TIME] ${label}`);
    }
  }

  /**
   * 追踪日志
   */
  static trace(...args: any[]): void {
    if (this.isDev) {
      console.trace('[TRACE]', ...args);
    }
  }

  /**
   * 断言日志
   */
  static assert(condition: any, ...args: any[]): void {
    if (this.isDev) {
      console.assert(condition, '[ASSERT]', ...args);
    }
  }

  /**
   * 计数日志
   */
  static count(label: string): void {
    if (this.isDev) {
      console.count(`[COUNT] ${label}`);
    }
  }

  /**
   * 清空计数
   */
  static countReset(label: string): void {
    if (this.isDev) {
      console.countReset(`[COUNT] ${label}`);
    }
  }
}

export default Logger;
