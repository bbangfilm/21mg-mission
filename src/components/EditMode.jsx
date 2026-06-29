import { useEffect, useRef, useState } from 'react'
import { useEditMode } from '../context/EditModeContext.jsx'
import { editorsFor } from '../data/editors.js'
import styles from './EditMode.module.css'

const roleLabel = (r) => (r === 'admin' ? '관리자' : r === 'team' ? '팀장' : '')

export default function EditMode() {
  const { role, name, unlock, setName, lock, can } = useEditMode()
  const unlocked = can('team')

  const [open, setOpen] = useState(false)       // 모달
  const [panel, setPanel] = useState(false)     // 잠금 해제 후 팝오버
  const [step, setStep] = useState('pin')       // 'pin' | 'name'
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [custom, setCustom] = useState('')
  const [free, setFree] = useState(false)
  const inputRef = useRef(null)

  // 모달 열릴 때 입력 포커스 + Esc 닫기
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 50)
    const onKey = (e) => { if (e.key === 'Escape') closeAll() }
    window.addEventListener('keydown', onKey)
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey) }
  }, [open, step])

  function closeAll() {
    setOpen(false); setPanel(false); setStep('pin'); setPin(''); setError(false); setFree(false); setCustom('')
  }

  function onFab() {
    if (unlocked) setPanel((v) => !v)
    else { setStep('pin'); setOpen(true) }
  }

  function submitPin(e) {
    e?.preventDefault()
    const r = unlock(pin)
    if (!r) { setError(true); setPin(''); return }
    setError(false)
    if (!name) setStep('name')   // 이름 아직 → 이름 선택
    else closeAll()
  }

  function pick(n) {
    const v = (n || '').trim()
    if (!v) return
    setName(v)
    closeAll()
  }

  return (
    <>
      {/* 플로팅 편집 버튼 */}
      <div className={styles.fabWrap}>
        {panel && unlocked && (
          <div className={styles.panel} role="menu">
            <p className={styles.panelWho}>
              <b>{name || '이름 미설정'}</b>
              <span className={`${styles.roleBadge} ${styles['role_' + role]}`}>{roleLabel(role)}</span>
            </p>
            <button className="pressable" onClick={() => { setStep('name'); setOpen(true); setPanel(false) }}>이름 변경</button>
            <button className={`pressable ${styles.lockBtn}`} onClick={() => { lock(); setPanel(false) }}>잠금 해제(나가기)</button>
          </div>
        )}
        <button className={`${styles.fab} pressable ${unlocked ? styles.on : ''}`} onClick={onFab} aria-haspopup="dialog">
          <span aria-hidden="true">{unlocked ? '✏️' : '🔒'}</span>
          {unlocked ? <span className={styles.fabName}>{name || roleLabel(role)}</span> : <span>편집 모드</span>}
        </button>
      </div>

      {/* 모달 */}
      {open && (
        <div className={styles.backdrop} onClick={closeAll}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-label="편집 모드" onClick={(e) => e.stopPropagation()}>
            <button className={styles.close} onClick={closeAll} aria-label="닫기">✕</button>

            {step === 'pin' && (
              <form onSubmit={submitPin}>
                <h3 className={styles.mTitle}>편집 모드</h3>
                <p className={styles.mSub}>팀장 또는 관리자 PIN을 입력하세요</p>
                <input
                  ref={inputRef}
                  className={`${styles.pinInput} ${error ? styles.shake : ''}`}
                  inputMode="numeric" autoComplete="off"
                  value={pin} onChange={(e) => { setPin(e.target.value); setError(false) }}
                  placeholder="• • • •"
                />
                {error && <p className={styles.err}>PIN이 일치하지 않습니다</p>}
                <button type="submit" className={`${styles.primary} pressable`}>확인</button>
                <p className={styles.note}>PIN을 아는 팀장·관리자가 함께 씁니다. (개인 가입 없음)</p>
              </form>
            )}

            {step === 'name' && (
              <div>
                <h3 className={styles.mTitle}>누구신가요?</h3>
                <p className={styles.mSub}>체크·메모에 <b>이름</b>이 표시됩니다 — {roleLabel(role || 'team')}</p>
                <div className={styles.chips}>
                  {editorsFor(role === 'reader' ? 'team' : role).map((n) => (
                    <button key={n} className={`${styles.nameChip} pressable`} onClick={() => pick(n)}>{n}</button>
                  ))}
                  <button className={`${styles.nameChip} ${styles.more}`} onClick={() => setFree((v) => !v)}>직접 입력</button>
                </div>
                {free && (
                  <form className={styles.freeRow} onSubmit={(e) => { e.preventDefault(); pick(custom) }}>
                    <input className={styles.freeInput} value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="이름 입력" autoFocus />
                    <button type="submit" className={`${styles.primary} pressable`}>확인</button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
