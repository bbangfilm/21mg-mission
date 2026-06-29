import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

// 개발 모드에서 데이터 정합성 검증 로그 (45명·팀명단·미배정·다중소속)
if (import.meta.env.DEV) {
  import('./data/validate.js').then((m) => m.logValidation())
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
