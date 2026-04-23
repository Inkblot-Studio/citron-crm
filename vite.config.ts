import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import path from 'path'
import { jiraApiDevPlugin } from './vite/jira-api-dev-plugin'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const tasksManagerRemote =
    env.VITE_TASKS_MANAGER_REMOTE_URL ||
    'https://citron-crm-tasksmanager-module.vercel.app/assets/remoteEntry.js'
  const accountingRemote =
    env.VITE_ACCOUNTING_REMOTE_URL ||
    'https://citron-crm-accounting-module.vercel.app/assets/remoteEntry.js'
  const salesRemote =
    env.VITE_SALES_REMOTE_URL ||
    'https://citron-crm-sales-module.vercel.app/assets/remoteEntry.js'

  return {
    plugins: [
      react(),
      ...(mode === 'development' ? [jiraApiDevPlugin()] : []),
      federation({
        name: 'host',
        remotes: {
          marketing: 'https://citron-crm-marketing-module.vercel.app/assets/remoteEntry.js',
          tasksManager: tasksManagerRemote,
          accounting: accountingRemote,
          sales: salesRemote,
        },
        // @citron-systems/citron-ui and citron-ds cannot be listed in shared here: Vite + this
        // plugin resolve deep imports to package.json and the packages lack that export (build fails).
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
      exclude: [
        'marketing/Marketing',
        'tasksManager/TasksManager',
        'accounting/Accounting',
        'sales/Sales',
      ],
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
