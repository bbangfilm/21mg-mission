import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ⚠️ GitHub Pages base path — 단일 진실원본(single source of truth).
//    저장소 이름이 확정되면 이 한 줄만 '/<저장소이름>/' 으로 교체.
//    dev/preview 는 '/' 로(로컬 편의), 프로덕션 빌드만 repo 경로 적용.
//    (배포 base 오설정 시 CSS/JS 404 → 흰 화면. 빈 페이지 실배포로 가장 먼저 검증.)
const PROD_BASE = '/21mg-mission/'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? PROD_BASE : '/',
  plugins: [react()],
}))
