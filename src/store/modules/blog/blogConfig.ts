import { BlogApi } from '@/api';
import { defineStore } from 'pinia';

/**
 * 博客配置状态管理
 * 用于管理博客的配置信息
 */
export const useBlogConfigStore = defineStore('blogConfig', {
  state: () => ({
    /**
     * 博客配置数据
     */
    blogConfig: {} as Record<string, any>,

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
     * 获取所有配置
     * @param state store状态
     * @returns 所有配置数据
     */
    getAllConfig: (state) => {
      return state.blogConfig;
    },

    /**
     * 获取配置项
     * @param key 配置项键
     * @returns 配置项值
     */
    getConfigValue: (state) => (key: string) => {
      return state.blogConfig[key];
    },
  },

  actions: {
    /**
     * 初始化博客配置
     * 从服务器加载配置数据并存储到store中
     */
    async initBlogConfig() {
      if (this.initialized) {
        return this.blogConfig;
      }

      try {
        this.loading = true;
        const response = await BlogApi.getAllConfigs();
        console.log('🚀 ~ initBlogConfig ~ response:', response);

        this.setConfig(response);
        this.initialized = true;
        return response;
      } catch (error) {
        console.error('❌ 博客配置初始化失败:', error);
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
      this.blogConfig = { ...config };
    },

    /**
     * 重新加载配置
     * 强制从服务器重新获取配置数据
     */
    async reloadConfig() {
      this.initialized = false;
      return this.initBlogConfig();
    },

    /**
     * 清空配置
     */
    clearConfig() {
      this.blogConfig = {};
      this.initialized = false;
    },
  },

  /**
   * 持久化配置
   * 将配置数据保存到本地存储
   */
  // persist: {
  //   key: 'blog-config',
  //   storage: localStorage,
  //   paths: ['blogConfig', 'initialized'],
  // },
});
