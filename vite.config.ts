import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Vite replaces this with the value of VITE_API_KEY from your .env file
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY)
    }
  }
})
