/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LINERA_NODE_URL?: string
  readonly VITE_APP_ID?: string
  readonly VITE_CHAIN_ID?: string
  readonly VITE_ANALYTICS_ID?: string
  readonly VITE_SENTRY_DSN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
