declare namespace Hospital {
  // Department 类型声明
  type Department = {
    id: number;
    title: string;
    content?: string;
    createdTime: Date;
    updatedTime: Date;
  };

  // Doctor 类型声明
  interface Doctor {
    id: number;
    userId: number;
    departmentId?: number;
    introduction?: string;
    registrationFee?: number;
    user?: System.User;
    department?: Department;
    createdTime: string;
  }

  interface Patient {
    id: number;
    userId: number;
    user?: System.User;
    createdTime: string;
  }
}
