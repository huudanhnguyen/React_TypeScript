import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tsconfigPaths()],
    server: {
    host: '0.0.0.0', // hoặc '127.0.0.1' hoặc 'localhost'
    port: 3000
  },
  preview: {
    port: 3000
  },
})
