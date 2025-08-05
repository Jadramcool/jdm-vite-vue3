import { defineStore } from 'pinia';
import { getConfig } from '../helper';

/**
 * 全局配置状态管理
 * 用于管理系统的全局配置信息
 */
export const useConfigStore = defineStore('config', {
  state: () => ({
    /**
     * 全局配置数据
     */
    globalConfig: {} as Record<string, any>,

    /**
     * 配置加载状态
     */
    loading: false,

    /**
     * 配置是否已初始化
     */
    initialized: false,
  }),

  getters: {
    /**
     * 获取指定key的配置值
     * @param state store状态
     * @returns 返回获取配置值的函数
     */
    getConfigValue: (state) => {
      return (key: string, defaultValue?: any) => {
        return state.globalConfig[key] ?? defaultValue;
      };
    },

    /**
     * 获取所有配置
     * @param state store状态
     * @returns 所有配置数据
     */
    getAllConfig: (state) => {
      return state.globalConfig;
    },
  },

  actions: {
    /**
     * 初始化全局配置
     * 从服务器加载配置数据并存储到store中
     */
    async initConfig() {
      if (this.initialized) {
        return this.globalConfig;
      }

      try {
        this.loading = true;
        const config = await getConfig();
        this.setConfig(config);
        this.initialized = true;
        return config;
      } catch (error) {
        console.error('❌ 全局配置初始化失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 设置配置数据
     * @param config 配置数据
     */
    setConfig(config: Record<string, any>) {
      this.globalConfig = { ...config };
    },

    /**
     * 更新单个配置项
     * @param key 配置键
     * @param value 配置值
     */
    updateConfigItem(key: string, value: any) {
      this.globalConfig[key] = value;
    },

    /**
     * 重新加载配置
     * 强制从服务器重新获取配置数据
     */
    async reloadConfig() {
      this.initialized = false;
      return this.initConfig();
    },

    /**
     * 清空配置
     */
    clearConfig() {
      this.globalConfig = {};
      this.initialized = false;
    },
  },

  /**
   * 持久化配置
   * 将配置数据保存到本地存储
   */
  // persist: {
  //   key: 'global-config',
  //   storage: localStorage,
  //   paths: ['globalConfig', 'initialized'],
  // },
});
