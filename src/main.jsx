import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ensureAnonAuth } from './lib/firebase.js'
import './styles/global.css'

// 익명 로그인 미리 보장(쓰기 지연 최소화). 미설정/실패해도 정적은 동작.
ensureAnonAuth().catch(() => {})

// 화면 확대(줌) 고정 — 모바일은 viewport meta(user-scalable=no)로, 데스크톱은 아래 가드로 차단.
//  · Safari 핀치 제스처, 트랙패드/Ctrl+휠 줌, Ctrl/Cmd +/-/0 단축키, 더블탭 줌.
{
  const stop = (e) => e.preventDefault()
  document.addEventListener('gesturestart', stop, { passive: false })
  document.addEventListener('gesturechange', stop, { passive: false })
  document.addEventListener('wheel', (e) => { if (e.ctrlKey || e.metaKey) e.preventDefault() }, { passive: false })
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '0'].includes(e.key)) e.preventDefault()
  })
  // 더블탭 줌 방지(모바일)
  let lastTouch = 0
  document.addEventListener('touchend', (e) => {
    const now = Date.now()
    if (now - lastTouch <= 300) e.preventDefault()
    lastTouch = now
  }, { passive: false })
}

// 개발 모드에서 데이터 정합성 검증 로그 (45명·팀명단·미배정·다중소속)
if (import.meta.env.DEV) {
  import('./data/validate.js').then((m) => m.logValidation())
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
