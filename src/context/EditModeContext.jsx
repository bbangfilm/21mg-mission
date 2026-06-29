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

  /** PIN 비교 → 'admin' | 'team' | null. 관리자 우선(상위집합). */
  const unlock = useCallback((pin) => {
    const p = String(pin || '').trim()
    let role = null
    if (ADMIN_PIN && p === ADMIN_PIN) role = 'admin'
    else if (TEAM_PIN && p === TEAM_PIN) role = 'team'
    if (role) setState((s) => ({ ...s, role }))
    return role
  }, [])

  const setName = useCallback((name) => setState((s) => ({ ...s, name: name || null })), [])
  const lock = useCallback(() => setState((s) => ({ role: 'reader', name: null, uid: s.uid })), [])

  const can = useCallback((scope) => {
    if (scope === 'admin') return state.role === 'admin'
    return state.role === 'team' || state.role === 'admin' // 'team'
  }, [state.role])

  return (
    <Ctx.Provider value={{ ...state, unlock, setName, lock, can }}>
      {children}
    </Ctx.Provider>
  )
}

export function useEditMode() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useEditMode must be used within EditModeProvider')
  return v
}
