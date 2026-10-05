import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

/**
 * Injects a Content-Security-Policy <meta> into the production build only
 * (the dev server needs inline scripts / websockets for HMR).
 * Response headers (frame-ancestors, HSTS, …) live in public/_headers.
 */
function cspPlugin(connectOrigin: string): Plugin {
  return {
    name: 'inject-csp',
    apply: 'build',
    transformIndexHtml(html) {
      const policy = [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'", // Vue :style bindings need inline styles
        "img-src 'self' data: https://api.builder.io",
        "font-src 'self' data:",
        `connect-src 'self' ${connectOrigin}`.trim(),
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; ')
      return html.replace(
        '<meta charset="UTF-8" />',
        `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />`,
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  let connectOrigin = ''
  try {
    if (env.VITE_CONTACT_ENDPOINT) connectOrigin = new URL(env.VITE_CONTACT_ENDPOINT).origin
  } catch {
    /* invalid URL → ignored, the contact form falls back to mailto */
  }

  return {
    plugins: [vue(), vueDevTools(), cspPlugin(connectOrigin)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
