import { useState } from 'react'
import Section from '../components/Section.jsx'
import { Badge } from '../components/ui.jsx'
import CheckRow from '../components/CheckRow.jsx'
import { todosSeed } from '../data/todos.js'
import { useEditMode } from '../context/EditModeContext.jsx'
import styles from './Todos.module.css'

// 편집 모드(팀장)에서 체크·추가·삭제 + 이름 귀속 미리보기. 실시간 저장은 S4(Firestore).
export default function Todos({ items: seed = todosSeed }) {
  const { can, name } = useEditMode()
  const editable = can('team')
  const [items, setItems] = useState(() => seed.map((t) => ({ ...t, done: !!t.done, doneBy: null })))
  const [draft, setDraft] = useState('')
  const done = items.filter((i) => i.done).length

  const who = () => name || '익명'
  const toggle = (id) => setItems((p) => p.map((it) => (it.id === id ? { ...it, done: !it.done, doneBy: !it.done ? who() : null } : it)))
  const remove = (id) => setItems((p) => p.filter((it) => it.id !== id))
  const add = (e) => { e.preventDefault(); const t = draft.trim(); if (!t) return; setItems((p) => [...p, { id: 'td' + Date.now(), text: t, done: false, doneBy: null, addedBy: who() }]); setDraft('') }

  return (
    <Section id="todos" eyebrow="This Week" title="이번 주 할 일" desc="공동 To-Do">
      <div className={`${styles.head} reveal`}>
        {editable
          ? <Badge tone="success">편집 모드 · {name || '이름 미설정'}</Badge>
          : <Badge tone="muted">실시간 준비중</Badge>}
        <span className={`${styles.count} tnum`}>{done} / {items.length} 완료</span>
      </div>

      <ul className={`${styles.list} stagger`}>
        {items.map((t) => (
          <li key={t.id}>
            <CheckRow
              text={t.text} done={t.done} doneBy={t.doneBy}
              editable={editable}
              onToggle={() => toggle(t.id)} onRemove={() => remove(t.id)}
            />
          </li>
        ))}
      </ul>

      {editable && (
        <form className={styles.addRow} onSubmit={add}>
          <input className={styles.addInput} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="+ 할 일 추가" />
          <button type="submit" className={`${styles.addBtn} pressable`}>추가</button>
        </form>
      )}

      <p className={styles.hint}>
        {editable
          ? '✏️ 체크·추가·삭제하면 이름이 기록됩니다. (미리보기 · 실제 저장은 Firebase 연결 후)'
          : '우하단 편집 모드에서 팀장이 체크하면 누가·언제가 실시간으로 공유됩니다.'}
      </p>
    </Section>
  )
}
