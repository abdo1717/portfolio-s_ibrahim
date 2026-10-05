/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional https endpoint (Formspree, Getform, your API…) that receives the contact form as JSON. */
  readonly VITE_CONTACT_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
