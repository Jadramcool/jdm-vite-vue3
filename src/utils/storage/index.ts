import { createStorage } from './storage';

const prefixKey = '';

interface Option {
  prefixKey?: string;
}

export const createLocalStorage = (option: Option = {}) => {
  return createStorage({
    prefixKey: option.prefixKey || '',
    storage: localStorage,
  });
};

export const createSessionStorage = (option: Option = {}) => {
  return createStorage({
    prefixKey: option.prefixKey || '',
    storage: sessionStorage,
  });
};

// 使用函数而不是直接初始化的变量来避免循环依赖问题
let lStorageInstance: ReturnType<typeof createLocalStorage> | null = null;
let sStorageInstance: ReturnType<typeof createSessionStorage> | null = null;

export const getLStorage = () => {
  if (!lStorageInstance) {
    lStorageInstance = createLocalStorage({ prefixKey });
  }
  return lStorageInstance;
};

export const getSStorage = () => {
  if (!sStorageInstance) {
    sStorageInstance = createSessionStorage({ prefixKey });
  }
  return sStorageInstance;
};

// 为了向后兼容，仍然导出直接的实例，但在初始化时更加小心
export const lStorage = new Proxy(
  {},
  {
    get(_, prop) {
      const instance = getLStorage();
      return (instance as any)[prop];
    },
  },
) as ReturnType<typeof createLocalStorage>;

export const sStorage = new Proxy(
  {},
  {
    get(_, prop) {
      const instance = getSStorage();
      return (instance as any)[prop];
    },
  },
) as ReturnType<typeof createSessionStorage>;
