declare namespace Notice {
  // Notice 类型声明
  type Notice = {
    id: number;
    title: string;
    content?: string;
    authorId?: number;
    status: number;
    createdTime: Date;
    updatedTime: Date;
    receivers?: Recordable;
    author?: Recordable;
  };
}
