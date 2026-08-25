/// <reference types="vite/client" />
declare const __IEUM_DISPLAY_VERSION__: string;

interface ImportMetaEnv {
  readonly VITE_WALLET_EDITION?: "light" | "normal";
  readonly VITE_DEFAULT_RPC_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
