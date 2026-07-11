import { useState } from 'react'
import Section from '../components/Section.jsx'
import { Chip } from '../components/ui.jsx'
import { teams, supportRoles } from '../data/teams.js'
import { useEditMode } from '../context/EditModeContext.jsx'
import { useCollection } from '../lib/useFirestore.js'
import { addItem, updateItem, removeItem, setDocData } from '../lib/mutations.js'
import TeamCard from './TeamCard.jsx'
import styles from './Teams.module.css'

const PATH = 'supportRoles'
const parsePeople = (txt) => String(txt || '').split(/[·,]/).map((s) => s.trim()).filter(Boolean)

export default function Teams() {
  const { can, name } = useEditMode()
  const editable = can('team')
  const { items } = useCollection(PATH, 'order')
  const seeded = items.length > 0
  // Firestore 데이터가 있으면 그걸, 없으면 정적 폴백(teams.js)을 표시
  const list = seeded
    ? items
    : supportRoles.map((r, i) => ({ id: 'seed-' + i, role: r.role, people: r.people, order: i, _seed: true }))

  const who = () => name || '익명'
  const [drafts, setDrafts] = useState({})
  const [adding, setAdding] = useState({ role: '', people: '' })
  const [seeding, setSeeding] = useState(false)

  const upd = (it, field, val) =>
    setDrafts((s) => ({ ...s, [it.id]: { role: it.role, people: (it.people || []).join(' · '), ...s[it.id], [field]: val } }))
  const saveRole = (it) => {
    const d = drafts[it.id]
    if (!d) return
    updateItem(PATH, it.id, { role: (d.role || '').trim() || it.role, people: parsePeople(d.people) })
    setDrafts((s) => { const n = { ...s }; delete n[it.id]; return n })
  }
  // 결정적 ID(seed-i) setDoc = 멱등 — 연타·두 기기 동시 클릭에도 중복 생성 없음(addDoc이면 2벌 생김)
  const seedAll = async () => {
    if (seeding) return
    setSeeding(true)
    try {
      await Promise.all(supportRoles.map((r, i) =>
        setDocData(`${PATH}/seed-${i}`, { role: r.role, people: r.people, order: i, addedBy: who() })))
    } finally { setSeeding(false) }
  }
  const addRole = (e) => {
    e.preventDefault()
    const role = adding.role.trim()
    if (!role) return
    addItem(PATH, { role, people: parsePeople(adding.people), order: list.length, addedBy: who() })
    setAdding({ role: '', people: '' })
  }

  return (
    <Section id="teams" eyebrow="Serving Teams" title="다섯 팀, 한 사역" desc="5팀 + 지원역할 · 오병이어 운영">
      <div className={`${styles.grid} stagger`}>
        {teams.map((t) => (
          <TeamCard key={t.id} team={t} editable={editable} name={name} />
        ))}
      </div>

      <div className={`${styles.support} reveal`}>
        <h3 className={styles.supportTitle}>지원 역할</h3>

        {editable && seeded ? (
          <div className={styles.supportEdit}>
            {list.map((it) => (
              <div key={it.id} className={styles.supportRow}>
                <input className={`${styles.supportInput} ${styles.supportRoleInput}`}
                  value={drafts[it.id]?.role ?? it.role} maxLength={99}
                  onChange={(e) => upd(it, 'role', e.target.value)} aria-label="역할명" />
                <input className={styles.supportInput}
                  value={drafts[it.id]?.people ?? (it.people || []).join(' · ')}
                  onChange={(e) => upd(it, 'people', e.target.value)} placeholder="이름 · 이름" aria-label="담당자" />
                <button className={`${styles.supportSave} pressable`} onClick={() => saveRole(it)}>저장</button>
                <button className={`${styles.supportDel} pressable`} onClick={() => removeItem(PATH, it.id)} aria-label="역할 삭제">✕</button>
              </div>
            ))}
            <form className={styles.supportRow} onSubmit={addRole}>
              <input className={`${styles.supportInput} ${styles.supportRoleInput}`}
                value={adding.role} onChange={(e) => setAdding((a) => ({ ...a, role: e.target.value }))}
                placeholder="+ 새 역할" aria-label="새 역할명" maxLength={99} />
              <input className={styles.supportInput}
                value={adding.people} onChange={(e) => setAdding((a) => ({ ...a, people: e.target.value }))}
                placeholder="이름 · 이름" aria-label="새 역할 담당자" />
              <button type="submit" className={`${styles.supportSave} pressable`}>추가</button>
            </form>
          </div>
        ) : (
          <div className={styles.supportChips}>
            {list.map((r) => (
              <span key={r.id || r.role} className={styles.supportItem}>
                <Chip tone="role">{r.role}</Chip>
                <span className={styles.supportPeople}>{(r.people || []).join(' · ')}</span>
              </span>
            ))}
          </div>
        )}

        {editable && !seeded && (
          <button className={`${styles.supportSeedBtn} pressable`} onClick={seedAll} disabled={seeding}>
            {seeding ? '불러오는 중…' : '✏️ 편집하려면 기본 역할 불러오기'}
          </button>
        )}

        <p className={styles.note}>※ 셀(참가)과 팀(사역)은 별개 — 한 사람이 여러 셀·팀·역할에 속할 수 있습니다.</p>
      </div>
    </Section>
  )
}
