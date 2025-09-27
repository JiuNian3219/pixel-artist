/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UMAMI_WEBSITE_ID?: string;
  readonly VITE_UMAMI_SCRIPT_URL?: string;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
