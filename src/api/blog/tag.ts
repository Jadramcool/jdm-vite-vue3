import request from '@/utils/http/axios';

enum API {
  // 标签基础操作 - 使用RESTful设计
  tags = '/blog/tag', // GET: 获取标签列表, POST: 创建标签
  allTags = '/blog/tag/all',
  popularTags = '/blog/tag/popular', // GET: 获取热门标签
  tagStats = '/blog/tag/stats', // GET: 获取标签统计
  tagById = '/blog/tag/:id', // GET: 获取标签, PUT: 更新标签, DELETE: 删除标签
  tagBySlug = '/blog/tag/slug/:slug', // GET: 根据slug获取标签
  updateTagPostCount = '/blog/tag/:id/update-post-count', // PUT: 更新标签文章数量
  updateAllTagPostCount = '/blog/tag/update-all-post-count', // PUT: 更新所有标签文章数量
}

/**
 * @description: 创建博客标签
 */
export const createTag = (data: Blog.CreateTagRequest) => {
  return request.post<Blog.Tag>({
    url: API.tags,
    data,
  });
};

/**
 * @description: 获取所有博客标签
 */
export const getAllTags = () => {
  return request.get<Blog.Tag[]>({
    url: API.allTags,
  });
};

/**
 * @description: 获取博客标签列表
 */
export const getTagList = (params?: any) => {
  return request.get<Blog.TagListResponse>({
    url: API.tags,
    params,
  });
};

/**
 * @description: 获取热门标签
 */
export const getPopularTags = (params?: any) => {
  return request.get<Blog.Tag[]>({
    url: API.popularTags,
    params,
  });
};

/**
 * @description: 获取博客标签统计
 */
export const getTagStats = () => {
  return request.get<Blog.TagStatsResponse>({
    url: API.tagStats,
  });
};

/**
 * @description: 根据ID获取博客标签
 */
export const getTagById = (id: number) => {
  return request.get<Blog.Tag>({
    url: API.tagById.replace(':id', id.toString()),
  });
};

/**
 * @description: 根据slug获取博客标签
 */
export const getTagBySlug = (slug: string) => {
  return request.get<Blog.Tag>({
    url: API.tagBySlug.replace(':slug', slug),
  });
};

/**
 * @description: 更新博客标签
 */
export const updateTag = (id: number, data: Blog.UpdateTagRequest) => {
  return request.put<Blog.Tag>({
    url: API.tagById.replace(':id', id.toString()),
    data,
  });
};

/**
 * @description: 删除博客标签
 */
export const deleteTag = (id: number) => {
  return request.delete<void>({
    url: API.tagById.replace(':id', id.toString()),
  });
};

/**
 * @description: 更新标签文章数量
 */
export const updateTagPostCount = (id: number) => {
  return request.put<Blog.Tag>({
    url: API.updateTagPostCount.replace(':id', id.toString()),
  });
};

/**
 * @description: 更新所有标签文章数量
 */
export const updateAllTagPostCount = () => {
  return request.put<void>({
    url: API.updateAllTagPostCount,
  });
};
