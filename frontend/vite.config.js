import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // 또는 사용하는 프레임워크

export default defineConfig({
  plugins: [react()],
  base: '/',
})
