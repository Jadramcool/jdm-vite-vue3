/// <reference types="vite/client" />
/// <reference types="vite/client" />

export interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_BASE_URL: string;
  readonly VITE_WEATHER_KEY?: string;
  readonly VITE_APP_TOKEN_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
