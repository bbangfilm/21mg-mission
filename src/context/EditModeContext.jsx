import { createContext, useContext, useState, useCallback, useEffect } from 'react'

// PIN은 빌드 시 주입(클라이언트 UX 게이트 — 보안 아님, 신뢰 그룹 1회용 전제).
const TEAM_PIN = String(import.meta.env.VITE_TEAM_PIN ?? '')
const ADMIN_PIN = String(import.meta.env.VITE_ADMIN_PIN ?? '')

const Ctx = createContext(null)
const KEY = '21mg-edit'

function mkUid() {
  try { return crypto.randomUUID().slice(0, 8) } catch { return 'u' + Date.now().toString(36) }
}
function loadSaved() {
  try { return JSON.parse(sessionStorage.getItem(KEY)) || {} } catch { return {} }
}

export function EditModeProvider({ children }) {
  const [state, setState] = useState(() => {
    const s = loadSaved()
    return { role: s.role || 'reader', name: s.name || null, uid: s.uid || mkUid() }
  })

  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify(state)) } catch { /* private mode */ }
  }, [state])

  /** PIN 검증만 (상태 변경 없음) → 'admin' | 'team' | null. 관리자 우선(상위집합). */
  const verifyPin = useCallback((pin) => {
    const p = String(pin || '').trim()
    if (ADMIN_PIN && p === ADMIN_PIN) return 'admin'
    if (TEAM_PIN && p === TEAM_PIN) return 'team'
    return null
  }, [])

  /** 이름까지 확정해야 편집 모드 진입(role+name 동시 커밋). 이름 없으면 진입 거부. */
  const enter = useCallback((role, name) => {
    const nm = String(name || '').trim()
    if (!role || !nm) return false
    setState((s) => ({ ...s, role, name: nm }))
    return true
  }, [])

  const setName = useCallback((name) => setState((s) => ({ ...s, name: name || null })), [])
  const lock = useCallback(() => setState((s) => ({ role: 'reader', name: null, uid: s.uid })), [])

  const can = useCallback((scope) => {
    if (scope === 'admin') return state.role === 'admin'
    return state.role === 'team' || state.role === 'admin' // 'team'
  }, [state.role])

  return (
    <Ctx.Provider value={{ ...state, verifyPin, enter, setName, lock, can }}>
      {children}
    </Ctx.Provider>
  )
}

export function useEditMode() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useEditMode must be used within EditModeProvider')
  return v
}
