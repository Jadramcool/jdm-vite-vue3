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

  type loginModel = {
    username: string;
    password: string;
  };
}
