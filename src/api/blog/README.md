# 博客系统前端API调用代码

本文件夹包含了博客系统所有模块的前端API调用代码，按模块分类组织。

## 文件结构

```
frontApi/
├── index.ts          # 统一导出入口
├── user.ts           # 博客用户相关API
├── post.ts           # 博客文章相关API
├── category.ts       # 博客分类相关API
├── tag.ts            # 博客标签相关API
├── comment.ts        # 博客评论相关API
├── config.ts         # 博客配置相关API
├── friendlink.ts     # 友情链接相关API
├── stats.ts          # 博客统计相关API
└── README.md         # 说明文档
```

## 使用方法

### 1. 复制到前端项目

将整个 `frontApi` 文件夹复制到你的前端项目中的合适位置，例如 `src/api/blog/`。

### 2. 安装依赖

确保你的前端项目已经配置了 `@/utils/http/axios` 工具，或者根据你的项目结构调整导入路径。

### 3. 使用示例

```typescript
// 导入特定模块的API
import { getBlogUser } from '@/api/blog/user';
import { getPostList, createPost } from '@/api/blog/post';
import { getCategoryTree } from '@/api/blog/category';

// 或者导入所有API
import * as blogApi from '@/api/blog';

// 使用示例
const fetchBlogUser = async () => {
  try {
    const response = await getBlogUser();
    console.log('博客用户信息:', response.data);
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
};

const fetchPosts = async () => {
  try {
    const response = await getPostList({ page: 1, pageSize: 10 });
    console.log('文章列表:', response.data);
  } catch (error) {
    console.error('获取文章列表失败:', error);
  }
};
```

## API 模块说明

### 用户模块 (user.ts)

- `getBlogUser()` - 获取博客用户信息

### 文章模块 (post.ts)

- `createPost(data)` - 创建博客文章
- `getPostList(params)` - 获取博客文章列表
- `getPostStats()` - 获取博客文章统计
- `getPostById(id, incrementView)` - 根据ID获取博客文章
- `getPostBySlug(slug, incrementView)` - 根据slug获取博客文章
- `updatePost(id, data)` - 更新博客文章
- `deletePost(id)` - 删除博客文章
- `togglePostTop(id)` - 切换文章置顶状态

### 分类模块 (category.ts)

- `createCategory(data)` - 创建博客分类
- `getCategoryList(params)` - 获取博客分类列表
- `getCategoryTree(params)` - 获取博客分类树形结构
- `getCategoryStats()` - 获取博客分类统计
- `getCategoryById(id)` - 根据ID获取博客分类
- `getCategoryBySlug(slug)` - 根据slug获取博客分类
- `updateCategory(id, data)` - 更新博客分类
- `deleteCategory(id)` - 删除博客分类
- `updateCategoryPostCount(id)` - 更新分类文章数量

### 标签模块 (tag.ts)

- `createTag(data)` - 创建博客标签
- `getTagList(params)` - 获取博客标签列表
- `getPopularTags(params)` - 获取热门标签
- `getTagStats()` - 获取博客标签统计
- `getTagById(id)` - 根据ID获取博客标签
- `getTagBySlug(slug)` - 根据slug获取博客标签
- `updateTag(id, data)` - 更新博客标签
- `deleteTag(id)` - 删除博客标签
- `updateTagPostCount(id)` - 更新标签文章数量

### 评论模块 (comment.ts)

- `createComment(data)` - 创建博客评论
- `getCommentList(params)` - 获取博客评论列表
- `getLatestComments(params)` - 获取最新评论
- `getCommentStats()` - 获取博客评论统计
- `getCommentById(id)` - 根据ID获取博客评论
- `updateComment(id, data)` - 更新博客评论
- `deleteComment(id)` - 删除博客评论
- `approveComment(id)` - 审核通过评论
- `rejectComment(id)` - 拒绝评论
- `likeComment(id)` - 点赞评论

### 配置模块 (config.ts)

- `createConfig(data)` - 创建博客配置
- `getConfigList(params)` - 获取博客配置列表
- `getConfigByCategory(category)` - 根据分类获取配置
- `getConfigByKey(key)` - 根据键获取配置
- `getConfigCategories()` - 获取配置分类列表
- `getConfigStats()` - 获取博客配置统计
- `getConfigById(id)` - 根据ID获取博客配置
- `updateConfig(id, data)` - 更新博客配置
- `batchUpdateConfig(data)` - 批量更新配置
- `deleteConfig(id)` - 删除博客配置

### 友情链接模块 (friendlink.ts)

- `createFriendLink(data)` - 创建友情链接
- `getFriendLinkList(params)` - 获取友情链接列表
- `getApprovedFriendLinks(params)` - 获取已审核通过的友情链接
- `getFriendLinkStats()` - 获取友情链接统计
- `getFriendLinkById(id)` - 根据ID获取友情链接
- `updateFriendLink(id, data)` - 更新友情链接
- `deleteFriendLink(id)` - 删除友情链接
- `approveFriendLink(id)` - 审核通过友情链接
- `rejectFriendLink(id)` - 拒绝友情链接
- `updateFriendLinkSort(data)` - 更新友情链接排序

### 统计模块 (stats.ts)

- `getAllStats()` - 获取所有博客统计数据
- `getOverviewStats()` - 获取博客概览统计数据

## 注意事项

1. 请确保你的前端项目中已经正确配置了 HTTP 请求工具
2. 根据你的项目结构调整导入路径
3. 某些API可能需要认证，请确保在请求头中包含必要的认证信息
4. 参数类型可以根据你的项目需求进行调整和完善
5. 建议在实际使用时添加适当的错误处理和类型定义
