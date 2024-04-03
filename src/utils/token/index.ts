export const tokenKey = import.meta.env.VITE_APP_tokenKey;

const getToken = (): string | null | undefined => {
  if (tokenKey) return localStorage.getItem(tokenKey);
};

const setToken = (token: string): void => {
  if (tokenKey) return localStorage.setItem(tokenKey, token);
};

const removeToken = (): void => {
  if (tokenKey) return localStorage.removeItem(tokenKey);
};

export { getToken, setToken, removeToken };
