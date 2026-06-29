import Section from '../components/Section.jsx'
import { Badge } from '../components/ui.jsx'
import CheckRow from '../components/CheckRow.jsx'
import { useEditMode } from '../context/EditModeContext.jsx'
import { useCollection } from '../lib/useFirestore.js'
import { addItem, updateItem, removeItem, serverTimestamp } from '../lib/mutations.js'
import { useState } from 'react'
import styles from './Todos.module.css'

const PATH = 'todos'

// 실시간(Firestore). 팀장이 체크·추가·삭제 → 모든 기기에 즉시 반영·영구 저장.
export default function Todos() {
  const { can, name } = useEditMode()
  const editable = can('team')
  const { items, loading } = useCollection(PATH, 'order')
  const [draft, setDraft] = useState('')
  const done = items.filter((i) => i.done).length
  const who = () => name || '익명'

  const toggle = (t) => updateItem(PATH, t.id, t.done
    ? { done: false, doneBy: null, doneAt: null }
    : { done: true, doneBy: who(), doneAt: serverTimestamp() })
  const remove = (id) => removeItem(PATH, id)
  const add = (e) => { e.preventDefault(); const text = draft.trim(); if (!text) return; addItem(PATH, { text, done: false, order: items.length, addedBy: who() }); setDraft('') }

  return (
    <Section id="todos" eyebrow="This Week" title="이번 주 할 일" desc="공동 To-Do">
      <div className={`${styles.head} reveal`}>
        {editable
          ? <Badge tone="success">편집 모드 · {name || '이름 미설정'}</Badge>
          : <Badge tone="muted">실시간</Badge>}
        <span className={`${styles.count} tnum`}>{done} / {items.length} 완료</span>
      </div>

      {loading ? (
        <p className={styles.hint}>불러오는 중…</p>
      ) : (
        <ul className={`${styles.list} stagger`}>
          {items.map((t) => (
            <li key={t.id}>
              <CheckRow text={t.text} done={t.done} doneBy={t.doneBy} editable={editable}
                onToggle={() => toggle(t)} onRemove={() => remove(t.id)} />
            </li>
          ))}
        </ul>
      )}

      {!loading && items.length === 0 && !editable && (
        <p className={styles.hint}>아직 등록된 할 일이 없습니다.</p>
      )}

      {editable && (
        <form className={styles.addRow} onSubmit={add}>
          <input className={styles.addInput} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="+ 할 일 추가" />
          <button type="submit" className={`${styles.addBtn} pressable`}>추가</button>
        </form>
      )}

      <p className={styles.hint}>
        {editable
          ? '✏️ 체크·추가·삭제가 모든 기기에 실시간 저장됩니다.'
          : '우하단 편집 모드(팀장)에서 체크하면 누가 했는지 실시간으로 공유됩니다.'}
      </p>
    </Section>
  )
}
