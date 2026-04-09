/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TASKS_MANAGER_REMOTE_URL?: string
  readonly VITE_ACCOUNTING_REMOTE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
