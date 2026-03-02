/**
 * 性能监控工具类
 * 用于监控应用启动耗时、Web Vitals 等关键指标
 */

// 扩展 PerformanceEntry 类型以支持 Web Vitals
interface PerformanceEntryWithProcessing extends PerformanceEntry {
  processingStart?: number;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;

  private isInitialized = false;

  private config = {
    verbose: true,
  };

  // 单例模式
  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * 初始化性能监控
   */
  public init() {
    // 仅在浏览器环境下执行
    if (typeof window === 'undefined') return;

    // 防止重复初始化
    if (this.isInitialized) return;
    this.isInitialized = true;

    // 监听页面加载完成事件
    if (document.readyState === 'complete') {
      this.collectAndLogMetrics();
    } else {
      window.addEventListener('load', () => {
        // 延迟一点执行，确保所有资源加载完毕
        setTimeout(() => {
          this.collectAndLogMetrics();
        }, 0);
      });
    }

    // 监控 LCP (Largest Contentful Paint)
    this.observeLCP();
    // 监控 FID (First Input Delay)
    this.observeFID();
    // 监控 CLS (Cumulative Layout Shift)
    this.observeCLS();
  }

  /**
   * 收集并打印基础性能指标
   */
  private collectAndLogMetrics() {
    if (!this.config.verbose) return;

    const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    if (!timing) {
      console.warn('当前浏览器不支持 PerformanceNavigationTiming API');
      return;
    }

    console.group('%c🚀 应用启动性能监控', 'color: #409EFF; font-size: 14px; font-weight: bold;');

    // 1. 关键时间点
    const dnsTime = timing.domainLookupEnd - timing.domainLookupStart;
    const tcpTime = timing.connectEnd - timing.connectStart;
    const ttfbTime = timing.responseStart - timing.requestStart; // Time to First Byte
    const responseTime = timing.responseEnd - timing.responseStart;
    const domParseTime = timing.domInteractive - timing.responseEnd;
    const resourceLoadTime = timing.loadEventStart - timing.domContentLoadedEventEnd;
    const totalTime = timing.loadEventEnd - timing.fetchStart;

    console.log(`📡 DNS解析耗时: %c${dnsTime.toFixed(2)}ms`, 'color: #67C23A');
    console.log(`🔗 TCP连接耗时: %c${tcpTime.toFixed(2)}ms`, 'color: #67C23A');
    console.log(`⏱️ TTFB(首字节): %c${ttfbTime.toFixed(2)}ms`, 'color: #E6A23C');
    console.log(`📥 下载响应耗时: %c${responseTime.toFixed(2)}ms`, 'color: #67C23A');
    console.log(`🔨 DOM解析耗时: %c${domParseTime.toFixed(2)}ms`, 'color: #409EFF');
    console.log(`📦 资源加载耗时: %c${resourceLoadTime.toFixed(2)}ms`, 'color: #409EFF');
    console.log(
      `⚡ 首屏完全加载: %c${totalTime.toFixed(2)}ms`,
      'color: #F56C6C; font-weight: bold',
    );

    console.groupEnd();

    // 也可以在这里添加上报逻辑，发送到后端监控系统
    // this.reportMetrics({ dnsTime, tcpTime, ... });
  }

  /**
   * 监控 Largest Contentful Paint (最大内容绘制)
   * 衡量加载性能，应在 2.5s 内
   */
  private observeLCP() {
    if (!this.config.verbose) return;

    // 检查浏览器是否支持
    if (!PerformanceObserver.supportedEntryTypes?.includes('largest-contentful-paint')) {
      return;
    }

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      const value = lastEntry.startTime;
      const { label, color } = this.getRating('LCP', value);
      console.log(`%c🎨 LCP (最大内容绘制): ${value.toFixed(2)}ms [${label}]`, `color: ${color}`);
    });
    observer.observe({ type: 'largest-contentful-paint', buffered: true } as any);
  }

  /**
   * 监控 First Input Delay (首次输入延迟)
   * 衡量交互性，应在 100ms 内
   */
  private observeFID() {
    if (!this.config.verbose) return;

    // 检查浏览器是否支持
    if (!PerformanceObserver.supportedEntryTypes?.includes('first-input')) {
      return;
    }

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries() as PerformanceEntryWithProcessing[];
      entries.forEach((entry) => {
        if (entry.processingStart) {
          const delay = entry.processingStart - entry.startTime;
          const { label, color } = this.getRating('FID', delay);
          console.log(
            `%c🖱️ FID (首次输入延迟): ${delay.toFixed(2)}ms [${label}]`,
            `color: ${color}`,
          );
        }
      });
    });
    observer.observe({ type: 'first-input', buffered: true } as any);
  }

  /**
   * 监控 Cumulative Layout Shift (累积布局偏移)
   * 衡量视觉稳定性，应小于 0.1
   */
  private observeCLS() {
    if (!this.config.verbose) return;

    // 检查浏览器是否支持
    if (!PerformanceObserver.supportedEntryTypes?.includes('layout-shift')) {
      return;
    }

    const observer = new PerformanceObserver((entryList) => {
      let clsValue = 0;
      const entries = entryList.getEntries() as LayoutShift[];
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      const { label, color } = this.getRating('CLS', clsValue);
      console.log(`%c📐 CLS (累积布局偏移): ${clsValue.toFixed(4)} [${label}]`, `color: ${color}`);
    });
    observer.observe({ type: 'layout-shift', buffered: true } as any);
  }

  /**
   * 获取性能评分和颜色
   */
  private getRating(metric: 'LCP' | 'FID' | 'CLS', value: number) {
    if (!this.config.verbose) return { label: '', color: '' };
    let color = '#67C23A'; // Green (Good)
    let label = 'Good';

    if (metric === 'LCP') {
      if (value > 4000) {
        color = '#F56C6C'; // Red (Poor)
        label = 'Poor';
      } else if (value > 2500) {
        color = '#E6A23C'; // Orange (Needs Improvement)
        label = 'Needs Improvement';
      }
    } else if (metric === 'FID') {
      if (value > 300) {
        color = '#F56C6C';
        label = 'Poor';
      } else if (value > 100) {
        color = '#E6A23C';
        label = 'Needs Improvement';
      }
    } else if (metric === 'CLS') {
      if (value > 0.25) {
        color = '#F56C6C';
        label = 'Poor';
      } else if (value > 0.1) {
        color = '#E6A23C';
        label = 'Needs Improvement';
      }
    }

    return { label, color };
  }

  /**
   * 手动开始测量
   * @param name 测量名称
   */
  public startMeasure(name: string) {
    if (!this.config.verbose) return;
    performance.mark(`${name}-start`);
  }

  /**
   * 手动结束测量并打印
   * @param name 测量名称
   */
  public endMeasure(name: string) {
    if (!this.config.verbose) return;
    const startMark = `${name}-start`;
    const endMark = `${name}-end`;
    performance.mark(endMark);

    try {
      performance.measure(name, startMark, endMark);
      const entries = performance.getEntriesByName(name);
      const lastEntry = entries[entries.length - 1];

      if (this.config.verbose) {
        console.log(
          `%c⏱️ 自定义测量 [${name}]: ${lastEntry.duration.toFixed(2)}ms`,
          'color: #409EFF',
        );
      }

      // 清理
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(name);
    } catch (e) {
      console.warn(`测量 [${name}] 失败:`, e);
    }
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
