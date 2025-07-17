/**
 * 博客系统 TypeScript 类型定义
 * 基于 Prisma Schema 生成
 */

declare namespace Blog {
  // ==================== 枚举类型 ====================

  /** 博客文章状态枚举 */
  type PostStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

  /** 评论状态枚举 */
  type CommentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

  // ==================== 基础类型 ====================

  /** 博客分类 */
  interface Category {
    id: number;
    name: string; // 分类名称
    slug: string; // URL友好的标识符
    description?: string; // 分类描述
    icon?: string; // 分类图标
    color?: string; // 分类颜色
    parentId?: number; // 父分类ID
    sortOrder: number; // 排序
    postCount: number; // 文章数量（冗余字段）
    isDeleted: boolean;
    createdTime: Date;
    updatedTime: Date;
    deletedTime?: Date;

    // 关系字段
    parent?: Category;
    children?: Category[];
    posts?: Post[];
  }

  /** 博客标签 */
  interface Tag {
    id: number;
    name: string; // 标签名称
    slug: string; // URL友好的标识符
    description?: string; // 标签描述
    color?: string; // 标签颜色
    icon?: string; // 标签图标
    useCount: number; // 使用次数（冗余字段）
    isDeleted: boolean;
    createdTime: Date;
    updatedTime: Date;
    deletedTime?: Date;

    // 关系字段
    postTags?: PostTag[];
  }

  /** 博客文章 */
  interface Post {
    id: number;
    title: string; // 文章标题
    slug: string; // URL友好的标识符
    summary?: string; // 文章摘要
    content: string; // Markdown内容
    coverImage?: string; // 封面图片
    status: PostStatus; // 文章状态
    isTop: boolean; // 是否置顶
    allowComment: boolean; // 是否允许评论
    viewCount: number; // 浏览次数
    likeCount: number; // 点赞次数
    commentCount: number; // 评论次数
    authorId: number; // 作者ID
    categoryId?: number; // 分类ID
    publishedAt?: Date; // 发布时间
    isDeleted: boolean;
    createdTime: Date;
    updatedTime: Date;
    deletedTime?: Date;
    headImage?: string; // 文章头图

    // 关系字段
    author?: any; // User 类型（避免循环依赖）
    category?: Category;
    tags?: Tag[];
    comments?: Comment[];
    likes?: PostLike[];
  }

  /** 博客文章标签关联 */
  interface PostTag {
    id: number;
    postId: number;
    tagId: number;

    // 关系字段
    post?: Post;
    tag?: Tag;
  }

  /** 博客评论 */
  interface Comment {
    id: number;
    content: string; // 评论内容
    authorName?: string; // 游客姓名
    authorEmail?: string; // 游客邮箱
    authorUrl?: string; // 游客网站
    authorIp?: string; // 评论者IP
    userAgent?: string; // 用户代理
    status: CommentStatus; // 评论状态
    likeCount: number; // 点赞次数
    postId: number; // 文章ID
    userId?: number; // 用户ID（注册用户）
    parentId?: number; // 父评论ID
    isDeleted: boolean;
    createdTime: Date;
    updatedTime: Date;
    deletedTime?: Date;

    // 关系字段
    post?: Post;
    user?: any; // User 类型（避免循环依赖）
    parent?: Comment;
    children?: Comment[];
    likes?: CommentLike[];
  }

  /** 博客文章点赞 */
  interface PostLike {
    id: number;
    postId: number;
    userId?: number; // 用户ID（注册用户）
    guestId?: string; // 游客标识（如IP+UserAgent的hash）
    ipAddress?: string; // IP地址
    createdTime: Date;

    // 关系字段
    post?: Post;
    user?: any; // User 类型（避免循环依赖）
  }

  /** 博客评论点赞 */
  interface CommentLike {
    id: number;
    commentId: number;
    userId?: number; // 用户ID（注册用户）
    guestId?: string; // 游客标识
    ipAddress?: string; // IP地址
    createdTime: Date;

    // 关系字段
    comment?: Comment;
    user?: any; // User 类型（避免循环依赖）
  }

  /** 博客配置 */
  interface Config {
    id: number;
    key: string; // 配置键
    value?: string; // 配置值（JSON格式）
    description?: string; // 配置描述
    category?: string; // 配置分类
    createdTime: Date;
    updatedTime: Date;
  }

  /** 友情链接 */
  interface FriendLink {
    id: number;
    name: string; // 链接名称
    url: string; // 链接地址
    description?: string; // 链接描述
    avatar?: string; // 链接头像
    sortOrder: number; // 排序
    isVisible: boolean; // 是否显示
    isDeleted: boolean;
    createdTime: Date;
    updatedTime: Date;
    deletedTime?: Date;
  }

  // ==================== 请求/响应类型 ====================

