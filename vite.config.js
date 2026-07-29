import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

// package.json의 version이 앱 버전의 단일 출처(source of truth).
// __APP_VERSION__으로 번들에 주입해, UI에 표시되는 버전이 항상 자동으로 일치하게 함.
const pkg = JSON.parse(
  readFileSync(fileURLToPath(new URL('./package.json', import.meta.url)), 'utf-8'),
)

// 구글 애드센스 사이트 소유권 확인은 <head>의 로더 스크립트를 "정적 HTML"에서
// 그대로 찾는다 — React가 런타임(JS)에 나중에 삽입하는 방식으로는 "사이트를
// 확인할 수 없습니다" 오류가 난다. 그래서 빌드 시점에 index.html에 직접 심는다.
function adsenseHtmlPlugin(clientId) {
  return {
    name: 'inject-adsense-script',
    transformIndexHtml(html) {
      if (!clientId) return html
      const tag = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}" crossorigin="anonymous"></script>`
      return html.replace('</head>', `    ${tag}\n  </head>`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), adsenseHtmlPlugin(env.VITE_ADSENSE_CLIENT_ID)],
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
  }
})
