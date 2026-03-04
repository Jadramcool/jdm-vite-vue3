import { getLStorage } from '../storage';

const lStorage = getLStorage();

export const tokenKey = import.meta.env.VITE_APP_TOKEN_KEY;
const refreshTokenKey = 'refresh_token';

const getToken = (): string | null | undefined => {
  if (tokenKey) return lStorage.getItem(tokenKey);
};

const setToken = (token: string): void => {
  if (tokenKey) return lStorage.setItem(tokenKey, token);
};

const removeToken = (): void => {
  if (tokenKey) return lStorage.removeItem(tokenKey);
};

const getRefreshToken = (): string | null | undefined => {
  return lStorage.getItem(refreshTokenKey);
};

const setRefreshToken = (token: string): void => {
  lStorage.setItem(refreshTokenKey, token);
};

const removeRefreshToken = (): void => {
  lStorage.removeItem(refreshTokenKey);
};

export { getToken, removeToken, setToken, getRefreshToken, setRefreshToken, removeRefreshToken };
