export interface ResponseModel<T = any> {
  success?: boolean;
  message?: string | null;
  code?: number | string;
  status?: number | string;
  data: T;
  [key: string]: any; // 允许其他属性
}

// 文件类型枚举
export type FileType = 'image' | 'document' | 'audio' | 'video' | 'archive' | 'avatar' | 'all';

// 上传目标枚举
export type UploadTarget = 'local' | 'oss' | 'both';

// 统一上传请求参数
export interface UnifiedUploadParams {
  file: File;
  fileType?: FileType;
  target?: UploadTarget;
  folder?: string;
  maxSize?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
}

// 单个上传结果
export interface UploadResult {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  originalName: string;
  uploadTime: string;
}

// 批量上传结果
export interface BatchUploadResult {
  successFiles: UploadResult[];
  failedFiles: Array<{
    fileName: string;
    error: string;
  }>;
  totalCount: number;
  successCount: number;
  failedCount: number;
}

// 统一上传结果
export interface UnifiedUploadResult {
  local?: UploadResult;
  oss?: UploadResult;
  target: UploadTarget;
}
