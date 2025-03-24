/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_EMAILS: string;
  readonly VITE_SUPABASE_KEY: string;
  readonly VITE_POSTHOG_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
