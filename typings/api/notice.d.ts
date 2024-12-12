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
}
