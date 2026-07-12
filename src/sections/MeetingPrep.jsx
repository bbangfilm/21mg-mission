import { useMemo } from 'react'
import Section from '../components/Section.jsx'
import { Chip } from '../components/ui.jsx'
import CheckRow from '../components/CheckRow.jsx'
import { useEditMode } from '../context/EditModeContext.jsx'
import { useCollection } from '../lib/useFirestore.js'
import { setDocData } from '../lib/mutations.js'
import { meetingPaths } from '../data/meetings.js'
import styles from './Meeting.module.css'

// 분임 4코너(정적) + 회의 전 준비 체크(itemsCol/{id} 오버레이) + D-Day 역산 마감(정적)
export default function MeetingPrep({ meeting }) {
  const { corners, prepItems, milestones } = meeting
  const { itemsCol } = meetingPaths(meeting)
  const { can, name } = useEditMode()
  const editable = can('team')
  const { items } = useCollection(itemsCol)
  const state = useMemo(() => Object.fromEntries(items.map((d) => [d.id, d])), [items])

  const toggle = (p) => setDocData(`${itemsCol}/${p.id}`, state[p.id]?.done
    ? { done: false, by: null }
    : { done: true, by: name || '익명' })

  return (
    <Section id="meeting-prep" eyebrow="Breakout · Prep" title="분임 코너 · 준비">
      <h3 className={styles.subhead}>팀별 분임 {corners.length}코너 <span className={styles.subheadSub}>· 25분</span></h3>
      <div className={`${styles.corners} stagger`}>
        {corners.map((c) => (
          <div key={c.id} className={styles.corner}>
            <div className={styles.cornerHead}><span aria-hidden="true">{c.emoji}</span> {c.name}</div>
            <p className={styles.cornerTask}>{c.task}</p>
            <div className={styles.chips}>{c.people.map((p) => <Chip key={p}>{p}</Chip>)}</div>
          </div>
        ))}
      </div>

      <h3 className={styles.subhead}>회의 전 준비</h3>
      <ul className={`${styles.prepList} stagger`}>
        {prepItems.map((p) => (
          <li key={p.id}>
            <CheckRow text={p.text} done={!!state[p.id]?.done} doneBy={state[p.id]?.by}
              editable={editable} onToggle={() => toggle(p)} />
          </li>
        ))}
      </ul>

      <h3 className={styles.subhead}>D-Day 역산 마감 <span className={styles.subheadSub}>· 8/14(금)까지</span></h3>
      <ul className={styles.milestones}>
        {milestones.map((m) => (
          <li key={m.text} className={styles.ms}>
            <span className={styles.msDate}>{m.date}</span>
            <span>{m.text}</span>
          </li>
        ))}
      </ul>
    </Section>
  )
}
