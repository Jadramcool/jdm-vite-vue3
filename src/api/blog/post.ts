import request from '@/utils/http/axios';

enum API {
  // 文章基础操作 - 使用RESTful设计
  posts = '/blog/post', // GET: 获取文章列表, POST: 创建文章
  postStats = '/blog/post/stats', // GET: 获取文章统计
  postById = '/blog/post/:id', // GET: 获取文章, PUT: 更新文章, DELETE: 删除文章
  postBySlug = '/blog/post/slug/:slug', // GET: 根据slug获取文章
  togglePostTop = '/blog/post/:id/toggle-top', // PUT: 切换置顶状态
}

/**
 * @description: 创建博客文章
 */
export const createPost = (data: Blog.CreatePostRequest) => {
  return request.post<Blog.Post>({
    url: API.posts,
    data,
  });
};

/**
 * @description: 获取博客文章列表
 */
export const getPostList = (params?: any) => {
  return request.get<Blog.PostListResponse>({
    url: API.posts,
    params,
  });
};

/**
 * @description: 获取博客文章统计
 */
export const getPostStats = () => {
  return request.get<{
    total: number;
    published: number;
    draft: number;
    archived: number;
  }>({
    url: API.postStats,
  });
};

/**
 * @description: 根据ID获取博客文章
 */
export const getPostById = (id: number, incrementView?: boolean) => {
  return request.get<Blog.Post>({
    url: API.postById.replace(':id', id.toString()),
    params: { incrementView },
  });
};

/**
 * @description: 根据slug获取博客文章
 */
export const getPostBySlug = (slug: string, incrementView?: boolean) => {
  return request.get<Blog.Post>({
    url: API.postBySlug.replace(':slug', slug),
    params: { incrementView },
  });
};

/**
 * @description: 更新博客文章
 */
export const updatePost = (data: Blog.UpdatePostRequest) => {
  return request.put<Blog.Post>({
    url: API.postById.replace(':id', data.id.toString()),
    data,
  });
};

/**
 * @description: 删除博客文章
 */
export const deletePost = (id: number) => {
  return request.delete<void>({
    url: API.postById.replace(':id', id.toString()),
  });
};

/**
 * @description: 切换文章置顶状态
 */
export const togglePostTop = (id: number) => {
  return request.put<Blog.Post>({
    url: API.togglePostTop.replace(':id', id.toString()),
  });
};

/**
 *  @description: 切换文章发布状态
 */
export const togglePostPublish = (id: number) => {
  return request.put<Blog.Post>({
    url: `${API.postById.replace(':id', id.toString())}/toggle-publish`,
  });
};
