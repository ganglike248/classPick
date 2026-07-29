import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { initializeAnalytics } from './utils/analytics.js'

// Google Analytics 초기화
initializeAnalytics()

// 구글 애드센스 로더 스크립트는 vite.config.js에서 빌드 시점에 index.html에
// 직접 삽입한다 (사이트 소유권 확인이 정적 HTML만 확인하기 때문)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
