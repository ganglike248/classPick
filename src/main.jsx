import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { initializeAnalytics } from './utils/analytics.js'
import { initAdsense } from './utils/adsense.js'

// Google Analytics 초기화
initializeAnalytics()

// Google 애드센스 로더 스크립트 삽입 (VITE_ADSENSE_CLIENT_ID 없으면 아무 동작 안 함)
initAdsense()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
