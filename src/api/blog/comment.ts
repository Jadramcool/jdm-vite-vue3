import request from '@/utils/http/axios';

enum API {
  // 评论基础操作 - 使用RESTful设计
  comments = '/blog/comment', // GET: 获取评论列表, POST: 创建评论
  latestComments = '/blog/comment/latest', // GET: 获取最新评论
  commentStats = '/blog/comment/stats', // GET: 获取评论统计
  commentById = '/blog/comment/:id', // GET: 获取评论, PUT: 更新评论, DELETE: 删除评论
  approveComment = '/blog/comment/:id/approve', // PUT: 审核通过评论
  rejectComment = '/blog/comment/:id/reject', // PUT: 拒绝评论
  likeComment = '/blog/comment/:id/like', // PUT: 点赞评论
}

/**
 * @description: 创建博客评论
 */
export const createComment = (data: Blog.CreateCommentRequest) => {
  return request.post<Blog.Comment>({
    url: API.comments,
    data,
  });
};

/**
 * @description: 获取博客评论列表
 */
export const getCommentList = (params?: any) => {
  return request.get<Blog.CommentListResponse>({
    url: API.comments,
    params,
  });
};

/**
 * @description: 获取最新评论
 */
export const getLatestComments = (params?: any) => {
  return request.get<Blog.Comment[]>({
    url: API.latestComments,
    params,
  });
};

/**
 * @description: 获取博客评论统计
 */
export const getCommentStats = () => {
  return request.get<Blog.CommentStatsResponse>({
    url: API.commentStats,
  });
};

/**
 * @description: 根据ID获取博客评论
 */
export const getCommentById = (id: number) => {
  return request.get<Blog.Comment>({
    url: API.commentById.replace(':id', id.toString()),
  });
};

/**
 * @description: 更新博客评论
 */
export const updateComment = (id: number, data: Blog.UpdateCommentRequest) => {
  return request.put<Blog.Comment>({
    url: API.commentById.replace(':id', id.toString()),
    data,
  });
};

/**
 * @description: 删除博客评论
 */
export const deleteComment = (id: number) => {
  return request.delete<void>({
    url: API.commentById.replace(':id', id.toString()),
  });
};

/**
 * @description: 审核通过评论
 */
export const approveComment = (id: number) => {
  return request.put<Blog.Comment>({
    url: API.approveComment.replace(':id', id.toString()),
  });
};

/**
 * @description: 拒绝评论
 */
export const rejectComment = (id: number) => {
  return request.put<Blog.Comment>({
    url: API.rejectComment.replace(':id', id.toString()),
  });
};

/**
 * @description: 点赞评论
 */
export const likeComment = (id: number) => {
  return request.put<Blog.Comment>({
    url: API.likeComment.replace(':id', id.toString()),
  });
};
