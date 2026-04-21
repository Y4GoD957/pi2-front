/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
}

declare namespace NodeJS {
  interface ProcessEnv {
    VITE_SUPABASE_URL?: string
    VITE_SUPABASE_PUBLISHABLE_KEY?: string
  }
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
