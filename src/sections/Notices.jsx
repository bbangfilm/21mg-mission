import { useState } from 'react'
import Section from '../components/Section.jsx'
import { Badge } from '../components/ui.jsx'
import { useEditMode } from '../context/EditModeContext.jsx'
import { useCollection } from '../lib/useFirestore.js'
import { addItem, updateItem, removeItem } from '../lib/mutations.js'
import styles from './Notices.module.css'

const PATH = 'notices'

// Firestore Timestamp → 'M/D HH:MM' (pending 이면 '방금')
const fmt = (ts) => {
  if (!ts?.toDate) return '방금'
  const d = ts.toDate()
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function Notices() {
  const { can, name } = useEditMode()
  const editable = can('admin')
  const { items, loading } = useCollection(PATH)
  const [draft, setDraft] = useState('')

  // 고정 먼저, 그 안에서 최신순
  const sorted = [...items].sort((a, b) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1
    return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
  })

  const add = (e) => { e.preventDefault(); const text = draft.trim(); if (!text) return; addItem(PATH, { text, pinned: false, by: name || '관리자' }); setDraft('') }
  const remove = (id) => removeItem(PATH, id)
  const togglePin = (n) => updateItem(PATH, n.id, { pinned: !n.pinned })

  return (
    <Section id="notices" eyebrow="Notice" title="공지사항" desc="리더가 올리는 변경·긴급 공지 · 상단 고정">
      <div className={`${styles.head} reveal`}>
        {editable
          ? <Badge tone="accent">관리자 · {name || '이름 미설정'}</Badge>
          : <Badge tone="muted">공지</Badge>}
        <span className={`${styles.count} tnum`}>{items.length}건</span>
      </div>

      {editable && (
        <form className={styles.addRow} onSubmit={add}>
          <input className={styles.addInput} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="공지 작성…" />
          <button type="submit" className={`${styles.addBtn} pressable`}>등록</button>
        </form>
      )}

      {loading ? (
        <p className={styles.hint}>불러오는 중…</p>
      ) : sorted.length === 0 ? (
        <p className={styles.empty}>등록된 공지가 없습니다{editable ? ' — 위에서 작성해 보세요.' : '.'}</p>
      ) : (
        <ul className={`${styles.list} stagger`}>
          {sorted.map((n) => (
            <li key={n.id} className={`${styles.item} ${n.pinned ? styles.pinned : ''}`}>
              <div className={styles.body}>
                {n.pinned && <span className={styles.pinTag}>📌 고정</span>}
                <p className={styles.text}>{n.text}</p>
                <span className={styles.meta}>— {n.by || '관리자'} · {fmt(n.createdAt)}</span>
              </div>
              {editable && (
                <div className={styles.actions}>
                  <button type="button" className={`${styles.pinBtn} ${n.pinned ? styles.pinOn : ''} pressable`} onClick={() => togglePin(n)} aria-label={n.pinned ? '고정 해제' : '상단 고정'}>📌</button>
                  <button type="button" className={`${styles.del} pressable`} onClick={() => remove(n.id)} aria-label="공지 삭제">✕</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className={styles.hint}>
        {editable
          ? '✏️ 등록·고정(📌)·삭제가 실시간 저장됩니다.'
          : '리더가 올리는 변경·긴급 공지가 여기에 상단 고정으로 표시됩니다.'}
      </p>
    </Section>
  )
}
