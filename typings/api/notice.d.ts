declare namespace Notice {
  // Notice 类型声明
  type Notice = {
    id: number;
    title: string;
    content?: string;
    authorId?: number;
    status: number;
    type: string;
    createdTime: Date;
    updatedTime: Date;
    receivers?: Recordable;
    author?: Recordable;
  };

  type UserNotice = {
    id: number;
    userId: number;
    user?: System.User;
    noticeId: number;
    notice: Notice;
    assignedTime: string;
    readTime: string | null;
    isDeleted: boolean;
  };

  interface Todo {
    id: number;
    pid?: number; // 待办事项父级id
    title: string; // 待办事项标题/待办组名称
    content?: string; // 待办事项内容/待办组内容
    isDone: boolean; // 是否完成
    sortOrder?: number;
    createdTime?: string; // 创建时间
    updatedTime?: string; // 更新时间
    doneTime?: string; // 完成时间
    userId?: number;
    user?: System.User; // 关联的用户对象
    children?: any;
    parent?: Todo;
    tag?: string; // 本地用来标记是否创建
  }
}
