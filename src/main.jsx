import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ensureAnonAuth } from './lib/firebase.js'
import './styles/global.css'

// 익명 로그인 미리 보장(쓰기 지연 최소화). 미설정/실패해도 정적은 동작.
ensureAnonAuth().catch(() => {})

// 개발 모드에서 데이터 정합성 검증 로그 (45명·팀명단·미배정·다중소속)
if (import.meta.env.DEV) {
  import('./data/validate.js').then((m) => m.logValidation())
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
