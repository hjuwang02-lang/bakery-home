import { defineConfig } from 'vite'
import react from '@vitejs/react-refresh' // 또는 사용하는 프레임워크

export default defineConfig({
  plugins: [react()],
  base: '/bakery-home/',  // 💡 중요: 깃허브에 만들 '저장소 이름'을 양쪽에 슬래시(/)를 붙여 적어주세요!
})