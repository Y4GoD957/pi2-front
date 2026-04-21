/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EDUCENSO_API_BASE_URL?: string
}

declare namespace NodeJS {
  interface ProcessEnv {
    VITE_EDUCENSO_API_BASE_URL?: string
  }
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
