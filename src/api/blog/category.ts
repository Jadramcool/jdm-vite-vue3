import request from '@/utils/http/axios';

enum API {
  // 分类基础操作 - 使用RESTful设计
  categories = '/blog/category', // GET: 获取分类列表, POST: 创建分类
  categoryTree = '/blog/category/tree', // GET: 获取分类树形结构
  categoryStats = '/blog/category/stats', // GET: 获取分类统计
  categoryById = '/blog/category/:id', // GET: 获取分类, PUT: 更新分类, DELETE: 删除分类
  categoryBySlug = '/blog/category/slug/:slug', // GET: 根据slug获取分类
  updateCategoryPostCount = '/blog/category/:id/update-post-count', // PUT: 更新分类文章数量
  updateAllCategoryPostCount = '/blog/category/update-all-post-count', // PUT: 更新所有分类文章数量
}

/**
 * @description: 创建博客分类
 */
export const createCategory = (data: Blog.CreateCategoryRequest) => {
  return request.post<Blog.Category>({
    url: API.categories,
    data,
  });
};

/**
 * @description: 获取博客分类列表
 */
export const getCategoryList = (params?: any) => {
  return request.get<Blog.CategoryListResponse>({
    url: API.categories,
    params,
  });
};

/**
 * @description: 获取博客分类树形结构
 */
export const getCategoryTree = (params?: any) => {
  return request.get<Blog.Category[]>({
    url: API.categoryTree,
    params,
  });
};

/**
 * @description: 获取博客分类统计
 */
export const getCategoryStats = () => {
  return request.get<Blog.CategoryStatsResponse>({
    url: API.categoryStats,
  });
};

/**
 * @description: 根据ID获取博客分类
 */
export const getCategoryById = (id: number) => {
  return request.get<Blog.Category>({
    url: API.categoryById.replace(':id', id.toString()),
  });
};

/**
 * @description: 根据slug获取博客分类
 */
export const getCategoryBySlug = (slug: string) => {
  return request.get<Blog.Category>({
    url: API.categoryBySlug.replace(':slug', slug),
  });
};

/**
 * @description: 更新博客分类
 */
export const updateCategory = (id: number, data: Blog.UpdateCategoryRequest) => {
  return request.put<Blog.Category>({
    url: API.categoryById.replace(':id', id.toString()),
    data,
  });
};

/**
 * @description: 删除博客分类
 */
export const deleteCategory = (id: number) => {
  return request.delete<void>({
    url: API.categoryById.replace(':id', id.toString()),
  });
};

/**
 * @description: 更新分类文章数量
 */
export const updateCategoryPostCount = (id: number) => {
  return request.put<Blog.Category>({
    url: API.updateCategoryPostCount.replace(':id', id.toString()),
  });
};

/**
 * @description: 更新所有分类文章数量
 */
export const updateAllCategoryPostCount = () => {
  return request.put<void>({
    url: API.updateAllCategoryPostCount,
  });
};
