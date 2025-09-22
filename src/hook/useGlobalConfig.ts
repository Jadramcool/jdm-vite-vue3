import { useConfigStore } from '@/store';
import { computed } from 'vue';

/**
 * 全局配置组合式函数
 * 提供便捷的全局配置访问和管理功能
 */
export function useGlobalConfig() {
  const configStore = useConfigStore();

  /**
   * 获取指定key的配置值
   * @param key 配置键
   * @param defaultValue 默认值
   * @returns 配置值
   */
  const getConfig = (key: string, defaultValue?: any) => {
    return configStore.getConfigValue(key, defaultValue);
  };

  /**
   * 获取所有配置（响应式）
   */
  const allConfig = computed(() => configStore.getAllConfig);

  /**
   * 配置加载状态（响应式）
   */
  const loading = computed(() => configStore.loading);

  /**
   * 配置是否已初始化（响应式）
   */
  const initialized = computed(() => configStore.initialized);

  /**
   * 更新单个配置项
   * @param key 配置键
   * @param value 配置值
   */
  const updateConfig = (key: string, value: any) => {
    configStore.updateConfigItem(key, value);
  };

  /**
   * 重新加载配置
   */
  const reloadConfig = async () => {
    return configStore.reloadConfig();
  };

  /**
   * 初始化配置
   */
  const initConfig = async () => {
    return configStore.initConfig();
  };

  /**
   * 清空配置
   */
  const clearConfig = () => {
    configStore.clearConfig();
  };

  return {
    // 状态
    allConfig,
    loading,
    initialized,

    // 方法
    getConfig,
    updateConfig,
    reloadConfig,
    initConfig,
    clearConfig,
  };
}

/**
 * 获取配置值的便捷函数
 * @param key 配置键
 * @param defaultValue 默认值
 * @returns 配置值
 */
export function getGlobalConfig(key: string, defaultValue?: any) {
  const configStore = useConfigStore();
  return configStore.getConfigValue(key, defaultValue);
}
