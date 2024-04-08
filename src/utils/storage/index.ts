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

export const lStorage = createLocalStorage({ prefixKey });

export const sStorage = createSessionStorage({ prefixKey });
