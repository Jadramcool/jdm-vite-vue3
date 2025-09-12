declare namespace Navigation {
  // Navigation 类型声明
  type Navigation = {
    id: number;
    name: string;
    path: string;
    icon: string;
    description?: string;
    groupId: number;
    sortOrder: number;
    status: number;
    isDeleted?: number;
    createdTime?: Date;
    updatedTime?: Date;
    deletedTime?: Date;
  };

  // NavigationGroup 类型声明
  type NavigationGroup = {
    id: number;
    name: string;
    icon: string;
    description?: string;
    sortOrder: number;
    status: number;
    isDeleted?: number;
    createdTime?: Date;
    updatedTime?: Date;
    deletedTime?: Date;
    navigations?: Navigation[];
  };
}
