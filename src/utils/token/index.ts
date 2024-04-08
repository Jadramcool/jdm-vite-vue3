import { lStorage } from '../storage';

export const tokenKey = import.meta.env.VITE_APP_TOKEN_KEY;

const getToken = (): string | null | undefined => {
  if (tokenKey) return lStorage.getItem(tokenKey);
};

const setToken = (token: string): void => {
  console.log('🚀 ~ setToken ~ token:', token);
  if (tokenKey) return lStorage.setItem(tokenKey, token);
};

const removeToken = (): void => {
  if (tokenKey) return lStorage.removeItem(tokenKey);
};

export { getToken, setToken, removeToken };
