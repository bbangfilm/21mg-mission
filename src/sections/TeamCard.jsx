import { useState } from 'react'
import { Chip } from '../components/ui.jsx'
import CheckRow from '../components/CheckRow.jsx'
import { useCollection } from '../lib/useFirestore.js'
import { addItem, updateItem, removeItem, serverTimestamp } from '../lib/mutations.js'
import styles from './Teams.module.css'

const fmt = (ts) => {
  if (!ts?.toDate) return '방금'
  const d = ts.toDate()
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// 팀 카드 — 체크리스트/메모 Firestore 서브컬렉션 실시간.
export default function TeamCard({ team, editable, name }) {
  const clPath = `teams/${team.id}/checklists`
  const memoPath = `teams/${team.id}/memos`
  const { items } = useCollection(clPath, 'order')
  const { items: memos } = useCollection(memoPath)
  const [draft, setDraft] = useState('')
  const [memo, setMemo] = useState('')
  const done = items.filter((i) => i.done).length
  const who = () => name || '익명'

  const sortedMemos = [...memos].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))

  const toggle = (it) => updateItem(clPath, it.id, it.done
    ? { done: false, doneBy: null, doneAt: null }
    : { done: true, doneBy: who(), doneAt: serverTimestamp() })
  const removeCl = (id) => removeItem(clPath, id)
  const addCl = (e) => { e.preventDefault(); const text = draft.trim(); if (!text) return; addItem(clPath, { text, done: false, order: items.length, addedBy: who() }); setDraft('') }
  const addMemo = (e) => { e.preventDefault(); const text = memo.trim(); if (!text) return; addItem(memoPath, { text, by: who() }); setMemo('') }
  const removeMemo = (id) => removeItem(memoPath, id)

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
              <CheckRow text={it.text} done={it.done} doneBy={it.doneBy} editable={editable}
                onToggle={() => toggle(it)} onRemove={() => removeCl(it.id)} />
            </li>
          ))}
        </ul>
        {editable && (
          <form className={styles.addRow} onSubmit={addCl}>
            <input className={styles.addInput} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="+ 항목 추가" aria-label="체크리스트 항목 추가" maxLength={299} />
            <button type="submit" className={`${styles.addBtn} pressable`}>추가</button>
          </form>
        )}
      </div>

      {/* 팀 메모 */}
      <div className={styles.block}>
        <span className={styles.blockTitle}>팀 메모</span>
        {sortedMemos.length > 0 && (
          <ul className={styles.memoList}>
            {sortedMemos.map((m) => (
              <li key={m.id} className={styles.memoItem}>
                <div className={styles.memoBody}>
                  <span>{m.text}</span>
                  <em>— {m.by || '익명'} · {fmt(m.createdAt)}</em>
                </div>
                {editable && <button type="button" className={`${styles.memoDel} pressable`} onClick={() => removeMemo(m.id)} aria-label="메모 삭제">✕</button>}
              </li>
            ))}
          </ul>
        )}
        {editable ? (
          <form className={styles.addRow} onSubmit={addMemo}>
            <input className={styles.addInput} value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="메모 남기기…" aria-label="팀 메모 입력" maxLength={999} />
            <button type="submit" className={`${styles.addBtn} pressable`}>등록</button>
          </form>
        ) : (sortedMemos.length === 0 && <p className={styles.memoEmpty}>편집 모드(팀장)에서 진행상황·메모를 남길 수 있어요</p>)}
      </div>
    </article>
  )
}