  /** 创建分类请求 */
  interface CreateCategoryRequest {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    color?: string;
    parentId?: number;
    sortOrder?: number;
  }

  /** 更新分类请求 */
  interface UpdateCategoryRequest {
    name?: string;
    slug?: string;
    description?: string;
    icon?: string;
    color?: string;
    parentId?: number;
    sortOrder?: number;
  }

  /** 创建标签请求 */
  interface CreateTagRequest {
    name: string;
    slug: string;
    description?: string;
    color?: string;
  }

  /** 更新标签请求 */
  interface UpdateTagRequest {
    name?: string;
    slug?: string;
    description?: string;
    color?: string;
  }

  /** 创建文章请求 */
  interface CreatePostRequest {
    title: string;
    slug?: string;
    summary?: string;
    content: string;
    coverImage?: string;
    status?: PostStatus;
    isTop?: boolean;
    allowComment?: boolean;
    categoryId?: number;
    tagIds?: number[];
    publishedAt?: Date;
    addTags?: string[];
  }

  /** 更新文章请求 */
  interface UpdatePostRequest {
    id: number;
    title?: string;
    slug?: string;
    summary?: string;
    content?: string;
    coverImage?: string;
    status?: PostStatus;
    isTop?: boolean;
    allowComment?: boolean;
    categoryId?: number;
    tagIds?: number[];
    publishedAt?: Date;
    addTags?: string[];
  }

  /** 创建评论请求 */
  interface CreateCommentRequest {
    content: string;
    postId: number;
    parentId?: number;
    authorName?: string;
    authorEmail?: string;
    authorUrl?: string;
  }

  /** 更新评论请求 */
  interface UpdateCommentRequest {
    content?: string;
    status?: CommentStatus;
  }

  /** 创建配置请求 */
  interface CreateConfigRequest {
    key: string;
    value?: string;
    description?: string;
    category?: string;
  }

  /** 更新配置请求 */
  interface UpdateConfigRequest {
    value?: string;
    description?: string;
    category?: string;
  }

  /** 批量更新配置请求 */
  interface BatchUpdateConfigRequest {
    configs: Array<{
      key: string;
      value?: string;
    }>;
  }

  /** 创建友情链接请求 */
  interface CreateFriendLinkRequest {
    name: string;
    url: string;
    description?: string;
    avatar?: string;
    sortOrder?: number;
    isVisible?: boolean;
  }

  /** 更新友情链接请求 */
  interface UpdateFriendLinkRequest {
    name?: string;
    url?: string;
    description?: string;
    avatar?: string;
    sortOrder?: number;
    isVisible?: boolean;
  }

  // ==================== 统计类型 ====================

  /** 分类统计响应 */
  interface CategoryStatsResponse {
    totalCategories: number;
    totalPosts: number;
    categoriesWithPosts: number;
  }

  /** 标签统计响应 */
  interface TagStatsResponse {
    totalTags: number;
    totalUsage: number;
    popularTags: Array<{
      id: number;
      name: string;
      useCount: number;
    }>;
  }

  /** 评论统计响应 */
  interface CommentStatsResponse {
    totalComments: number;
    pendingComments: number;
    approvedComments: number;
    rejectedComments: number;
  }

  /** 配置统计响应 */
  interface ConfigStatsResponse {
    totalConfigs: number;
    categories: string[];
  }

  /** 友情链接统计响应 */
  interface FriendLinkStatsResponse {
    totalLinks: number;
    visibleLinks: number;
    hiddenLinks: number;
  }

  /** 博客总体统计响应 */
  interface BlogStatsResponse {
    posts: {
      total: number;
      published: number;
      draft: number;
      archived: number;
    };
    comments: {
      total: number;
      pending: number;
      approved: number;
    };
    categories: {
      total: number;
    };
    tags: {
      total: number;
    };
    views: {
      total: number;
    };
    likes: {
      total: number;
    };
  }

  /** 博客概览统计响应 */
  interface BlogStatsOverviewResponse {
    totalPosts: number;
    totalComments: number;
    totalViews: number;
    totalLikes: number;
  }

  // ==================== 列表响应类型 ====================

  /** 分页响应 */
  interface PaginatedResponse<T> {
    data: T[];
    pagination?: Pagination;
  }

  /** 分类列表响应 */
  type CategoryListResponse = PaginatedResponse<Category>;

  /** 标签列表响应 */
  type TagListResponse = PaginatedResponse<Tag>;

  /** 文章列表响应 */
  type PostListResponse = PaginatedResponse<Post>;

  /** 评论列表响应 */
  type CommentListResponse = PaginatedResponse<Comment>;

  /** 配置列表响应 */
  type ConfigListResponse = PaginatedResponse<Config>;

  /** 友情链接列表响应 */
  type FriendLinkListResponse = PaginatedResponse<FriendLink>;
}
