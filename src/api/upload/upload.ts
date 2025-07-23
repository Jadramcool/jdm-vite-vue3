import request from '@/utils/http/axios';
import type {
  BatchUploadResult,
  UnifiedUploadParams,
  UnifiedUploadResult,
} from '@/utils/http/types';
import type { AxiosProgressEvent, AxiosRequestConfig } from 'axios';

// 上传进度回调类型
export type UploadProgressCallback = (progress: number, progressEvent: AxiosProgressEvent) => void;

// 文件类型配置接口
export interface FileTypeConfig {
  folder: string;
  maxSize: number;
  allowedMimeTypes: string[];
  allowedExtensions: string[];
}

// 预设文件类型配置
export const FILE_TYPE_CONFIGS: Record<string, FileTypeConfig> = {
  avatar: {
    folder: 'avatars',
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  },
  image: {
    folder: 'images',
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
  },
  document: {
    folder: 'documents',
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
    ],
    allowedExtensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'],
  },
  video: {
    folder: 'videos',
    maxSize: 500 * 1024 * 1024, // 500MB
    allowedMimeTypes: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv'],
    allowedExtensions: ['.mp4', '.avi', '.mov', '.wmv', '.flv'],
  },
  audio: {
    folder: 'audios',
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedMimeTypes: ['audio/mp3', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/ogg'],
    allowedExtensions: ['.mp3', '.wav', '.flac', '.aac', '.ogg'],
  },
  archive: {
    folder: 'archives',
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedMimeTypes: [
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      'application/x-tar',
      'application/gzip',
    ],
    allowedExtensions: ['.zip', '.rar', '.7z', '.tar', '.gz'],
  },
  code: {
    folder: 'code',
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'text/plain',
      'text/javascript',
      'text/typescript',
      'text/css',
      'text/html',
      'application/json',
    ],
    allowedExtensions: [
      '.js',
      '.ts',
      '.vue',
      '.jsx',
      '.tsx',
      '.css',
      '.scss',
      '.less',
      '.html',
      '.json',
      '.md',
    ],
  },
  font: {
    folder: 'fonts',
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: [
      'font/woff',
      'font/woff2',
      'font/ttf',
      'font/otf',
      'application/font-woff',
      'application/font-woff2',
    ],
    allowedExtensions: ['.woff', '.woff2', '.ttf', '.otf', '.eot'],
  },
  excel: {
    folder: 'excel',
    maxSize: 20 * 1024 * 1024, // 20MB
    allowedMimeTypes: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ],
    allowedExtensions: ['.xls', '.xlsx', '.csv'],
  },
  config: {
    folder: 'configs',
    maxSize: 1 * 1024 * 1024, // 1MB
    allowedMimeTypes: [
      'application/json',
      'text/plain',
      'application/xml',
      'text/xml',
      'application/yaml',
    ],
    allowedExtensions: ['.json', '.xml', '.yaml', '.yml', '.ini', '.conf', '.config'],
  },
  apk: {
    folder: 'apk',
    maxSize: 200 * 1024 * 1024, // 200MB
    allowedMimeTypes: ['application/vnd.android.package-archive'],
    allowedExtensions: ['.apk'],
  },
};

/**
 * 统一文件上传接口
 * @param params 上传参数
 * @param onProgress 进度回调
 * @param usePresetConfig 是否使用预设配置（当fileType存在于预设中时）
 * @returns 上传结果
 */
export const uploadFile = async (
  params: UnifiedUploadParams,
  onProgress?: UploadProgressCallback,
  usePresetConfig: boolean = true,
): Promise<UnifiedUploadResult> => {
  let finalParams = { ...params };

  // 如果启用预设配置且fileType存在于预设中，则应用预设配置
  if (usePresetConfig && params.fileType && FILE_TYPE_CONFIGS[params.fileType]) {
    const presetConfig = FILE_TYPE_CONFIGS[params.fileType];
    finalParams = {
      ...presetConfig,
      ...params, // 用户传入的参数优先级更高
    };
  }

  const formData = new FormData();

  // 添加文件
  formData.append('file', finalParams.file);

  // 添加其他参数
  // 添加文件类型参数
  if (finalParams.fileType) {
    formData.append('fileType', finalParams.fileType);
  }
  // 添加存储目标参数（如：oss、local等）
  if (finalParams.target) {
    formData.append('target', finalParams.target);
  }
  // 添加文件夹路径参数
  if (finalParams.folder) {
    formData.append('folder', finalParams.folder);
  }
  // 添加文件大小限制参数（字节为单位）
  if (finalParams.maxSize) {
    formData.append('maxSize', finalParams.maxSize.toString());
  }
  // 添加允许的MIME类型列表（JSON格式）
  if (finalParams.allowedMimeTypes && finalParams.allowedMimeTypes.length > 0) {
    formData.append('allowedMimeTypes', JSON.stringify(finalParams.allowedMimeTypes));
  }
  // 添加允许的文件扩展名列表（JSON格式）
  if (finalParams.allowedExtensions && finalParams.allowedExtensions.length > 0) {
    formData.append('allowedExtensions', JSON.stringify(finalParams.allowedExtensions));
  }

  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  if (onProgress) {
    config.onUploadProgress = (progressEvent) => {
      if (progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress, progressEvent);
      }
    };
  }

  return request.post({
    url: '/upload',
    data: formData,
    ...config,
  });
};

/**
 * 批量文件上传
 * @param files 文件列表
 * @param params 上传参数（不包含file字段）
 * @param onProgress 进度回调
 * @param usePresetConfig 是否使用预设配置（当fileType存在于预设中时）
 * @returns 批量上传结果
 */
export const uploadFiles = async (
  files: File[],
  params?: Omit<UnifiedUploadParams, 'file'>,
  onProgress?: UploadProgressCallback,
  usePresetConfig: boolean = true,
): Promise<BatchUploadResult> => {
  let finalParams = params ? { ...params } : {};

  // 如果启用预设配置且fileType存在于预设中，则应用预设配置
  if (usePresetConfig && params?.fileType && FILE_TYPE_CONFIGS[params.fileType]) {
    const presetConfig = FILE_TYPE_CONFIGS[params.fileType];
    finalParams = params
      ? {
          ...presetConfig,
          ...params, // 用户传入的参数优先级更高
        }
      : presetConfig;
  }

  const formData = new FormData();

  // 添加多个文件
  files.forEach((file) => {
    formData.append('files', file);
  });

  // 添加其他参数
  if (finalParams?.fileType) {
    formData.append('fileType', finalParams.fileType);
  }
  if (finalParams?.target) {
    formData.append('target', finalParams.target);
  }
  if (finalParams?.folder) {
    formData.append('folder', finalParams.folder);
  }
  if (finalParams?.maxSize) {
    formData.append('maxSize', finalParams.maxSize.toString());
  }
  if (finalParams?.allowedMimeTypes && finalParams.allowedMimeTypes.length > 0) {
    formData.append('allowedMimeTypes', JSON.stringify(finalParams.allowedMimeTypes));
  }
  if (finalParams?.allowedExtensions && finalParams.allowedExtensions.length > 0) {
    formData.append('allowedExtensions', JSON.stringify(finalParams.allowedExtensions));
  }

  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  if (onProgress) {
    config.onUploadProgress = (progressEvent) => {
      if (progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress, progressEvent);
      }
    };
  }

  return request.post({
    url: '/upload/batch',
    data: formData,
    ...config,
  });
};
