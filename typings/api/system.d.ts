declare namespace System {
  // Role 类型声明
  type Role = {
    id: number;
    code: string;
    name: string;
    description?: string | null;
    createdTime: Date;
    updatedTime: Date;
    deletedTime?: Date | null;
    isDeleted: boolean;
    users?: Recordable;
    menus?: Recordable;
  };

  // Menu 类型声明
  type Menu = {
    id: number; // 菜单ID
    name: string; // 菜单名称
    code: string; // 权限代码
    type: string; // menu: 菜单, button: 按钮, directory: 目录
    pid?: Nullable<number>; // 菜单的父id
    path?: string; // 路由路径
    redirect?: string; // 重定向
    icon?: string; // 图标
    component?: string; // 组件路径
    layout?: string; // 布局
    keepAlive?: boolean; // 是否保持活跃
    method?: string; // 请求方法
    description?: string; // 菜单描述
    show: boolean; // 是否展示
    enable?: boolean; // 是否启用
    order?: number; // 排序
    roles?: Recordable; // 与角色菜单表的关系
  };

  type loginModel = {
    username: string;
    password: string;
  };

  type Sex = 'MALE' | 'FEMALE' | 'OTHER';

  type UserRole = {
    userId?: number;
    roleId?: number;
    [key: string]: any;
  };

  // User 类型声明
  type User = {
    id: number;
    username: string;
    name?: string;
    phone?: string;
    email?: string;
    sex?: Sex; // 需要定义 Sex 类型
    avatar?: string;
    birthday?: Date;
    createdTime?: Date;
    updatedTime?: Date;
    deletedTime?: Date;
    password?: string;
    isDeleted?: boolean;
    status: number; // 0: 未激活, 1: 激活
    roleType?: string; // 角色类型 admin, user, doctor
    city?: Nullable<string>;
    address?: Nullable<string>;
    addressDetail?: Nullable<string>;
    roles?: UserRole[]; // 需要定义 UserRole 类型
  };

  // Config 类型声明
  interface SysConfig {
    /** 配置ID */
    id: number;
    /** 配置名称 */
    name: string;
    /** 配置键名 */
    key: string;
    /** 配置值(JSON字符串) */
    value: string | null;
    /** 配置类型 */
    type: ConfigType;
    /** 配置分类 */
    category: string | null;
    /** 配置描述 */
    description: string | null;
    /** 是否为系统配置 */
    isSystem: boolean;
    /** 是否为公开配置 */
    isPublic: boolean;
    /** 排序 */
    sortOrder: number | null;
    /** 创建时间 */
    createdTime: Date;
    /** 更新时间 */
    updatedTime: Date;
  }

  enum ConfigType {
    STRING = 'STRING', // 字符串
    NUMBER = 'NUMBER', // 数字
    BOOLEAN = 'BOOLEAN', // 布尔值
    JSON = 'JSON', // JSON对象
    ARRAY = 'ARRAY', // 数组
    FILE = 'FILE', // 文件路径
    EMAIL = 'EMAIL', // 邮箱
    URL = 'URL', // 网址
    PASSWORD = 'PASSWORD', // 密码(加密存储)
  }
  /**
   * 创建系统配置时的输入类型（可选字段）
   */
  interface CreateSysConfigInput {
    key: string;
    name?: string;
    value?: string | null;
    type?: ConfigType;
    category?: string | null;
    description?: string | null;
    isSystem?: boolean;
    isPublic?: boolean;
    sortOrder?: number | null;
  }

  /**
   * 更新系统配置时的输入类型（所有字段可选）
   */
  interface UpdateSysConfigInput {
    key?: string;
    name?: string;
    value?: string | null;
    type?: ConfigType;
    category?: string | null;
    description?: string | null;
    isSystem?: boolean;
    isPublic?: boolean;
    sortOrder?: number | null;
  }
}
