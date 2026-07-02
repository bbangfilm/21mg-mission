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
  // 더블탭 줌은 global.css `html { touch-action: manipulation }` 이 차단.
  // (JS touchend preventDefault 가드는 300ms 내 서로 다른 버튼 연속 탭의 click까지
  //  삼켜 빠른 체크리스트 조작이 무반응이 되므로 사용하지 않는다.)
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
