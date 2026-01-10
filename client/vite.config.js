import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-index-to-404',
      closeBundle() {
        const distDir = path.resolve(__dirname, 'dist')
        const indexPath = path.resolve(distDir, 'index.html')
        const path404 = path.resolve(distDir, '404.html')
        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, path404)
          console.log('✅ Generated 404.html from index.html for SPA routing')
        }
      }
    }
  ],
})
