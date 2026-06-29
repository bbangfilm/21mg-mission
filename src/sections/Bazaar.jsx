import { useState } from 'react'
import Section from '../components/Section.jsx'
import { Badge, ProgressBar } from '../components/ui.jsx'
import CheckRow from '../components/CheckRow.jsx'
import { bazaarSeed, bazaarCategories } from '../data/todos.js'
import { useEditMode } from '../context/EditModeContext.jsx'
import styles from './Bazaar.module.css'

// S4에서 bazaarItems 실시간 구독 + 팀장 PIN 체크/추가로 교체. 지금은 로컬 미리보기.
export default function Bazaar() {
  const { can, name } = useEditMode()
  const editable = can('team')
  const [items, setItems] = useState(() => bazaarSeed.map((b) => ({ ...b, doneBy: null })))
  const [drafts, setDrafts] = useState({})
  const done = items.filter((i) => i.done).length

  const toggle = (id) => setItems((p) => p.map((it) => (it.id === id ? { ...it, done: !it.done, doneBy: !it.done ? (name || '익명') : null } : it)))
  const remove = (id) => setItems((p) => p.filter((it) => it.id !== id))
  const addItem = (cat, e) => {
    e.preventDefault()
    const t = (drafts[cat] || '').trim()
    if (!t) return
    setItems((p) => [...p, { id: 'bz' + Date.now(), category: cat, name: t, done: false, doneBy: null, addedBy: name || '익명' }])
    setDrafts((d) => ({ ...d, [cat]: '' }))
  }

  return (
    <Section id="bazaar" eyebrow="Bazaar" title="오병이어 바자회 품목" desc="의류 · 생활용품 · 먹거리">
      <div className={`${styles.head} reveal`}>
        {editable
          ? <Badge tone="success">편집 모드 · {name || '이름 미설정'}</Badge>
          : <Badge tone="muted">실시간 준비중</Badge>}
        <span className={styles.pbar}><ProgressBar value={done} max={items.length} tone="success" /></span>
      </div>

      <div className={`${styles.cats} stagger`}>
        {bazaarCategories.map((cat) => (
          <div key={cat} className={styles.cat}>
            <h3 className={styles.catTitle}>{cat}</h3>
            <ul className={styles.list}>
              {items.filter((i) => i.category === cat).map((it) => (
                <li key={it.id}>
                  <CheckRow
                    text={it.name} done={it.done} doneBy={it.doneBy}
                    editable={editable}
                    onToggle={() => toggle(it.id)} onRemove={() => remove(it.id)}
                  />
                </li>
              ))}
            </ul>
            {editable && (
              <form className={styles.addRow} onSubmit={(e) => addItem(cat, e)}>
                <input
                  className={styles.addInput}
                  value={drafts[cat] || ''}
                  onChange={(e) => setDrafts((d) => ({ ...d, [cat]: e.target.value }))}
                  placeholder={`+ ${cat} 품목 추가`}
                  aria-label={`${cat} 품목 추가`}
                />
                <button type="submit" className={`${styles.addBtn} pressable`}>추가</button>
              </form>
            )}
          </div>
        ))}
      </div>

      <p className={styles.hint}>
        {editable
          ? '✏️ 준비된 품목을 체크하면 이름이 기록됩니다. (미리보기 · 실제 저장은 Firebase 연결 후)'
          : '예시 품목입니다 — 실제 리스트가 정해지면 반영됩니다. 우하단 편집 모드에서 팀장이 체크할 수 있어요.'}
      </p>
    </Section>
  )
}
