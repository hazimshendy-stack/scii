import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * FODOL — Vite configuration.
 *
 * The dev proxy forwards /api to the protected content server so the reader
 * can be developed against the real API origin. This matters for cookie
 * behaviour: proxying keeps the reader and the API on the SAME origin in
 * development, so the HttpOnly session cookie is first-party and the
 * SameSite=Lax policy applies exactly as it will in production.
 *
 * In production, deploy the API behind the same origin (reverse proxy) so
 * no cross-site cookie relaxation is ever required.
 */
export default defineConfig({
  base: process.env.GITHUB_ACTIONS === 'true' ? '/sci/' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: process.env.FODOL_DEV_API ?? 'http://127.0.0.1:8787',
        changeOrigin: false,
        secure: false,
      },
    },
  },
  build: {
    // Never inline assets as data: URLs — a page image inlined into JS would
    // place protected pixels in the bundle, outside the access-control path.
    assetsInlineLimit: 0,
    sourcemap: false,
  },
})
