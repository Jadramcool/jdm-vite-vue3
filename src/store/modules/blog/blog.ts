import { BlogApi } from '@/api';
import { defineStore } from 'pinia';

/**
 * 博客配置状态管理
 * 用于管理博客的配置信息
 */
export const useBlogStore = defineStore('blog', {
  state: () => ({
    activePost: {} as Blog.Post,
    allCategory: [] as Blog.Category[],
  }),

  getters: {
    /**
     * @description: 获取所有分类
     */
    getAllCategory: (state) => {
      return state.allCategory;
    },
  },

  actions: {
    // 初始化博客关键数据
    async initBlogStore() {
      //   await this.initAllCategory();
    },
    /**
     * @description: 获取文章分类
     */
    async initAllCategory() {
      const res = await BlogApi.getCategoryList({
        options: {
          showPagination: false,
        },
      });
      this.allCategory = res.data || [];
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
