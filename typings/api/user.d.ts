/**
 * API类型定义
 * 提供API请求和响应的严格类型定义
 */

/**
 * 分页响应
 */
export interface PaginationResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 分页查询参数
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/**
 * 用户登录参数
 */
export interface LoginParams {
  username: string;
  password: string;
  captcha?: string;
}

/**
 * 用户注册参数
 */
export interface RegisterParams {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  captcha?: string;
}

/**
 * 用户更新参数
 */
export interface UpdateUserParams {
  id: number;
  username?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  departmentId?: number;
  roleIds?: number[];
}

/**
 * 用户列表查询参数
 */
export interface UserListParams extends PaginationParams {
  username?: string;
  departmentId?: number;
  status?: number;
}

/**
 * 部门列表查询参数
 */
export interface DepartmentListParams extends PaginationParams {
  name?: string;
  status?: number;
}

/**
 * 部门创建参数
 */
export interface CreateDepartmentParams {
  name: string;
  parentId?: number;
  description?: string;
  sort?: number;
}

/**
 * 部门更新参数
 */
export interface UpdateDepartmentParams {
  id: number;
  name?: string;
  parentId?: number;
  description?: string;
  sort?: number;
}

/**
 * 角色列表查询参数
 */
export interface RoleListParams extends PaginationParams {
  name?: string;
  status?: number;
}

/**
 * 角色创建参数
 */
export interface CreateRoleParams {
  name: string;
  code: string;
  description?: string;
  sort?: number;
  menuIds?: number[];
}

/**
 * 角色更新参数
 */
export interface UpdateRoleParams {
  id: number;
  name?: string;
  code?: string;
  description?: string;
  sort?: number;
  menuIds?: number[];
}

/**
 * 菜单列表查询参数
 */
export interface MenuListParams extends PaginationParams {
  name?: string;
  status?: number;
}

/**
 * 菜单创建参数
 */
export interface CreateMenuParams {
  title: string;
  path: string;
  component?: string;
  icon?: string;
  sort?: number;
  parentId?: number;
  type?: number;
  permission?: string;
  visible?: boolean;
}

/**
 * 菜单更新参数
 */
export interface UpdateMenuParams {
  id: number;
  title?: string;
  path?: string;
  component?: string;
  icon?: string;
  sort?: number;
  parentId?: number;
  type?: number;
  permission?: string;
  visible?: boolean;
}

/**
 * 配置更新参数
 */
export interface UpdateConfigParams {
  id: number;
  configKey: string;
  configValue: string;
  description?: string;
}

/**
 * 操作日志查询参数
 */
export interface OpLogListParams extends PaginationParams {
  username?: string;
  module?: string;
  operation?: string;
  startTime?: string;
  endTime?: string;
}

/**
 * 通知列表查询参数
 */
export interface NoticeListParams extends PaginationParams {
  title?: string;
  type?: string;
  status?: number;
}

/**
 * 通知创建参数
 */
export interface CreateNoticeParams {
  title: string;
  content: string;
  type: string;
  status?: number;
  priority?: number;
}

/**
 * 通知更新参数
 */
export interface UpdateNoticeParams {
  id: number;
  title?: string;
  content?: string;
  type?: string;
  status?: number;
  priority?: number;
}

/**
 * 待办事项查询参数
 */
export interface TodoListParams extends PaginationParams {
  title?: string;
  status?: number;
  priority?: number;
}

/**
 * 待办事项创建参数
 */
export interface CreateTodoParams {
  title: string;
  description?: string;
  priority?: number;
  dueDate?: string;
}

/**
 * 待办事项更新参数
 */
export interface UpdateTodoParams {
  id: number;
  title?: string;
  description?: string;
  status?: number;
  priority?: number;
  dueDate?: string;
}

/**
 * 导航列表查询参数
 */
export interface NavigationListParams extends PaginationParams {
  title?: string;
  url?: string;
  status?: number;
}

/**
 * 导航创建参数
 */
export interface CreateNavigationParams {
  title: string;
  url: string;
  icon?: string;
  sort?: number;
  status?: number;
}

/**
 * 导航更新参数
 */
export interface UpdateNavigationParams {
  id: number;
  title?: string;
  url?: string;
  icon?: string;
  sort?: number;
  status?: number;
}

/**
 * AI聊天参数
 */
export interface AIChatParams {
  provider: string;
  model: string;
  messages: Array<{ role: string; content: string }>;
  stream?: boolean;
}

/**
 * AI模型列表参数
 */
export interface AIModelListParams {
  provider: string;
}

/**
 * AI智能体创建参数
 */
export interface CreateAgentParams {
  name: string;
  description?: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * AI智能体更新参数
 */
export interface UpdateAgentParams {
  id: number;
  name?: string;
  description?: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}
