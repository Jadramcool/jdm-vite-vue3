import request from '@/utils/http/axios';

enum API {
  getAllStats = '/blog/stats',
  getOverviewStats = '/blog/stats/overview',
}

/**
 * @description: 获取所有博客统计数据
 */
export const getAllStats = () => {
  return request.get<Blog.BlogStatsResponse>({
    url: API.getAllStats,
  });
};

/**
 * @description: 获取博客概览统计数据
 */
export const getOverviewStats = () => {
  return request.get<Blog.BlogStatsOverviewResponse>({
    url: API.getOverviewStats,
  });
};
