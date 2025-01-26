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
    // doctor?: Hospital.Doctor;
    // patient?: Hospital.Patient;
  };
}
