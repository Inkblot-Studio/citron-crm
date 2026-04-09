import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const tasksManagerRemote =
    env.VITE_TASKS_MANAGER_REMOTE_URL ||
    'https://citron-crm-tasksmanager-module.vercel.app/assets/remoteEntry.js'
  const accountingRemote =
    env.VITE_ACCOUNTING_REMOTE_URL ||
    'https://citron-crm-accounting-module.vercel.app/assets/remoteEntry.js'

  return {
    plugins: [
      react(),
      federation({
        name: 'host',
        remotes: {
          marketing: 'https://citron-crm-marketing-module.vercel.app/assets/remoteEntry.js',
          tasksManager: tasksManagerRemote,
          accounting: accountingRemote,
        },
        // React trio must match remotes. Scoped @citron-systems/* as shared breaks resolution
        // with @originjs/vite-plugin-federation in this setup; remotes still receive compatible
        // versions if package.json ranges align with the Accounting remote.
        shared: ['react', 'react-dom', 'react-router-dom'],
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      dedupe: ['react', 'react-dom', 'react-router-dom'],
    },
    // Do not pre-bundle Module Federation remotes (breaks dev / runtime resolution)
    optimizeDeps: {
      exclude: ['marketing/Marketing', 'tasksManager/TasksManager', 'accounting/Accounting'],
    },
    server: {
      cors: true,
    },
    build: {
      modulePreload: false,
      target: 'esnext',
      minify: false,
      cssCodeSplit: false,
    },
  }
})
