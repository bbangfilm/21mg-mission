import { useState } from 'react'
import Section from '../components/Section.jsx'
import { Badge, ProgressBar } from '../components/ui.jsx'
import CheckRow from '../components/CheckRow.jsx'
import { bazaarCategories } from '../data/todos.js'
import { useEditMode } from '../context/EditModeContext.jsx'
import { useCollection } from '../lib/useFirestore.js'
import { addItem, updateItem, removeItem, serverTimestamp } from '../lib/mutations.js'
import styles from './Bazaar.module.css'

const PATH = 'bazaarItems'

export default function Bazaar() {
  const { can, name } = useEditMode()
  const editable = can('team')
  const { items, loading } = useCollection(PATH, 'order')
  const [drafts, setDrafts] = useState({})
  const done = items.filter((i) => i.done).length
  const who = () => name || '익명'

  const toggle = (it) => updateItem(PATH, it.id, it.done
    ? { done: false, doneBy: null, doneAt: null }
    : { done: true, doneBy: who(), doneAt: serverTimestamp() })
  const remove = (id) => removeItem(PATH, id)
  const addToCat = (cat, e) => {
    e.preventDefault()
    const nm = (drafts[cat] || '').trim()
    if (!nm) return
    addItem(PATH, { name: nm, category: cat, done: false, order: items.length, addedBy: who() })
    setDrafts((d) => ({ ...d, [cat]: '' }))
  }

  return (
    <Section id="bazaar" eyebrow="Bazaar" title="오병이어 바자회 품목" desc="의류 · 생활용품 · 먹거리">
      <div className={`${styles.head} reveal`}>
        {editable
          ? <Badge tone="success">편집 모드 · {name || '이름 미설정'}</Badge>
          : <Badge tone="muted">실시간</Badge>}
        <span className={styles.pbar}><ProgressBar value={done} max={items.length || 1} tone="success" label="바자회 준비 완료율" valueText={`${items.length}개 중 ${done}개 완료`} /></span>
      </div>

      <div className={`${styles.cats} stagger`}>
        {bazaarCategories.map((cat) => (
          <div key={cat} className={styles.cat}>
            <h3 className={styles.catTitle}>{cat}</h3>
            <ul className={styles.list}>
              {items.filter((i) => i.category === cat).map((it) => (
                <li key={it.id}>
                  <CheckRow text={it.name} done={it.done} doneBy={it.doneBy} editable={editable}
                    onToggle={() => toggle(it)} onRemove={() => remove(it.id)} />
                </li>
              ))}
            </ul>
            {!loading && items.filter((i) => i.category === cat).length === 0 && (
              <p className={styles.catEmpty}>아직 품목이 없습니다</p>
            )}
            {editable && (
              <form className={styles.addRow} onSubmit={(e) => addToCat(cat, e)}>
                <input className={styles.addInput} value={drafts[cat] || ''}
                  onChange={(e) => setDrafts((d) => ({ ...d, [cat]: e.target.value }))}
                  placeholder={`+ ${cat} 품목 추가`} aria-label={`${cat} 품목 추가`} />
                <button type="submit" className={`${styles.addBtn} pressable`}>추가</button>
              </form>
            )}
          </div>
        ))}
      </div>

      <p className={styles.hint}>
        {editable
          ? '✏️ 품목 추가·체크·삭제가 실시간 저장됩니다.'
          : '실제 리스트가 정해지면 팀장이 등록합니다. 우하단 편집 모드에서 체크할 수 있어요.'}
      </p>
    </Section>
  )
}
