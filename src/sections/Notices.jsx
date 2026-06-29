import { useState } from 'react'
import Section from '../components/Section.jsx'
import { Badge } from '../components/ui.jsx'
import { noticesSeed } from '../data/notices.js'
import { useEditMode } from '../context/EditModeContext.jsx'
import styles from './Notices.module.css'

const stamp = () => {
  const d = new Date()
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// 01. 공지사항 — 관리자(PIN)만 등록·고정·삭제. 실시간 저장은 S4(Firestore).
export default function Notices() {
  const { can, name } = useEditMode()
  const editable = can('admin')
  const [items, setItems] = useState(() => noticesSeed.map((n) => ({ ...n })))
  const [draft, setDraft] = useState('')

  // 고정 먼저, 나머지는 입력 순서 유지(시드는 최신순)
  const sorted = [...items].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))

  const add = (e) => { e.preventDefault(); const t = draft.trim(); if (!t) return; setItems((p) => [{ id: 'nt' + Date.now(), text: t, pinned: false, by: name || '관리자', at: stamp() }, ...p]); setDraft('') }
  const remove = (id) => setItems((p) => p.filter((n) => n.id !== id))
  const togglePin = (id) => setItems((p) => p.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)))

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

      {sorted.length === 0 ? (
        <p className={styles.empty}>등록된 공지가 없습니다{editable ? ' — 위에서 작성해 보세요.' : '.'}</p>
      ) : (
        <ul className={`${styles.list} stagger`}>
          {sorted.map((n) => (
            <li key={n.id} className={`${styles.item} ${n.pinned ? styles.pinned : ''}`}>
              <div className={styles.body}>
                {n.pinned && <span className={styles.pinTag}>📌 고정</span>}
                <p className={styles.text}>{n.text}</p>
                <span className={styles.meta}>— {n.by} · {n.at}</span>
              </div>
              {editable && (
                <div className={styles.actions}>
                  <button type="button" className={`${styles.pinBtn} ${n.pinned ? styles.pinOn : ''} pressable`} onClick={() => togglePin(n.id)} aria-label={n.pinned ? '고정 해제' : '상단 고정'}>📌</button>
                  <button type="button" className={`${styles.del} pressable`} onClick={() => remove(n.id)} aria-label="공지 삭제">✕</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className={styles.hint}>
        {editable
          ? '✏️ 관리자가 공지를 등록·고정(📌)·삭제합니다. (미리보기 · 실제 저장은 Firebase 연결 후)'
          : '리더가 올리는 변경·긴급 공지가 여기에 상단 고정으로 표시됩니다.'}
      </p>
    </Section>
  )
}
