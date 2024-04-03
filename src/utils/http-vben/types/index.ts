import { AxiosRequestConfig } from 'axios';

export interface ResponseModel<T = any> {
  success: boolean;
  message: string | null;
  code?: number | string;
  status?: number | string;
  data: T;
}

export interface UploadFileItemModel {
  name: string;
  value: string | Blob;
}

/**
 * customize your uploadRequestConfig
 */
export type UploadRequestConfig = Omit<AxiosRequestConfig, 'url' | 'data'>;
