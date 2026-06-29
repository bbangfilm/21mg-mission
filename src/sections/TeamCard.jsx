import { useState } from 'react'
import { Chip } from '../components/ui.jsx'
import CheckRow from '../components/CheckRow.jsx'
import styles from './Teams.module.css'

const stamp = () => {
  const d = new Date()
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// 팀 카드 — 편집 모드(팀장)에서 체크리스트 토글·추가·삭제 + 메모(append·삭제). 이름·시각 귀속.
// 실제 저장/실시간은 S4에서 Firestore 서브컬렉션으로 교체.
export default function TeamCard({ team, editable, name }) {
  const [items, setItems] = useState(() => (team.checklist || []).map((c) => ({ ...c, done: false, doneBy: null })))
  const [memos, setMemos] = useState([])
  const [draft, setDraft] = useState('')
  const [memo, setMemo] = useState('')
  const done = items.filter((i) => i.done).length

  const who = () => name || '익명'
  const toggle = (id) => setItems((p) => p.map((it) => (it.id === id ? { ...it, done: !it.done, doneBy: !it.done ? who() : null } : it)))
  const removeItem = (id) => setItems((p) => p.filter((it) => it.id !== id))
  const addItem = (e) => { e.preventDefault(); const t = draft.trim(); if (!t) return; setItems((p) => [...p, { id: 'n' + Date.now(), text: t, done: false, doneBy: null, addedBy: who() }]); setDraft('') }
  const addMemo = (e) => { e.preventDefault(); const t = memo.trim(); if (!t) return; setMemos((p) => [{ id: 'm' + Date.now(), text: t, by: who(), at: stamp() }, ...p]); setMemo('') }
  const removeMemo = (id) => setMemos((p) => p.filter((m) => m.id !== id))

  return (
    <article className={`${styles.card} lift`}>
      <header className={styles.head}>
        <span className={styles.emoji} aria-hidden="true">{team.emoji}</span>
        <div className={styles.titleWrap}>
          <h3 className={styles.name}>{team.name}</h3>
          <p className={styles.role}>{team.role}</p>
        </div>
      </header>

      <div className={styles.chips}>
        <Chip tone="leader" title="팀장">👑 {team.leader}</Chip>
        {team.members.map((n) => <Chip key={n}>{n}</Chip>)}
      </div>

      {team.reassignNote && <p className={styles.reassign}>🔄 {team.reassignNote}</p>}

      {/* 체크리스트 */}
      <div className={styles.block}>
        <div className={styles.blockHead}>
          <span className={styles.blockTitle}>체크리스트</span>
          <span className={`${styles.blockCount} tnum`}>{done}/{items.length}</span>
        </div>
        <ul className={styles.clList}>
          {items.map((it) => (
            <li key={it.id}>
              <CheckRow
                text={it.text} done={it.done} doneBy={it.doneBy}
                editable={editable}
                onToggle={() => toggle(it.id)} onRemove={() => removeItem(it.id)}
              />
            </li>
          ))}
        </ul>
        {editable && (
          <form className={styles.addRow} onSubmit={addItem}>
            <input className={styles.addInput} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="+ 항목 추가" />
            <button type="submit" className={`${styles.addBtn} pressable`}>추가</button>
          </form>
        )}
      </div>

      {/* 팀 메모 */}
      <div className={styles.block}>
        <span className={styles.blockTitle}>팀 메모</span>
        {memos.length > 0 && (
          <ul className={styles.memoList}>
            {memos.map((m) => (
              <li key={m.id} className={styles.memoItem}>
                <div className={styles.memoBody}>
                  <span>{m.text}</span>
                  <em>— {m.by} · {m.at}</em>
                </div>
                {editable && <button type="button" className={`${styles.memoDel} pressable`} onClick={() => removeMemo(m.id)} aria-label="메모 삭제">✕</button>}
              </li>
            ))}
          </ul>
        )}
        {editable ? (
          <form className={styles.addRow} onSubmit={addMemo}>
            <input className={styles.addInput} value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="메모 남기기…" />
            <button type="submit" className={`${styles.addBtn} pressable`}>등록</button>
          </form>
        ) : (memos.length === 0 && <p className={styles.memoEmpty}>편집 모드에서 진행상황·메모를 남길 수 있어요</p>)}
      </div>
    </article>
  )
}
