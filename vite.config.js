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

// public/_redirects 의 정적 콘텐츠 페이지 규칙(/about, /guide, /guide/*)은
// Netlify에서만 동작한다. 로컬 dev 서버와 vite preview 는 그 규칙을 모르므로
// 확장자 없는 URL(/about)이 SPA fallback(index.html)으로 빠져 빈 화면이 된다.
// 아래 미들웨어로 로컬에서도 같은 매핑을 재현해 준다.
function staticPagesRewritePlugin() {
  const rewrite = (url) => {
    const qIndex = url.indexOf('?')
    const path = qIndex === -1 ? url : url.slice(0, qIndex)
    const suffix = qIndex === -1 ? '' : url.slice(qIndex)
    if (path === '/about') return `/about.html${suffix}`
    if (path === '/guide' || path === '/guide/') return `/guide/index.html${suffix}`
    const m = path.match(/^\/guide\/([a-z0-9-]+)$/i)
    if (m) return `/guide/${m[1]}.html${suffix}`
    return null
  }
  const middleware = (req, _res, next) => {
    if (req.url) {
      const rewritten = rewrite(req.url)
      if (rewritten) req.url = rewritten
    }
    next()
  }
  return {
    name: 'static-pages-rewrite',
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      adsenseHtmlPlugin(env.VITE_ADSENSE_CLIENT_ID),
      staticPagesRewritePlugin(),
    ],
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
  }
})
