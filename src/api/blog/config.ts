import request from '@/utils/http/axios';

enum API {
  // 配置基础操作 - 使用RESTful设计
  configs = '/blog/config', // GET: 获取配置列表, POST: 创建配置
  configByCategory = '/blog/config/category/:category', // GET: 根据分类获取配置
  configByKey = '/blog/config/key/:key', // GET: 根据键获取配置
  configCategories = '/blog/config/categories', // GET: 获取配置分类列表
  configStats = '/blog/config/stats', // GET: 获取配置统计
  configById = '/blog/config/:id', // GET: 获取配置, PUT: 更新配置, DELETE: 删除配置
  batchUpdateConfig = '/blog/config/batch', // PUT: 批量更新配置
}

/**
 * @description: 创建博客配置
 */
export const createConfig = (data: Blog.CreateConfigRequest) => {
  return request.post<Blog.Config>({
    url: API.configs,
    data,
  });
};

/**
 * @description: 获取博客配置列表
 */
export const getConfigList = (params?: any) => {
  return request.get<Blog.ConfigListResponse>({
    url: API.configs,
    params,
  });
};

/**
 * @description: 根据分类获取配置
 */
export const getConfigByCategory = (category: string) => {
  return request.get<Blog.Config[]>({
    url: API.configByCategory.replace(':category', category),
  });
};

/**
 * @description: 根据键获取配置
 */
export const getConfigByKey = (key: string) => {
  return request.get<Blog.Config>({
    url: API.configByKey.replace(':key', key),
  });
};

/**
 * @description: 获取配置分类列表
 */
export const getConfigCategories = () => {
  return request.get<string[]>({
    url: API.configCategories,
  });
};

/**
 * @description: 获取博客配置统计
 */
export const getConfigStats = () => {
  return request.get<Blog.ConfigStatsResponse>({
    url: API.configStats,
  });
};

/**
 * @description: 根据ID获取博客配置
 */
export const getConfigById = (id: number) => {
  return request.get<Blog.Config>({
    url: API.configById.replace(':id', id.toString()),
  });
};

/**
 * @description: 更新博客配置
 */
export const updateConfig = (id: number, data: Blog.UpdateConfigRequest) => {
  return request.put<Blog.Config>({
    url: API.configById.replace(':id', id.toString()),
    data,
  });
};

/**
 * @description: 批量更新配置
 */
export const batchUpdateConfig = (data: Blog.BatchUpdateConfigRequest) => {
  return request.put<Blog.Config[]>({
    url: API.batchUpdateConfig,
    data,
  });
};

/**
 * @description: 删除博客配置
 */
export const deleteConfig = (id: number) => {
  return request.delete<void>({
    url: API.configById.replace(':id', id.toString()),
  });
};
